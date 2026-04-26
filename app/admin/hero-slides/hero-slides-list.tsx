'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus, Eye, EyeOff, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  ctaText: string | null;
  ctaLink: string | null;
  alignment: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

interface HeroSlidesListProps {
  initialSlides: HeroSlide[];
}

export default function HeroSlidesList({ initialSlides }: HeroSlidesListProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleActive = async (slide: HeroSlide) => {
    setTogglingId(slide.id);
    try {
      const res = await axios.patch(`/api/admin/hero-slides/${slide.id}`, {
        isActive: !slide.isActive,
      });
      setSlides((prev) => prev.map((s) => (s.id === slide.id ? { ...s, isActive: !s.isActive } : s)));
      toast.success(res.data.isActive ? 'Slide activated' : 'Slide hidden');
    } catch {
      toast.error('Failed to update slide');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/admin/hero-slides/${id}`);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      toast.success('Slide deleted');
    } catch {
      toast.error('Failed to delete slide');
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = slides.findIndex((s) => s.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const newSlides = [...slides];
    [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];

    const updatedWithOrder = newSlides.map((s, i) => ({ ...s, order: i }));
    setSlides(updatedWithOrder);

    try {
      await Promise.all([
        axios.patch(`/api/admin/hero-slides/${newSlides[index].id}`, { order: index }),
        axios.patch(`/api/admin/hero-slides/${newSlides[swapIndex].id}`, { order: swapIndex }),
      ]);
      toast.success('Slide order updated');
    } catch {
      setSlides(slides);
      toast.error('Failed to reorder slides');
    }
  };

  if (slides.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-12 text-center border border-none dark:border-neutral-700">
        <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No slides yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add your first hero slide to display on the homepage
        </p>
        <Link
          href="/admin/hero-slides/new"
          className="inline-flex items-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold"
        >
          <Plus size={20} />
          Add First Slide
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-none dark:border-neutral-700 overflow-hidden transition-all ${
            !slide.isActive ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-stretch gap-0">
            {/* Thumbnail */}
            <div className="relative w-40 h-28 shrink-0 bg-neutral-900">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
              />
              {!slide.isActive && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold uppercase tracking-wider">Hidden</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded-full shrink-0">
                    #{index + 1}
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {slide.title}
                  </h3>
                </div>
                {slide.subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5 ml-7">
                    {slide.subtitle}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 ml-7 flex-wrap">
                  <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                    Align: {slide.alignment}
                  </span>
                  {slide.ctaText && (
                    <span className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                      CTA: {slide.ctaText}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      slide.isActive
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {slide.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-center gap-1 px-3 border-l border-neutral-100 dark:border-neutral-700 shrink-0">
              {/* Reorder */}
              <button
                onClick={() => handleReorder(slide.id, 'up')}
                disabled={index === 0}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-20 disabled:cursor-not-allowed"
                title="Move up"
              >
                <ArrowUp size={15} />
              </button>
              <button
                onClick={() => handleReorder(slide.id, 'down')}
                disabled={index === slides.length - 1}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition disabled:opacity-20 disabled:cursor-not-allowed"
                title="Move down"
              >
                <ArrowDown size={15} />
              </button>

              {/* Divider */}
              <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-600 my-1" />

              {/* Toggle active */}
              <button
                onClick={() => handleToggleActive(slide)}
                disabled={togglingId === slide.id}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                title={slide.isActive ? 'Hide slide' : 'Show slide'}
              >
                {slide.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>

              {/* Edit */}
              <Link
                href={`/admin/hero-slides/${slide.id}`}
                className="p-1.5 rounded-md text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition"
                title="Edit slide"
              >
                <Pencil size={15} />
              </Link>

              {/* Delete */}
              <button
                onClick={() => handleDelete(slide.id)}
                disabled={deletingId === slide.id}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                title="Delete slide"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
        {slides.filter((s) => s.isActive).length} of {slides.length} slides active · Drag the arrows to reorder
      </p>
    </div>
  );
}
