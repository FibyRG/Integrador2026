"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bike } from "lucide-react";

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative py-20 sm:py-24 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/cta-bg.jpg"
          alt="Granada Nicaragua al atardecer"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-anil-blue/75" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-colonial-yellow via-coral to-jungle-green" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-colonial-yellow/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bike className="w-8 h-8 text-colonial-yellow" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            ¿Listo para <span className="text-colonial-yellow">rodar</span>?
          </h2>
          <p className="text-warm-white/80 text-lg sm:text-xl mb-8 max-w-xl mx-auto">
            No esperes más. Reservá tu bicicleta y empezá a explorar la perla
            colonial de Centroamérica.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => scrollTo("#reservar")}
              className="bg-coral hover:bg-coral-dark text-white text-lg px-10 py-6 rounded-2xl shadow-lg shadow-coral/30 hover:shadow-coral/50 transition-all duration-300 hover:scale-105 font-semibold"
            >
              Reservá ahora
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("#contacto")}
              className="border-2 border-warm-white/30 text-warm-white hover:bg-warm-white/10 text-lg px-10 py-6 rounded-2xl backdrop-blur-sm transition-all duration-300 font-semibold"
            >
              Hablá con nosotros
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
