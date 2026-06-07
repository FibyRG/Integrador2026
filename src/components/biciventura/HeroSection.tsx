"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Bike, Sparkles } from "lucide-react";
import { useTranslation } from "./LanguageToggle";

export default function HeroSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <Image
          src="/images/hero.jpg"
          alt="Granada Nicaragua - Bicicleta frente a la Catedral"
          fill
          className="object-cover brightness-[0.25]"
          priority
          quality={90}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070d19]/95 via-anil-blue/80 to-[#070d19]/98" />
      </motion.div>

      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-colonial-yellow/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-coral/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-jungle-green/10 rounded-full blur-2xl animate-pulse delay-500" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 16, mass: 0.8, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-colonial-yellow/20 backdrop-blur-sm rounded-full text-colonial-yellow text-sm font-medium mb-6 border border-colonial-yellow/30">
            <Bike className="w-4 h-4" />
            {t("hero.badge")}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 50, damping: 14, mass: 1, delay: 0.35 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
        >
          {t("hero.title.1")}
          <br />
          <span className="text-colonial-yellow font-serif italic">{t("hero.title.2")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 16, mass: 0.9, delay: 0.5 }}
          className="text-lg sm:text-xl text-warm-white/90 max-w-2xl mx-auto mb-8 leading-relaxed font-sans"
        >
          {t("hero.subtitle")}
          <br className="hidden sm:block" />
          {t("hero.subtitle2")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 16, mass: 0.8, delay: 0.65 }}
          className="flex flex-col items-center justify-center gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              onClick={() => scrollTo("#reservar")}
              className="bg-coral hover:bg-coral-dark text-white text-lg px-8 py-6 rounded-2xl shadow-lg shadow-coral/30 hover:shadow-coral/50 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold cursor-pointer animate-pulse w-full sm:w-auto"
            >
              {t("hero.cta1")}
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => scrollTo("#bicicletas")}
              className="border-2 border-white/40 text-white bg-transparent hover:bg-white/10 hover:text-white text-lg px-8 py-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 font-semibold cursor-pointer w-full sm:w-auto"
            >
              {t("hero.cta2")}
            </Button>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => scrollTo("#promociones")}
            className="border border-white/20 text-white bg-white/5 hover:bg-white/10 px-5 py-4 rounded-xl flex items-center gap-2 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer text-sm shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-colonial-yellow animate-pulse" />
            <span>{t("hero.cta3")}</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-warm-white/60"
        >
          <span className="text-xs font-medium">{t("hero.scroll")}</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
