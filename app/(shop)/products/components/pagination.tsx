// src/components/pagination.tsx
// ============================================
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    // Show first page
    pages.push(1);

    // Show ellipsis or pages around current
    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Show ellipsis or last pages
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Show last page
    pages.push(totalPages);
  } else {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 px-8">
      {/* Previous Button */}
      <Link
        href={createPageUrl(currentPage - 1)}
        className={`p-2 rounded-lg border transition ${
          currentPage === 1
            ? 'border-gray-300 text-gray-400 cursor-not-allowed pointer-events-none'
            : 'border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
        }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft size={20} />
      </Link>

      {/* Page Numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={createPageUrl(page as number)}
            className={`px-4 py-2 rounded-lg border transition ${
              currentPage === page
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {/* Next Button */}
      <Link
        href={createPageUrl(currentPage + 1)}
        className={`p-2 rounded-lg border transition ${
          currentPage === totalPages
            ? 'border-gray-300 text-gray-400 cursor-not-allowed pointer-events-none'
            : 'border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight size={20} />
      </Link>
    </div>
  );
}
