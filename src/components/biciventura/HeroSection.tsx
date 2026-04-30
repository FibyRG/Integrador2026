"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
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
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-anil-blue/60 via-anil-blue/40 to-anil-blue/80" />
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-2 bg-colonial-yellow/20 backdrop-blur-sm rounded-full text-colonial-yellow text-sm font-medium mb-6 border border-colonial-yellow/30">
            🚴 Granada, Nicaragua
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6"
        >
          Explorá Granada
          <br />
          <span className="text-colonial-yellow">en bicicleta</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-warm-white/90 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Alquiler fácil, recorridos inolvidables.
          <br className="hidden sm:block" />
          Reservá en minutos y descubrí la ciudad colonial sobre dos ruedas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => scrollTo("#reservar")}
            className="bg-coral hover:bg-coral-dark text-white text-lg px-8 py-6 rounded-2xl shadow-lg shadow-coral/30 hover:shadow-coral/50 transition-all duration-300 hover:scale-105 font-semibold"
          >
            Reservar Ahora
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo("#bicicletas")}
            className="border-2 border-warm-white/40 text-warm-white hover:bg-warm-white/10 text-lg px-8 py-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold"
          >
            Ver Bicicletas
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
          <span className="text-xs font-medium">Descubrí más</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
