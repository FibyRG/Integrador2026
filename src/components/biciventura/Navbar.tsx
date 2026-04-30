"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation, LanguageToggle } from "./LanguageToggle";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Bicicletas", href: "#bicicletas" },
  { label: "Galería", href: "#galeria" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Reservar", href: "#reservar" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const { lang, toggle, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-anil-blue/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#inicio");
            }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <Image
              src="/logo.svg"
              alt="BiciVentura"
              width={180}
              height={44}
              priority
              className="h-10 lg:h-12 w-auto"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/10 ${
                  link.label === "Reservar"
                    ? "bg-coral text-white hover:bg-coral-dark"
                    : scrolled
                    ? "text-white/90 hover:text-white"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Language toggle + Phone CTA (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageToggle lang={lang} toggle={toggle} />
            <a
              href="tel:+50512345678"
              className="flex items-center gap-2 text-warm-white/80 hover:text-white text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>+505 1234-5678</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-anil-blue/98 backdrop-blur-md border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    link.label === "Reservar"
                      ? "bg-coral text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <a
                href="tel:+50512345678"
                className="flex items-center gap-2 px-4 py-3 text-warm-white/80"
              >
                <Phone className="w-4 h-4" />
                <span>+505 1234-5678</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
