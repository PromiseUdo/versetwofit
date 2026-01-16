// 'use client';
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   SlidersHorizontal,
//   X,
//   DollarSign,
//   Palette,
//   ArrowUpDown,
// } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { GlowingStarsBackgroundCard } from '@/components/ui/glowing-stars';

// interface FilterValues {
//   minPrice: number;
//   maxPrice: number;
//   selectedColors: string[];
//   sortBy: string;
// }

// interface FloatingFilterPanelProps {
//   onFilterChange?: (filters: FilterValues) => void;
// }

// const FloatingFilterPanel: React.FC<FloatingFilterPanelProps> = ({
//   onFilterChange,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [minPrice, setMinPrice] = useState(0);
//   const [maxPrice, setMaxPrice] = useState(250);
//   //   const [selectedColors, setSelectedColors] = useState([]);
//   const [sortBy, setSortBy] = useState('featured');

//   const [selectedColors, setSelectedColors] = useState<string[]>([]);

//   const colors = [
//     { name: 'Black', value: '#000000' },
//     { name: 'White', value: '#FFFFFF' },
//     { name: 'Red', value: '#EF4444' },
//     { name: 'Blue', value: '#3B82F6' },
//     { name: 'Green', value: '#10B981' },
//     { name: 'Yellow', value: '#FBBF24' },
//   ];

//   const sortOptions = [
//     { label: 'Featured', value: 'featured' },
//     { label: 'Price: Low to High', value: 'price-asc' },
//     { label: 'Price: High to Low', value: 'price-desc' },
//     { label: 'Newest', value: 'newest' },
//   ];

//   const toggleColor = (colorValue: string) => {
//     setSelectedColors((prev) =>
//       prev.includes(colorValue)
//         ? prev.filter((c) => c !== colorValue)
//         : [...prev, colorValue]
//     );
//   };

//   const clearFilters = () => {
//     setMinPrice(0);
//     setMaxPrice(250);
//     setSelectedColors([]);
//     setSortBy('featured');
//   };

//   const activeFiltersCount =
//     (minPrice !== 0 || maxPrice !== 250 ? 1 : 0) +
//     selectedColors.length +
//     (sortBy !== 'featured' ? 1 : 0);

//   return (
//     <>
//       {/* Floating Toggle Button - Compact */}
//       <motion.button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed left-4 top-1/2 -translate-y-1/2 z-50 group"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
//           <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-3 rounded-2xl shadow-2xl border border-white/10">
//             <motion.div
//               animate={{ rotate: isOpen ? 90 : 0 }}
//               transition={{ duration: 0.3, ease: 'easeInOut' }}
//             >
//               <SlidersHorizontal className="w-5 h-5" />
//             </motion.div>
//           </div>
//           {activeFiltersCount > 0 && (
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
//             >
//               {activeFiltersCount}
//             </motion.div>
//           )}
//         </div>
//       </motion.button>

//       {/* Filter Panel */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsOpen(false)}
//               className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
//             />

//             {/* Panel - Compact Width */}
//             <motion.div
//               initial={{ x: -320, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -320, opacity: 0 }}
//               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
//               className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 overflow-y-auto"
//             >
//               {/* Header - Compact */}
//               <div className="sticky h-22 top-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-5 z-10 border-b border-white/10">
//                 <div className=" flex items-center justify-between">
//                   <div>
//                     <h2 className="text-xl font-bold">Filters</h2>
//                   </div>
//                   <button
//                     onClick={() => setIsOpen(false)}
//                     className="p-2 hover:bg-white/10 rounded-lg transition-colors"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 <div>
//                   {activeFiltersCount > 0 && (
//                     <button
//                       onClick={clearFilters}
//                       className="text-xs text-gray-300 hover:text-white transition-colors mt-1"
//                     >
//                       Clear all
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="p-5 space-y-6">
//                 {/* Sort By */}
//                 {/* <motion.div
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.1 }}
//                   className="space-y-3"
//                 >
//                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//                     <ArrowUpDown className="w-4 h-4" />
//                     <span>Sort By</span>
//                   </div>
//                   <div className="relative">
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none transition-all cursor-pointer text-sm font-medium appearance-none"
//                     >
//                       {sortOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//                       <svg
//                         className="w-4 h-4 text-gray-400"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M19 9l-7 7-7-7"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </motion.div> */}

//                 <motion.div
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.1 }}
//                   className="space-y-3"
//                 >
//                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//                     <ArrowUpDown className="w-4 h-4" />
//                     <span>Sort By</span>
//                   </div>

