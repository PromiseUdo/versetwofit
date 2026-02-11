'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TextHoverEffect } from './ui/text-hover-effect';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeroSliderProps {
  categories?: Category[];
}

const HeroSlider = ({ categories = [] }: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [

     {
      id: 3,
      image: '/hero3.jpg',
      content: (
        <div className="flex flex-col items-center justify-center h-full px-8">
          <div className="h-80 flex items-center justify-center">
            <TextHoverEffect text="Vrse. Two" />
          </div>
          <ul className="flex flex-col items-center max-w-3xl mx-auto mt-8 gap-y-2 gap-x-4 lg:flex-row lg:justify-center">
            {categories.map((category, index) => (
              <React.Fragment key={category.id}>
                {index > 0 && (
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
          <h2 className="mt-24 font-semibold uppercase text-white lg:mt-32 text-center max-w-3xl mx-auto text-lg md:text-xl tracking-wide">
           
            Curated pieces for every mood, every moment, and every version of you.
          </h2>
        </div>
      ),
    },

    {
      id: 1,
      image: '/hero1.jpg',
      content: (
        <div className="relative mx-auto max-w-screen-xl grid lg:px-8">
          <div className="px-8 pt-[35rem] pb-12 z-50 lg:px-0 lg:pt-[35rem] flex flex-col justify-end text-white">
            <p className="text-lg md:text-xl max-w-xl mt-4 font-semibold text-balance">
            New season. New energy.
            </p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-100 mt-4">
              Define Your
              <br />
Style
            </h2>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      image: '/hero2.jpg',
      content: (
        <div className="mx-auto max-w-screen-xl grid">
          <div className="z-50 flex flex-col justify-end items-center px-8 text-center py-96 lg:px-0 lg:py-96">
            <h2 className="text-6xl md:text-8xl font-black tracking-tight text-zinc-100">
             Made to Be Seen
            </h2>
          </div>
        </div>
      ),
    },
   
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const prevSlide = () => {
    if (isAnimating) return;
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
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide, isAnimating]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {slides.map((slide, index) => (
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
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

          <img
            className="absolute inset-0 object-cover object-center w-full h-full"
            src={slide.image}
            alt={`Slide ${slide.id}`}
          />

          <div className="relative z-20 h-full">{slide.content}</div>
        </div>
      ))}

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

      {/* <div className="absolute top-8 right-8 z-30 flex gap-2 text-white text-sm font-light">
        <span className="text-2xl font-extralight">
          {String(currentSlide + 1).padStart(2, '0')}
        </span>
        <span className="text-white/40 text-2xl font-extralight">/</span>
        <span className="text-white/60 text-2xl font-extralight">
          {String(slides.length).padStart(2, '0')}
        </span>
      </div> */}
    </div>
  );
};

export default HeroSlider;
