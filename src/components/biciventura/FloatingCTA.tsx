"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike } from "lucide-react";
import { useTranslation } from "./LanguageToggle";

export default function FloatingCTA() {
  const { t } = useTranslation();
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
          {/* Desktop floating button - bottom right */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => scrollTo("#reservar")}
            className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 px-5 py-3.5 bg-coral hover:bg-coral-dark text-white rounded-2xl shadow-xl shadow-coral/30 hover:shadow-coral/50 transition-all duration-300 hover:scale-105 font-semibold"
          >
            <Bike className="w-5 h-5" />
            <span>{t("float.reserve")}</span>
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
