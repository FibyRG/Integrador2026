"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Desktop floating button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => scrollTo("#reservar")}
            className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 px-5 py-3.5 bg-coral hover:bg-coral-dark text-white rounded-2xl shadow-xl shadow-coral/30 hover:shadow-coral/50 transition-all duration-300 hover:scale-105 font-semibold"
          >
            <Bike className="w-5 h-5" />
            <span>Reservar ahora</span>
          </motion.button>

          {/* Mobile bottom bar */}
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-anil-blue/10 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center justify-around">
              <button
                onClick={() => scrollTo("#inicio")}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted-foreground hover:text-anil-blue transition-colors"
              >
                <span className="text-lg">🏠</span>
                <span className="text-[10px] font-medium">Inicio</span>
              </button>
              <button
                onClick={() => scrollTo("#bicicletas")}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted-foreground hover:text-anil-blue transition-colors"
              >
                <span className="text-lg">🚲</span>
                <span className="text-[10px] font-medium">Bicis</span>
              </button>
              <button
                onClick={() => scrollTo("#reservar")}
                className="flex flex-col items-center justify-center w-14 h-14 -mt-6 bg-coral text-white rounded-2xl shadow-lg shadow-coral/30 hover:bg-coral-dark transition-all duration-200 hover:scale-105"
              >
                <Bike className="w-6 h-6" />
              </button>
              <button
                onClick={() => scrollTo("#galeria")}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted-foreground hover:text-anil-blue transition-colors"
              >
                <span className="text-lg">📸</span>
                <span className="text-[10px] font-medium">Galería</span>
              </button>
              <button
                onClick={() => scrollTo("#contacto")}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted-foreground hover:text-anil-blue transition-colors"
              >
                <span className="text-lg">📞</span>
                <span className="text-[10px] font-medium">Contacto</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
