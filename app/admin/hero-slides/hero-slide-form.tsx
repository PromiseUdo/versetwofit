'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const slideSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  subtitle: z.string().optional(),
  image: z.string().min(1, 'An image is required'),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right']),
  order: z.number().int().min(0),
  isActive: z.boolean(),
});

type SlideFormData = z.infer<typeof slideSchema>;

interface HeroSlideFormProps {
  mode: 'create' | 'edit';
  slideId?: string;
  defaultValues?: Partial<SlideFormData>;
}

const alignments = [
  { value: 'left', icon: AlignLeft, label: 'Left' },
  { value: 'center', icon: AlignCenter, label: 'Center' },
  { value: 'right', icon: AlignRight, label: 'Right' },
] as const;

export default function HeroSlideForm({ mode, slideId, defaultValues }: HeroSlideFormProps) {
  const router = useRouter();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SlideFormData>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      image: '',
      ctaText: '',
      ctaLink: '',
      alignment: 'center',
      order: 0,
      isActive: true,
      ...defaultValues,
    },
  });

  const imageUrl = watch('image');
  const alignment = watch('alignment');
  const isActive = watch('isActive');

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValue('image', response.data.imageUrl);
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: SlideFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await axios.post('/api/admin/hero-slides', data);
        toast.success('Slide created!');
      } else {
        await axios.put(`/api/admin/hero-slides/${slideId}`, data);
        toast.success('Slide updated!');
      }
      router.push('/admin/hero-slides');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/hero-slides"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Hero Slides
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {mode === 'create' ? 'Add Hero Slide' : 'Edit Hero Slide'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {mode === 'create'
            ? 'Create a new slide for the homepage hero section'
            : 'Update the slide details and image'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Hero Image */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Background Image
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Full-screen background image for this slide. Recommended: 1920×1080px or similar landscape ratio.
          </p>

          {imageUrl ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 group">
              <Image src={imageUrl} alt="Slide preview" fill className="object-cover" />
              {/* Overlay preview of how slide looks */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 flex flex-col items-center justify-center p-8">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-3">Preview</p>
                <h3 className="text-white text-3xl font-black text-center drop-shadow-lg max-w-lg">
                  {watch('title') || 'Your Title Here'}
                </h3>
                {watch('subtitle') && (
                  <p className="text-white/80 text-base mt-3 text-center max-w-md">
                    {watch('subtitle')}
                  </p>
                )}
                {watch('ctaText') && (
                  <div className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-semibold">
                    {watch('ctaText')}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setValue('image', '')}
                className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg opacity-0 group-hover:opacity-100"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="w-full">
              <FileUpload onChange={handleFileUpload} />
              {uploadingImage && (
                <div className="flex items-center justify-center mt-4 gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
          )}

          {errors.image && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.image.message}
            </p>
          )}
        </div>

        {/* Slide Content */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Slide Content
          </h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('title')}
                placeholder="e.g. Define Your Style"
                className="w-full"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subtitle
              </label>
              <Textarea
                {...register('subtitle')}
                rows={2}
                placeholder="e.g. New season. New energy."
                className="w-full"
              />
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Text Alignment
              </label>
              <div className="flex gap-3">
                {alignments.map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('alignment', value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                      alignment === value
                        ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                        : 'border-neutral-200 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Call to Action
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Optional button shown on the slide
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Text
              </label>
              <Input {...register('ctaText')} placeholder="e.g. Shop Now" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Link
              </label>
              <Input
                {...register('ctaLink')}
                placeholder="e.g. /collections/new-arrivals"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Order
              </label>
              <Input
                type="number"
                min={0}
                {...register('order', { valueAsNumber: true })}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Lower numbers appear first. You can also reorder from the list.
              </p>
            </div>

            {/* Active Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Visibility
              </label>
              <button
                type="button"
                onClick={() => setValue('isActive', !isActive)}
                className={`relative inline-flex h-10 w-full max-w-xs items-center gap-3 rounded-lg border px-4 text-sm font-medium transition ${
                  isActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'border-neutral-300 dark:border-neutral-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full transition ${
                    isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-600'
                  }`}
                />
                {isActive ? 'Active — visible on homepage' : 'Hidden — not shown'}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pb-8">
          <Link
            href="/admin/hero-slides"
            className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting || uploadingImage}
            className="px-8 py-3 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {mode === 'create' ? 'Creating...' : 'Saving...'}
              </>
            ) : mode === 'create' ? (
              'Create Slide'
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
