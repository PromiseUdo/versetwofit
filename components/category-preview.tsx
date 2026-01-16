import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MaxWidthWrapper from './max-width-wrapper';

interface Category {
  name: string;
  href: string;
  imageSrc: string;
}

const categories: Category[] = [
  { name: 'Trainers', href: '#_', imageSrc: '/hero1.jpg' },
  { name: 'Backpacks', href: '#_', imageSrc: '/hero2.jpg' },
  { name: 'Jackets', href: '#_', imageSrc: '/hero3.jpg' },
  { name: 'Trainers', href: '#_', imageSrc: '/hero1.jpg' },
];

const CategoryPreview: React.FC = () => {
  return (
    <MaxWidthWrapper className="mt-20">
      <div className=" grid grid-cols-1 gap-2 lg:items-center lg:grid-cols-2">
        {/* Large Trainer Category */}
        <div className="relative overflow-hidden group rounded-2xl aspect-square">
          <Image
            src={categories[0].imageSrc}
            alt={categories[0].name}
            fill
            className="object-cover group-hover:opacity-75"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50"
          ></div>
          <div className="absolute inset-0 flex items-end justify-center p-6">
            <p className="font-semibold text-white">
              <Link href={categories[0].href}>
                <span className="absolute inset-0"></span>
                {categories[0].name}
              </Link>
            </p>
          </div>
        </div>

        {/* Right Grid */}
        <div className="h-full grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* Backpack Category */}
          <div className="relative overflow-hidden group rounded-2xl">
            <Image
              src={categories[1].imageSrc}
              alt={categories[1].name}
              fill
              className="object-cover group-hover:opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50"
            ></div>
            <div className="absolute inset-0 flex items-end justify-center p-6">
              <p className="font-semibold text-white">
                <Link href={categories[1].href}>
                  <span className="absolute inset-0"></span>
                  {categories[1].name}
                </Link>
              </p>
            </div>
          </div>

          {/* Nested Grid for Jackets & Trainers */}
          <div className="h-full grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {categories.slice(2).map((category, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden group rounded-2xl aspect-square"
              >
                <Image
                  src={category.imageSrc}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:opacity-75"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/50"
                ></div>
                <div className="absolute inset-0 flex items-end justify-center p-6">
                  <p className="font-semibold text-white">
                    <Link href={category.href}>
                      <span className="absolute inset-0"></span>
                      {category.name}
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default CategoryPreview;
