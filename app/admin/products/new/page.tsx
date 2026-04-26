"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductFormData, productSchema } from "@/schemas/product.schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { ProductVariantsSection } from "@/components/admin/product-variants-section";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<number[]>([]);
  const [currentAboutItem, setCurrentAboutItem] = useState("");
  const [currentSpecKey, setCurrentSpecKey] = useState("");
  const [currentSpecValue, setCurrentSpecValue] = useState("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      images: [],
      options: [],
      variants: [],
      aboutItems: [],
      specifications: [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const {
    fields: aboutFields,
    append: appendAboutItem,
    remove: removeAboutItem,
  } = useFieldArray({ control, name: "aboutItems" });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({ control, name: "specifications" });

  const images = watch("images");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleFileUpload = async (files: File[]) => {
    setUploadingImages(files.map((_, i) => i));
    try {
      const currentImages = watch("images") || [];
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const response = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return response.data.imageUrl;
        })
      );
      setValue("images", [...currentImages, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to upload images");
    } finally {
      setUploadingImages([]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setValue("images", newImages);
  };

  const addAboutItem = () => {
    if (currentAboutItem.trim()) {
      appendAboutItem({ value: currentAboutItem.trim() });
      setCurrentAboutItem("");
    }
  };

  const addSpecification = () => {
    if (currentSpecKey.trim() && currentSpecValue.trim()) {
      appendSpec({ key: currentSpecKey.trim(), value: currentSpecValue.trim() });
      setCurrentSpecKey("");
      setCurrentSpecValue("");
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/admin/products", data);
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Product
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add a new product to your store with images and detailed information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Basic Information
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name *
              </label>
              <Input
                type="text"
                {...register("name")}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-neutral-700 text-gray-900 dark:text-white"
                placeholder="e.g., Classic Cotton T-Shirt"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <Textarea
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 border-none rounded-lg bg-neutral-700 text-gray-900 dark:text-white"
                placeholder="Describe your product in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price ($) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("price")}
                  className="w-full px-4 py-3 bg-neutral-700 rounded-lg text-gray-900 dark:text-white"
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
                  Compare at Price ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("comparePrice")}
                  className="w-full px-4 py-3 border-none bg-neutral-700 rounded-lg text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Show discount from this price
                </p>
              </div>
            </div>

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
                  {...register("categoryId")}
                  className="w-full px-4 py-3 border-none rounded-lg bg-neutral-700 text-gray-900 dark:text-white focus-visible:outline-none"
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

            <div className="flex items-center gap-3">
              <Input
                type="checkbox"
                {...register("featured")}
                className="w-5 h-5 text-indigo-600 focus-visible:outline-none"
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
            {images.map((image, index) => (
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
            <AlertCircle size={16} className="text-yellow-600 shrink-0 mt-0.5" />
            <ul className="list-disc list-inside space-y-1 text-xs text-white">
              <li>Supported formats: JPEG, PNG, WebP, GIF</li>
              <li>Maximum file size: 10MB per image</li>
              <li>Images will be automatically optimized and resized</li>
              <li>First image will be the main product image</li>
            </ul>
          </div>
        </div>

        {/* About This Item */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            About This Item
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Add bullet points highlighting key features
          </p>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={currentAboutItem}
                onChange={(e) => setCurrentAboutItem(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAboutItem())
                }
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-neutral-700 text-gray-900 dark:text-white"
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Product Specifications
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Add technical specifications as key-value pairs (e.g., Material: Cotton)
          </p>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                value={currentSpecKey}
                onChange={(e) => setCurrentSpecKey(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-neutral-700 text-gray-900 dark:text-white"
                placeholder="Key (e.g., Material)"
              />
              <Input
                type="text"
                value={currentSpecValue}
                onChange={(e) => setCurrentSpecValue(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSpecification())
                }
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-neutral-700 text-gray-900 dark:text-white"
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

        {/* Variants — new component */}
        <ProductVariantsSection form={form} />

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImages.length > 0}
            className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Product...
              </>
            ) : (
              <>
                <Plus size={20} />
                Create Product
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
