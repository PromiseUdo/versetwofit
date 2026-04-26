'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  ctaText: string | null;
  ctaLink: string | null;
  alignment: string;
  order: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  categories?: Category[];
}

const alignClass: Record<string, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
};

const HeroSlider = ({ slides: rawSlides, categories = [] }: HeroSliderProps) => {
  const slides = rawSlides.filter((s) => s.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating || slides.length <= 1) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const prevSlide = () => {
    if (isAnimating || slides.length <= 1) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [currentSlide, isAnimating, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <p className="text-white/40 text-sm">No hero slides configured</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {slides.map((slide, index) => {
        const align = alignClass[slide.alignment] ?? alignClass.center;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 translate-x-0 scale-100'
                : index < currentSlide
                ? 'opacity-0 -translate-x-full scale-95'
                : 'opacity-0 translate-x-full scale-95'
            }`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-linear-to-b from-black/60 via-black/50 to-black/70" />

            {/* Background image */}
            <img
              className="absolute inset-0 object-cover object-center w-full h-full"
              src={slide.image}
              alt={slide.title}
            />

            {/* Content */}
            <div className="relative z-20 h-full">
              <div
                className={`mx-auto max-w-7xl h-full flex flex-col justify-end pb-24 px-8 lg:px-8 gap-4 ${align}`}
              >
                {/* Category links on first slide */}
                {index === 0 && categories.length > 0 && (
                  <ul className="flex flex-col items-center max-w-3xl mx-auto gap-y-2 gap-x-4 lg:flex-row lg:justify-center">
                    {categories.map((category, catIndex) => (
                      <React.Fragment key={category.id}>
                        {catIndex > 0 && (
                          <li className="hidden lg:block text-white/40">•</li>
                        )}
                        <li>
                          <Link
                            href={`/category/${category.slug}`}
                            className="font-medium uppercase text-white hover:text-zinc-300 transition-colors text-sm tracking-wider"
                          >
                            {category.name}
                          </Link>
                        </li>
                      </React.Fragment>
                    ))}
                  </ul>
                )}

                {/* Title */}
                <h2 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-100 max-w-2xl">
                  {slide.title}
                </h2>

                {/* Subtitle */}
                {slide.subtitle && (
                  <p className="text-lg md:text-xl max-w-xl font-semibold text-balance text-white/90">
                    {slide.subtitle}
                  </p>
                )}

                {/* CTA */}
                {slide.ctaText && slide.ctaLink && (
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-100 transition text-sm tracking-wide w-fit"
                  >
                    {slide.ctaText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'w-12 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
