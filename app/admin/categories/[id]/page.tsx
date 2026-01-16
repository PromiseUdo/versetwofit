// src/app/admin/categories/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productCount, setProductCount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const imageUrl = watch('image');

  // Load category data
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await axios.get(`/api/admin/categories/${id}`);
        const category = response.data;

        setValue('name', category.name);
        setValue('description', category.description || '');
        setValue('image', category.image || '');
        setProductCount(category._count.products);
      } catch (error) {
        toast.error('Failed to load category');
        router.push('/admin/categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [id, router, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setValue('image', response.data.imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Reset input value to allow re-uploading the same file
      if (e.target) e.target.value = '';
    }
  };

  const removeImage = () => {
    setValue('image', '');
    toast.success('Image removed');
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);

    try {
      await axios.put(`/api/admin/categories/${id}`, data);
      toast.success('Category updated successfully!');
      router.push('/admin/categories');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (productCount > 0) {
      toast.error(`Cannot delete category with ${productCount} product(s)`);
      return;
    }

    if (
      !confirm(
        'Are you sure you want to delete this category? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success('Category deleted successfully');
      router.push('/admin/categories');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto py-8">
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Categories</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Category
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update category information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6  border-none dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Category Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category Name *
              </label>
              <Input
                type="text"
                {...register('name')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-neutral-700 text-gray-900 dark:text-white"
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
                Description
              </label>
              <Textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-neutral-700 text-gray-900 dark:text-white"
                placeholder="Describe what products belong in this category..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.description.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Optional: Help customers understand what's in this category
              </p>
            </div>
          </div>
        </div>

        {/* Category Image */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6  border-none dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Category Image
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Upload an image to represent this category (optional)
          </p>

          {imageUrl ? (
            <div className="relative w-full aspect-video max-w-md mx-auto rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <Image
                src={imageUrl}
                alt="Category preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <label className="block w-full aspect-video max-w-md mx-auto border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
              <div className="h-full flex flex-col items-center justify-center p-8">
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uploading to Cloudinary...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                      Click to upload category image
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      JPEG, PNG, WebP, GIF (max 10MB)
                    </p>
                  </>
                )}
              </div>
            </label>
          )}

          {errors.image && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1 justify-center">
              <AlertCircle size={14} />
              {errors.image.message}
            </p>
          )}

          <div className="mt-4 flex items-start gap-2 p-4 bg-blue-50 dark:bg-neutral-700 border border-blue-200 border-none rounded-lg">
            <AlertCircle
              size={16}
              className="text-yellow-600  flex-shrink-0 mt-0.5"
            />
            <div className="text-sm ">
              <p className="font-medium text-yellow-600 mb-1">
                Image Guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1 text-white text-xs">
                <li>Recommended size: 1200x675px (16:9 aspect ratio)</li>
                <li>Category images help users browse and find products</li>
                <li>Images are automatically optimized via Cloudinary</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>Update Category</>
              )}
            </Button>

            <Link
              href="/admin/categories"
              className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              Cancel
            </Link>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || productCount > 0}
            className="px-4 py-2 flex items-center gap-2 text-white rounded-md border border-black bg-red-600 hover:bg-red-700 text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            Delete Category
          </button>
        </div>
      </form>
    </div>
  );
}