//                   <Select value={sortBy} onValueChange={setSortBy}>
//                     <SelectTrigger className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 text-sm font-medium">
//                       <SelectValue placeholder="Sort by" />
//                     </SelectTrigger>

//                     <SelectContent>
//                       {sortOptions.map((option) => (
//                         <SelectItem key={option.value} value={option.value}>
//                           {option.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </motion.div>

//                 {/* Price Range - Fixed and Clear */}
//                 <motion.div
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className="space-y-3"
//                 >
//                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//                     <DollarSign className="w-4 h-4" />
//                     <span>Price Range</span>
//                   </div>

//                   <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
//                     {/* Price Display */}
//                     <div className="flex items-center justify-between gap-2">
//                       <div className="flex-1">
//                         <label className="text-xs text-gray-500 mb-1 block">
//                           Min
//                         </label>
//                         <div className="text-lg font-bold text-gray-900">
//                           ${minPrice}
//                         </div>
//                       </div>
//                       <div className="h-px w-8 bg-gray-300" />
//                       <div className="flex-1 text-right">
//                         <label className="text-xs text-gray-500 mb-1 block">
//                           Max
//                         </label>
//                         <div className="text-lg font-bold text-gray-900">
//                           ${maxPrice}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Min Price Slider */}
//                     <div className="space-y-1">
//                       <input
//                         type="range"
//                         min="0"
//                         max="250"
//                         value={minPrice}
//                         onChange={(e) => {
//                           const val = parseInt(e.target.value);
//                           if (val <= maxPrice - 10) setMinPrice(val);
//                         }}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:cursor-pointer"
//                       />
//                     </div>

//                     {/* Max Price Slider */}
//                     <div className="space-y-1">
//                       <input
//                         type="range"
//                         min="0"
//                         max="250"
//                         value={maxPrice}
//                         onChange={(e) => {
//                           const val = parseInt(e.target.value);
//                           if (val >= minPrice + 10) setMaxPrice(val);
//                         }}
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 [&::-webkit-slider-thumb]:cursor-pointer"
//                       />
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Colors - Compact Grid */}
//                 <motion.div
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.3 }}
//                   className="space-y-3"
//                 >
//                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//                     <Palette className="w-4 h-4" />
//                     <span>Colors</span>
//                   </div>
//                   {/* <div className="grid grid-cols-6 gap-2">
//                     {colors.map((color) => (
//                       <motion.button
//                         key={color.value}
//                         onClick={() => toggleColor(color.value)}
//                         className="relative group"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         <div
//                           className={`w-10 h-10 rounded-full transition-all duration-200 ${
//                             selectedColors.includes(color.value)
//                               ? 'ring-2 ring-gray-900 ring-offset-2'
//                               : 'ring-1 ring-gray-200 hover:ring-gray-400'
//                           }`}
//                           style={{ backgroundColor: color.value }}
//                         >
//                           {selectedColors.includes(color.value) && (
//                             <motion.div
//                               initial={{ scale: 0, rotate: -180 }}
//                               animate={{ scale: 1, rotate: 0 }}
//                               className="absolute inset-0 flex items-center justify-center"
//                             >
//                               <svg
//                                 className={`w-5 h-5 ${
//                                   color.value === '#FFFFFF'
//                                     ? 'text-gray-900'
//                                     : 'text-white'
//                                 } drop-shadow-lg`}
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={3}
//                                   d="M5 13l4 4L19 7"
//                                 />
//                               </svg>
//                             </motion.div>
//                           )}
//                         </div>
//                       </motion.button>
//                     ))}
//                   </div> */}

//                   <div className="grid grid-cols-6 gap-1.5">
//                     {colors.map((color) => (
//                       <motion.button
//                         key={color.value}
//                         onClick={() => toggleColor(color.value)}
//                         className="relative group"
//                         // whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         <div
//                           className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
//                             selectedColors.includes(color.value)
//                               ? 'ring-2 ring-gray-900 ring-offset-2'
//                               : 'ring-1 ring-gray-200 hover:ring-gray-400'
//                           }`}
//                           style={{ backgroundColor: color.value }}
//                         >
//                           {selectedColors.includes(color.value) && (
//                             <motion.div
//                               initial={{ scale: 0, rotate: -180 }}
//                               animate={{ scale: 1, rotate: 0 }}
//                               className="absolute inset-0 flex items-center justify-center"
//                             >
//                               <svg
//                                 className={`w-4 h-4 ${
//                                   color.value === '#FFFFFF'
//                                     ? 'text-gray-900'
//                                     : 'text-white'
//                                 } drop-shadow-lg`}
//                                 fill="none"
//                                 viewBox="0 0 24 24"
//                                 stroke="currentColor"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={3}
//                                   d="M5 13l4 4L19 7"
//                                 />
//                               </svg>
//                             </motion.div>
//                           )}
//                         </div>
//                       </motion.button>
//                     ))}
//                   </div>
//                 </motion.div>

