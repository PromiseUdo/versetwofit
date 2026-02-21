// // components/SearchModal.tsx
// 'use client';

// import { AnimatePresence, motion } from 'framer-motion';
// import { Search, X } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// // import { ProductCard } from '@/types/product-card';

// export default function SearchModal() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<any>([]);
//   const [loading, setLoading] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Open modal with Cmd+K or Ctrl+K
//   useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault();
//         setIsOpen(true);
//       }
//       if (e.key === 'Escape') setIsOpen(false);
//     };
//     document.addEventListener('keydown', down);
//     return () => document.removeEventListener('keydown', down);
//   }, []);

//   // Focus input when opened
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   // Search API
//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     const search = async () => {
//       setLoading(true);
//       const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
//       const data = await res.json();
//       setResults(data.products || []);
//       setLoading(false);
//     };

//     const timeout = setTimeout(search, 300);
//     return () => clearTimeout(timeout);
//   }, [query]);

//   return (
//     <>
//       {/* Search Trigger Button (in Navbar) */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="text-[#B5844A] hover:text-[#FFD4A3] p-2 transition-colors"
//         aria-label="Search products"
//       >
//         <Search size={20} strokeWidth={1.5} />
//       </button>

//       {/* Full-Screen Modal */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setIsOpen(false)}
//               className="fixed left-0 top-0 w-screen h-screen bg-black/70 backdrop-blur-sm z-[9998]"
//             />

//             {/* Modal */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
//             >
//               <div className="w-full max-w-2xl">
//                 {/* Search Input */}
//                 <div className="relative">
//                   <div className="relative">
//                     <Search
//                       className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
//                       size={24}
//                     />
//                     <input
//                       ref={inputRef}
//                       type="text"
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       placeholder="Search..."
//                       className="w-full bg-white border border-gray-200 rounded-2xl py-5 pl-14 pr-14 text-lg focus:outline-none focus:ring-4 focus:ring-[#B5844] shadow-2xl"
//                     />
//                     <button
//                       onClick={() => setIsOpen(false)}
//                       className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <X size={24} />
//                     </button>
//                   </div>

//                   {/* Hint */}
//                   <p className="text-center text-gray-400 text-sm mt-3">
//                     Press{' '}
//                     <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to
//                     close
//                   </p>
//                 </div>

//                 {/* Results */}
//                 {query && (
//                   <div className="mt-6 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
//                     {loading ? (
//                       <div className="p-12 text-center text-gray-500">
//                         <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#B5844A]"></div>
//                       </div>
//                     ) : results.length === 0 ? (
//                       <p className="p-12 text-center text-gray-500">
//                         No products found
//                       </p>
//                     ) : (
//                       <div className="max-h-96 overflow-y-auto">
//                         {/* {results.map((product) => (
//                           <Link
//                             key={product.id}
//                             href={`/product/${product.slug}`}
//                             onClick={() => setIsOpen(false)}
//                             className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
//                           >
//                             <div className="relative w-16 h-16 flex-shrink-0">
//                               <Image
//                                 src={product.image}
//                                 alt={product.title}
//                                 fill
//                                 className="object-cover rounded-lg"
//                               />
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="font-medium text-gray-900">
//                                 {product.title}
//                               </h4>
//                               <div className="flex items-center gap-2 mt-1">
//                                 {product.oldPrice && (
//                                   <span className="text-sm line-through text-gray-400">
//                                     ${product.oldPrice.toLocaleString()}
//                                   </span>
//                                 )}
//                                 <span className="text-lg font-bold text-[#B5844A]">
//                                   ${product.price.toLocaleString()}
//                                 </span>
//                               </div>
//                             </div>
//                           </Link>
//                         ))} */}
//                         hello
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// components/search-modal.tsx
"use client";

import { X, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open modal with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search API
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  // FIXED: Prevent event propagation and ensure modal opens
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      {/* Search Trigger Button (in Navbar) */}
      <motion.button
        onClick={handleOpenModal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Search products"
        type="button"
      >
        <Search
          size={22}
          strokeWidth={1.5}
          className="text-gray-700 dark:text-gray-300"
        />

        {/* Keyboard shortcut hint */}
        {/* <span className="hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap pointer-events-none">
          ⌘K
        </span> */}
      </motion.button>

      {/* Full-Screen Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-2xl">
                {/* Search Input */}
                <div className="relative">
                  <div className="relative">
                    <Search
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                      size={24}
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search for products..."
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-5 pl-14 pr-14 text-lg text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 shadow-2xl"
                    />
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      type="button"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Hint */}
                  <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 text-sm mt-3">
                    <span>Press</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400 font-mono text-xs">
                      Esc
                    </kbd>
                    <span>to close</span>
                  </div>
                </div>

                {/* Results */}
                {query && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {loading ? (
                      <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                          Searching...
                        </p>
                      </div>
                    ) : results.length === 0 ? (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Search className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-900 dark:text-white font-semibold mb-1">
                          No products found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Try searching with different keywords
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        {results.map((product, index) => (
                          <Link
                            key={product.id || index}
                            href={`/products/${product.slug}`}
                            onClick={() => {
                              setIsOpen(false);
                              setQuery("");
                            }}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 group"
                          >
                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                              {product.images?.[0] ? (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-200"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Search size={24} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {product.category?.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {product.comparePrice && (
                                  <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                                    ${product.comparePrice.toLocaleString()}
                                  </span>
                                )}
                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                  ${product.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {product.stock === 0 && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
