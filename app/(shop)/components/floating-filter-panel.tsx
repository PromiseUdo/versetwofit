'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterValues {
  minPrice: number;
  maxPrice: number;
  selectedColors: string[];
  sortBy: string;
}

export default function FloatingFilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize from URL
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(
    parseInt(searchParams.get('minPrice') || '0')
  );
  const [maxPrice, setMaxPrice] = useState(
    parseInt(searchParams.get('maxPrice') || '1000')
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    searchParams.get('colors')?.split(',').filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  const colors = [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Red', value: 'red', hex: '#EF4444' },
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Green', value: 'green', hex: '#10B981' },
    { name: 'Yellow', value: 'yellow', hex: '#FBBF24' },
    { name: 'Purple', value: 'purple', hex: '#A855F7' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
  ];

  const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A - Z', value: 'name' },
  ];

  const toggleColor = (colorValue: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorValue)
        ? prev.filter((c) => c !== colorValue)
        : [...prev, colorValue]
    );
  };

  const clearFilters = () => {
    setMinPrice(0);
    setMaxPrice(1000);
    setSelectedColors([]);
    setSortBy('newest');

    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('colors');
    params.delete('sort');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    else params.delete('minPrice');

    if (maxPrice < 1000) params.set('maxPrice', maxPrice.toString());
    else params.delete('maxPrice');

    if (selectedColors.length > 0) {
      params.set('colors', selectedColors.join(','));
    } else {
      params.delete('colors');
    }

    if (sortBy !== 'newest') params.set('sort', sortBy);
    else params.delete('sort');

    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const activeFiltersCount =
    (minPrice > 0 || maxPrice < 1000 ? 1 : 0) +
    selectedColors.length +
    (sortBy !== 'newest' ? 1 : 0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Minimal Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-6 top-1/2 -translate-y-1/2 z-40 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative bg-primary dark:bg-white text-primary-foreground dark:text-black p-3.5 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl">
          <SlidersHorizontal className="w-5 h-5" strokeWidth={2} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-primary dark:border-black">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
          Filter & Sort
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-zinc-900 z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-light tracking-tight text-black dark:text-white">
                  Refine Selection
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10">
                {/* Sort Section */}
                <section>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={cn(
                          'w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group',
                          sortBy === option.value
                            ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                        )}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <Check className="w-4 h-4 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                <hr className="border-gray-100 dark:border-gray-800" />

                {/* Price Section */}
                <section>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-6">
                    Price Range
                  </h3>
                  
                  {/* Slider Visual */}
                  <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-8 mx-1">
                    <div
                      className="absolute h-full bg-primary dark:bg-white rounded-full"
                      style={{
                        left: `${(minPrice / 1000) * 100}%`,
                        right: `${100 - (maxPrice / 1000) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={minPrice}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val <= maxPrice - 10) setMinPrice(val);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= minPrice + 10) setMaxPrice(val);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    
                    {/* Thumbs - Pure CSS visuals since inputs are invisible overlay */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary dark:border-white rounded-full shadow pointer-events-none z-10"
                      style={{ left: `${(minPrice / 1000) * 100}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary dark:border-white rounded-full shadow pointer-events-none z-10"
                      style={{ left: `${(maxPrice / 1000) * 100}%`, transform: 'translateX(-100%)' }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          if (val <= maxPrice - 10) setMinPrice(val);
                        }}
                        className="w-full pl-6 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:border-primary dark:focus:border-white bg-transparent"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          if (val >= minPrice + 10) setMaxPrice(val);
                        }}
                        className="w-full pl-6 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:border-primary dark:focus:border-white bg-transparent"
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-gray-100 dark:border-gray-800" />

                {/* Colors Section */}
                <section>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    Colors
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                      const isSelected = selectedColors.includes(color.value);
                      return (
                        <button
                          key={color.value}
                          onClick={() => toggleColor(color.value)}
                          className={cn(
                            'w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all relative',
                            isSelected ? 'ring-2 ring-offset-2 ring-primary dark:ring-white scale-110' : 'hover:scale-105'
                          )}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && (
                            <Check 
                              className={cn(
                                "w-3.5 h-3.5", 
                                color.value === 'white' ? "text-black" : "text-white"
                              )} 
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <button
                  onClick={applyFilters}
                  className="w-full bg-primary dark:bg-white text-primary-foreground dark:text-black py-4 rounded-xl font-medium text-sm tracking-wide hover:shadow-lg hover:scale-[1.01] transition-all duration-200 active:scale-[0.99]"
                >
                  Show Results
                </button>
                <div className="mt-3 text-center">
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-primary dark:hover:text-white transition-colors border-b border-transparent hover:border-primary dark:hover:border-white pb-0.5"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