//                 {/* Apply Button - Compact */}
//                 {/* <motion.button
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                   onClick={() => {
//                     onFilterChange?.({
//                       minPrice,
//                       maxPrice,
//                       selectedColors,
//                       sortBy,
//                     });
//                     setIsOpen(false);
//                   }}
//                   className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-3 rounded-xl font-semibold text-sm hover:shadow-xl hover:from-gray-800 hover:to-gray-600 transition-all duration-300"
//                   whileHover={{ y: -2 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   Apply Filters
//                 </motion.button> */}

//                 <div className="flex items-center justify-center">
//                   <button
//                     onClick={() => {
//                       onFilterChange?.({
//                         minPrice,
//                         maxPrice,
//                         selectedColors,
//                         sortBy,
//                       });
//                       setIsOpen(false);
//                     }}
//                     className="px-4 py-2 mx-auto rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
//                   >
//                     Apply Filters
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default FloatingFilterPanel;

// ============================================
// IMPROVED FLOATING FILTER PANEL
// src/components/floating-filter-panel.tsx
// ============================================
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  DollarSign,
  Palette,
  ArrowUpDown,
  Check,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterValues {
  minPrice: number;
  maxPrice: number;
  selectedColors: string[];
  sortBy: string;
}

export default function FloatingFilterPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A to Z', value: 'name' },
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

    // Clear URL params
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

    // Set filter params
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

    // Reset to page 1 when filters change
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  // Calculate active filters
  const activeFiltersCount =
    (minPrice > 0 || maxPrice < 1000 ? 1 : 0) +
    selectedColors.length +
    (sortBy !== 'newest' ? 1 : 0);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open filters"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-3 rounded-2xl shadow-2xl border border-white/10">
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </motion.div>
          </div>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
            >
              {activeFiltersCount}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-5 z-10 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Filters</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {activeFiltersCount}{' '}
                      {activeFiltersCount === 1 ? 'filter' : 'filters'} active
                    </span>
                    <button
                      onClick={clearFilters}
                      className="text-gray-300 hover:text-white transition-colors underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-6">
                {/* Sort By */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Sort By</span>
                  </div>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Price Range */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <DollarSign className="w-4 h-4" />
                    <span>Price Range</span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-4">
                    {/* Price Display */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          Min
                        </label>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val <= maxPrice - 10) setMinPrice(val);
                          }}
                          className="w-full px-2 py-1 text-sm font-semibold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div className="h-px w-8 bg-gray-300 dark:bg-gray-600 mt-6" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                          Max
                        </label>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            if (val >= minPrice + 10) setMaxPrice(val);
                          }}
                          className="w-full px-2 py-1 text-sm font-semibold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>

                    {/* Dual Range Slider */}
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
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
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-lg"
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
                        className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-purple-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-lg"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Colors */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <Palette className="w-4 h-4" />
                      <span>Colors</span>
                    </div>
                    {selectedColors.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedColors.length} selected
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((color) => {
                      const isSelected = selectedColors.includes(color.value);
                      return (
                        <motion.button
                          key={color.value}
                          onClick={() => toggleColor(color.value)}
                          className="flex flex-col items-center gap-1.5 group"
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-full transition-all duration-200 ${
                                isSelected
                                  ? 'ring-2 ring-gray-900 dark:ring-white ring-offset-2'
                                  : 'ring-1 ring-gray-300 dark:ring-gray-600 group-hover:ring-gray-400'
                              }`}
                              style={{ backgroundColor: color.hex }}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <div className="w-6 h-6 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center">
                                    <Check
                                      className={`w-4 h-4 ${
                                        color.value === 'white'
                                          ? 'text-gray-900'
                                          : 'text-gray-900 dark:text-white'
                                      }`}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
                            {color.name}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Results Preview */}
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
                  >
                    <p className="text-sm text-indigo-900 dark:text-indigo-100">
                      <span className="font-semibold">
                        {activeFiltersCount}
                      </span>{' '}
                      {activeFiltersCount === 1 ? 'filter' : 'filters'} will be
                      applied to your search
                    </p>
                  </motion.div>
                )}

                {/* Apply Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={applyFilters}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 py-3.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
