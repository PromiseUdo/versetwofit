// src/app/admin/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Plus,
  X,
  Loader2,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Save,
  List,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductFormData, productSchema } from '@/schemas/product.schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Button } from '@/components/ui/button';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<number[]>([]);
  const [currentAboutItem, setCurrentAboutItem] = useState('');
  const [currentSpecKey, setCurrentSpecKey] = useState('');
  const [currentSpecValue, setCurrentSpecValue] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      images: [],
      variants: [{ color: '', size: '', sku: '', stock: '0', price: '' }],
      aboutItems: [],
      specifications: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'variants',
  });

  const {
    fields: aboutFields,
    append: appendAboutItem,
    remove: removeAboutItem,
  } = useFieldArray({
    control,
    name: 'aboutItems',
  });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control,
    name: 'specifications',
  });

  const images = watch('images');

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await axios.get(`/api/admin/products/${id}`);
        const product = response.data;

        setValue('name', product.name);
        setValue('description', product.description);
        setValue('price', product.price.toString());
        setValue('comparePrice', product.comparePrice?.toString() || '');
        setValue('categoryId', product.categoryId);
        setValue('featured', product.featured);
        setValue('images', product.images || []);

        // Handle variants
        const formattedVariants =
          product.variants?.length > 0
            ? product.variants.map((v: any) => ({
                color: v.color || '',
                size: v.size || '',
                sku: v.sku || '',
                stock: v.stock?.toString() || '0',
                price: v.price?.toString() || '',
              }))
            : [{ color: '', size: '', sku: '', stock: '0', price: '' }];

        setValue('variants', formattedVariants);

        // Handle aboutItems
        const formattedAboutItems =
          product.aboutItems?.length > 0
            ? product.aboutItems.map((item: string) => ({ value: item }))
            : [];

        setValue('aboutItems', formattedAboutItems);

        // Handle specifications
        const formattedSpecs =
          product.specifications?.length > 0
            ? product.specifications.map((spec: any) => ({
                key: spec.key,
                value: spec.value,
              }))
            : [];

        setValue('specifications', formattedSpecs);
      } catch (error) {
        toast.error('Failed to load product');
        router.push('/admin/products');
      } finally {
        setIsLoadingProduct(false);
      }
    };

    if (id) loadProduct();
  }, [id, router, setValue]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        toast.error('Failed to load categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploadingImages(files.map((_, i) => i));

    try {
      const currentImages = watch('images') || [];

      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return response.data.imageUrl;
        })
      );

      setValue('images', [...currentImages, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload images');
    } finally {
      setUploadingImages([]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setValue('images', newImages);
    toast.success('Image removed');
  };

  const generateSKU = (index: number) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    setValue(`variants.${index}.sku`, `SKU-${timestamp}-${random}`);
  };

  const addAboutItem = () => {
    if (currentAboutItem.trim()) {
      appendAboutItem({ value: currentAboutItem.trim() });
      setCurrentAboutItem('');
    }
  };

  const addSpecification = () => {
    if (currentSpecKey.trim() && currentSpecValue.trim()) {
      appendSpec({
        key: currentSpecKey.trim(),
        value: currentSpecValue.trim(),
      });
      setCurrentSpecKey('');
      setCurrentSpecValue('');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      await axios.put(`/api/admin/products/${id}`, data);
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Update product error:', error);
      toast.error(error.response?.data?.error || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="w-full mx-auto flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          Loading product...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update product details, images, and variants
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Basic Information
          </h2>

          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <Input
                type="text"
                {...register('name')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-neutral-700 text-gray-900 dark:text-white"
                placeholder="e.g., Classic Cotton T-Shirt"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <Textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border-none dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-neutral-700 text-gray-900 dark:text-white"
                placeholder="Describe your product in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (₦) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register('price')}
                  className="w-full px-4 py-3 bg-neutral-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compare at Price (₦)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('comparePrice')}
                  className="w-full px-4 py-3 border-none bg-neutral-700 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Show discount from this price
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              {isLoadingCategories ? (
                <div className="py-3 text-gray-500 dark:text-gray-400">
                  Loading categories...
                </div>
              ) : (
                <select
                  {...register('categoryId')}
                  className="w-full px-4 py-3 border-none dark:border-gray-700 rounded-lg focus:ring-0 focus:border-transparent bg-neutral-700 text-gray-900 dark:text-white focus-visible:ring-neutral-400 focus-visible:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
              <Link
                href="/admin/categories/new"
                className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
              >
                + Create new category
              </Link>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3">
              <Input
                type="checkbox"
                {...register('featured')}
                className="w-5 h-5 text-indigo-600 focus-visible:ring-neutral-400 focus-visible:outline-none border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Feature this product on homepage
              </label>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Product Images
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Images will be uploaded to Cloudinary and automatically optimized
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images?.map((image: string, index: number) => (
              <div key={index} className="relative group aspect-square">
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                >
                  <X size={16} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-indigo-600 text-white text-xs font-semibold rounded">
                    Main Image
                  </span>
                )}
              </div>
            ))}

            {uploadingImages.map((_, index) => (
              <div
                key={`loading-${index}`}
                className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800"
              >
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Uploading...
                </span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <FileUpload onChange={handleFileUpload} multiple={true} />
          </div>

          {errors.images && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.images.message}
            </p>
          )}
          <div className="flex items-start gap-2 p-4 bg-neutral-700 border-none rounded-lg mt-4">
            <AlertCircle
              size={16}
              className="text-yellow-600 shrink-0 mt-0.5"
            />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1 text-yellow-600">
                Image Upload Guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-white">
                <li>Supported formats: JPEG, PNG, WebP, GIF</li>
                <li>Maximum file size: 10MB per image</li>
                <li>Images will be automatically optimized and resized</li>
                <li>First image will be the main product image</li>
              </ul>
            </div>
          </div>
        </div>

        {/* About This Item */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border-none">
          <div className="flex items-center gap-2 mb-4">
            {/* <List size={20} className="text-indigo-600" /> */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              About This Item
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Add bullet points highlighting key features (displayed as a list on
            product page)
          </p>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={currentAboutItem}
                onChange={(e) => setCurrentAboutItem(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addAboutItem())
                }
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-neutral-700 text-gray-900 w-96 dark:text-white"
                placeholder="e.g., Made from 100% organic cotton"
              />
              <button
                type="button"
                onClick={addAboutItem}
                className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                <Plus size={20} />
              </button>
            </div>

            {aboutFields.length > 0 && (
              <div className="space-y-2">
                {aboutFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 p-3 bg-neutral-700 rounded-lg"
                  >
                    <span className="text-indigo-600">•</span>
                    <span className="flex-1 text-sm text-gray-900 dark:text-white">
                      {watch(`aboutItems.${index}.value`)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAboutItem(index)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Specifications */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border-none">
          <div className="flex items-center gap-2 mb-4">
            {/* <FileText size={20} className="text-indigo-600" /> */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Product Specifications
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Add technical specifications as key-value pairs (e.g., Material:
            Cotton)
          </p>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={currentSpecKey}
                onChange={(e) => setCurrentSpecKey(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-neutral-700 text-gray-900 dark:text-white"
                placeholder="Key (e.g., Material)"
              />
              <Input
                type="text"
                value={currentSpecValue}
                onChange={(e) => setCurrentSpecValue(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addSpecification())
                }
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-neutral-700 text-gray-900 dark:text-white"
                placeholder="Value (e.g., 100% Cotton)"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                <Plus size={20} />
              </button>
            </div>

            {specFields.length > 0 && (
              <div className="space-y-2">
                {specFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 p-3 bg-neutral-700 rounded-lg"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <span className="text-sm font-medium text-gray-400">
                        {watch(`specifications.${index}.key`)}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {watch(`specifications.${index}.value`)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-neutral-800 rounded-xl shadow-md p-6 border-none">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Variants
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Add color and size options for this product
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                appendVariant({
                  color: '',
                  size: '',
                  sku: '',
                  stock: '0',
                  price: '',
                })
              }
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              <Plus size={20} />
              Add Variant
            </button>
          </div>

          <div className="space-y-4">
            {variantFields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border-none rounded-lg bg-neutral-900"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Variant {index + 1}
                  </h3>
                  {variantFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color
                    </label>
                    <Input
                      type="text"
                      {...register(`variants.${index}.color`)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-neutral-800 text-gray-900 dark:text-white"
                      placeholder="e.g., Red"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Size
                    </label>
                    <Input
                      type="text"
                      {...register(`variants.${index}.size`)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-neutral-800 text-gray-900 dark:text-white"
                      placeholder="e.g., M"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SKU *
                    </label>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="text"
                        {...register(`variants.${index}.sku`)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-neutral-800 text-gray-900 dark:text-white"
                        placeholder="SKU-123"
                      />
                      <button
                        type="button"
                        onClick={() => generateSKU(index)}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-medium"
                      >
                        Gen
                      </button>
                    </div>
                    {errors.variants?.[index]?.sku && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.variants[index]?.sku?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock *
                    </label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock`)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-neutral-800 text-gray-900 dark:text-white"
                      placeholder="0"
                    />
                    {errors.variants?.[index]?.stock && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.variants[index]?.stock?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (₦)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.price`)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-neutral-800 text-gray-900 dark:text-white"
                      placeholder="Optional"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Leave empty to use base price
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.variants && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.variants.message}
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImages.length > 0}
            className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating Product...
              </>
            ) : (
              <>
                <Save size={20} />
                Update Product
              </>
            )}
          </Button>

          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
