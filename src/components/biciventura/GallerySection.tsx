"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { useTranslation } from "./LanguageToggle";

interface GalleryImage {
  src: string;
  alt: string;
  category: "clientes" | "paisajes" | "detalles";
  span?: "wide" | "tall";
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/gallery/gallery-1.jpg",
    alt: "Turistas pedaleando por calles empedradas de Granada",
    category: "clientes",
  },
  {
    src: "/images/gallery/gallery-2.jpg",
    alt: "Ciclista en el malecón del Lago Nicaragua",
    category: "paisajes",
    span: "wide",
  },
  {
    src: "/images/gallery/gallery-3.jpg",
    alt: "Detalle de cesta con flores tropicales",
    category: "detalles",
    span: "tall",
  },
  {
    src: "/images/gallery/gallery-4.jpg",
    alt: "Pareja en bicicleta al atardecer",
    category: "clientes",
  },
  {
    src: "/images/gallery/gallery-5.jpg",
    alt: "Vista aérea de Granada colonial",
    category: "paisajes",
    span: "wide",
  },
  {
    src: "/images/gallery/gallery-6.jpg",
    alt: "Ciclistas en sendero del Volcán Mombacho",
    category: "clientes",
  },
];

const categoryFilters = [
  { value: "todas", labelKey: "gallery.all" },
  { value: "clientes", labelKey: "gallery.happy" },
  { value: "paisajes", labelKey: "gallery.landscapes" },
  { value: "detalles", labelKey: "gallery.details" },
];

export default function GallerySection() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("todas");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const filtered =
    filter === "todas"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  return (
    <section id="galeria" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 bg-colonial-yellow/10 text-colonial-yellow text-sm font-semibold rounded-full mb-4">
            {t("gallery.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            {t("gallery.title.1")}{" "}
            <span className="text-colonial-yellow">{t("gallery.title.2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("gallery.subtitle")}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categoryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === f.value
                  ? "bg-colonial-yellow text-anil-blue shadow-md"
                  : "bg-white text-anil-blue hover:bg-colonial-yellow/10 border border-anil-blue/10"
              }`}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((img, index) => (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setLightbox(index)}
              >
                <div
                  className={`relative ${
                    img.span === "wide"
                      ? "aspect-[4/3]"
                      : img.span === "tall"
                      ? "aspect-[3/4]"
                      : "aspect-square"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-anil-blue/0 group-hover:bg-anil-blue/30 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <ZoomIn className="w-5 h-5 text-anil-blue" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full aspect-[4/3] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-white text-sm sm:text-base">
                  {filtered[lightbox].alt}
                </p>
              </div>
            </motion.div>

            {/* Navigation arrows */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(lightbox > 0 ? lightbox - 1 : filtered.length - 1);
              }}
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(lightbox < filtered.length - 1 ? lightbox + 1 : 0);
              }}
              aria-label="Next image"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
