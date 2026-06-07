"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface PromoSlide {
  image: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  alt?: string;
}

interface PromoCarouselProps {
  slides: PromoSlide[];
  autoPlay?: boolean;
  interval?: number;
}

export default function PromoCarousel({
  slides = [],
  autoPlay = true,
  interval = 5000,
}: PromoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const slideCount = slides.length;

  const handleNext = useCallback(() => {
    if (slideCount === 0) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideCount);
  }, [slideCount]);

  const handlePrev = useCallback(() => {
    if (slideCount === 0) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (!autoPlay || isHovered || slideCount <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isHovered, interval, handleNext, slideCount]);

  if (slideCount === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-warm-white text-anil-blue/50 rounded-2xl border border-anil-blue/10">
        <p className="font-poppins text-sm">No hay promociones disponibles.</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const imagePath = `/images/carrusel/${currentSlide.image}`;
  const defaultAlt = currentSlide.title
    ? `${currentSlide.title} - BiciVentura`
    : "Promoción de alquiler de bicicletas BiciVentura en Granada";
  const slideAlt = currentSlide.alt || defaultAlt;

  // Animation variants for sliding transition
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      zIndex: 0,
    }),
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[580px] overflow-hidden rounded-3xl bg-warm-white shadow-lg border border-border group select-none"
    >
      {/* Slide Container */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, info) => {
              const swipeThreshold = 50;
              if (info.offset.x < -swipeThreshold) {
                handleNext();
              } else if (info.offset.x > swipeThreshold) {
                handlePrev();
              }
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={imagePath}
                alt={slideAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-cover pointer-events-none"
              />
              {/* Overlay for text legibility (applied when text content exists) */}
              {(currentSlide.title || currentSlide.description) && (
                <div className="absolute inset-0 bg-gradient-to-t from-anil-blue/50 via-transparent to-transparent md:bg-gradient-to-r md:from-anil-blue/40 md:via-transparent md:to-transparent" />
              )}
            </div>

            {/* Content Card (Glassmorphism layout) */}
            {(currentSlide.title || currentSlide.description) && (
              <div className="absolute bottom-12 left-4 right-4 sm:left-6 sm:right-6 md:left-10 md:bottom-16 md:max-w-md p-6 sm:p-8 bg-warm-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl z-10 flex flex-col gap-3">
                {currentSlide.title && (
                  <h3 className="text-xl sm:text-2xl font-extrabold text-anil-blue font-poppins tracking-tight leading-tight">
                    {currentSlide.title}
                  </h3>
                )}
                {currentSlide.description && (
                  <p className="text-xs sm:text-sm text-anil-blue/80 font-poppins leading-relaxed">
                    {currentSlide.description}
                  </p>
                )}
                {currentSlide.ctaText && currentSlide.ctaLink && (
                  <Link
                    href={currentSlide.ctaLink}
                    className="mt-2 inline-flex items-center justify-center bg-colonial-yellow text-anil-blue hover:bg-jungle-green hover:text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all duration-300 w-fit shadow-sm hover:shadow active:scale-95"
                  >
                    {currentSlide.ctaText}
                  </Link>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows (Hidden on mobile touch screen layout, visible on desktop hover) */}
      {slideCount > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/70 border border-white/20 text-anil-blue backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-90 opacity-0 group-hover:opacity-100 max-md:hidden cursor-pointer"
            aria-label="Anterior promoción"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/70 border border-white/20 text-anil-blue backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-90 opacity-0 group-hover:opacity-100 max-md:hidden cursor-pointer"
            aria-label="Siguiente promoción"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Position Dots Indicators */}
      {slideCount > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center px-3 py-1.5 bg-anil-blue/10 backdrop-blur-sm rounded-full">
          {slides.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-6 bg-colonial-yellow shadow-sm"
                    : "w-2 bg-anil-blue/40 hover:bg-anil-blue/60"
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
