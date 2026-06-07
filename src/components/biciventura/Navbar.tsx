"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Globe, Home, Bike, Calendar, MessageCircle, MoreHorizontal, Image as ImageIcon, Star, Mail, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslation, LanguageToggle } from "./LanguageToggle";

const navLinks = [
  { labelKey: "nav.home", href: "#inicio" },
  { labelKey: "nav.bikes", href: "#bicicletas" },
  { labelKey: "nav.gallery", href: "#galeria" },
  { labelKey: "nav.testimonials", href: "#testimonios" },
  { labelKey: "nav.reserve", href: "#reservar" },
  { labelKey: "nav.contact", href: "#contacto" },
  { labelKey: "nav.dashboard", href: "#dashboard" },
];

export default function Navbar() {
  const { lang, toggle, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("#inicio");

  useEffect(() => {
    const sections = ["#inicio", "#bicicletas", "#galeria", "#testimonios", "#reservar", "#contacto", "#dashboard"];
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll Spy
      const scrollPos = window.scrollY + 250; // offset
      
      // Special check for bottom of page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection("#contacto");
        return;
      }

      for (const section of sections) {
        const el = document.querySelector(section);
        if (el) {
          const top = (el as HTMLElement).offsetTop;
          const height = (el as HTMLElement).offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 z-50 pointer-events-none"
      >
        <nav className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-2xl md:rounded-[20px] transition-all duration-300 pointer-events-auto ${
          scrolled
            ? "bg-anil-blue/85 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
            : "bg-anil-blue/30 backdrop-blur-lg border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        }`}>
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <a
              href="#inicio"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#inicio");
              }}
              className="flex items-center gap-2 flex-shrink-0 group"
            >
              <Image
                src="/logo-icon-transparent.png"
                alt="BiciVentura"
                width={45}
                height={45}
                priority
                className="h-8 lg:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-lg lg:text-xl font-extrabold tracking-wider text-white transition-colors duration-300">
                Bici<span className="text-colonial-yellow">Ventura</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHoveredLink(null)}>
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 z-10 ${
                    link.labelKey === "nav.reserve"
                      ? "bg-coral text-white hover:bg-coral-dark animate-pulse"
                      : activeSection === link.href
                      ? "text-colonial-yellow"
                      : scrolled
                      ? "text-white/90 hover:text-white"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {/* Buttery sliding hover pill */}
                  {hoveredLink === link.href && link.labelKey !== "nav.reserve" && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t(link.labelKey)}</span>
                </button>
              ))}
            </div>

            {/* Language toggle + Phone CTA (desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle lang={lang} toggle={toggle} />
              <a
                href="https://wa.me/50584081989?text=Hola%20BiciVentura,%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20el%20alquiler%20de%20bicicletas."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-warm-white/80 hover:text-white text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-colonial-yellow" />
                <span>+505 8408 1989</span>
              </a>
            </div>

            {/* Mobile Language Toggle (Direct access in top header, replacing hamburger) */}
            <div className="lg:hidden flex items-center">
              <LanguageToggle lang={lang} toggle={toggle} />
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Floating Bottom Navigation Bar (Mobile only) */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="relative bg-anil-blue/80 backdrop-blur-xl border border-white/15 rounded-[24px] h-16 flex items-center justify-around px-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
          {/* Subtle top inner light reflection line inside dock for premium glass effect */}
          <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Inicio Button */}
          <button
            onClick={() => handleNavClick("#inicio")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
              activeSection === "#inicio"
                ? "text-colonial-yellow scale-105"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Home className="w-5 h-5 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-semibold mt-1 tracking-tight">
              {t("nav.home")}
            </span>
            {activeSection === "#inicio" && (
              <motion.span
                layoutId="active-dot-dock"
                className="absolute bottom-1.5 w-1 h-1 bg-colonial-yellow rounded-full shadow-[0_0_8px_#ffd700]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
          </button>

          {/* Flota Button */}
          <button
            onClick={() => handleNavClick("#bicicletas")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
              activeSection === "#bicicletas"
                ? "text-colonial-yellow scale-105"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Bike className="w-5 h-5 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-semibold mt-1 tracking-tight">
              {lang === "es" ? "Flota" : "Fleet"}
            </span>
            {activeSection === "#bicicletas" && (
              <motion.span
                layoutId="active-dot-dock"
                className="absolute bottom-1.5 w-1 h-1 bg-colonial-yellow rounded-full shadow-[0_0_8px_#ffd700]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
          </button>

          {/* Centerpiece: Reservar Button */}
          <div className="flex-1 flex justify-center h-full relative -translate-y-4">
            <button
              onClick={() => handleNavClick("#reservar")}
              className={`flex items-center justify-center w-14 h-14 rounded-full bg-coral text-white shadow-[0_8px_25px_rgba(253,104,80,0.5)] border-4 border-anil-blue transition-all duration-300 hover:scale-110 active:scale-95 ${
                activeSection === "#reservar" ? "ring-2 ring-coral/50 scale-105" : ""
              }`}
              aria-label="Reservar"
            >
              <Calendar className="w-6 h-6 animate-pulse" />
            </button>
          </div>

          {/* WhatsApp Link */}
          <a
            href="https://wa.me/50584081989?text=Hola%20BiciVentura,%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20el%20alquiler%20de%20bicicletas."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center flex-1 h-full text-white/60 hover:text-white transition-all duration-300 relative"
          >
            <MessageCircle className="w-5 h-5 text-green-400 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-semibold mt-1 tracking-tight">
              WhatsApp
            </span>
          </a>

          {/* Más Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative ${
              isOpen
                ? "text-colonial-yellow scale-105"
                : "text-white/60 hover:text-white"
            }`}
          >
            <MoreHorizontal className="w-5 h-5 transition-transform duration-200 active:scale-95" />
            <span className="text-[10px] font-semibold mt-1 tracking-tight">
              {lang === "es" ? "Más" : "More"}
            </span>
            {isOpen && (
              <motion.span
                layoutId="active-dot-dock"
                className="absolute bottom-1.5 w-1 h-1 bg-colonial-yellow rounded-full shadow-[0_0_8px_#ffd700]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Drawer Overlay for Mobile (Más Menu) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Sliding Bottom Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-anil-blue/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[28px] p-6 pb-28 shadow-2xl max-h-[75vh] overflow-y-auto"
            >
              {/* Drag Handle Indicator */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

              {/* Title & Close */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {lang === "es" ? "Explorá BiciVentura" : "Explore BiciVentura"}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === "es" ? "Seleccioná un módulo para navegar" : "Select a module to navigate"}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid Layout of Modules */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Galería */}
                <button
                  onClick={() => {
                    handleNavClick("#galeria");
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="p-2.5 rounded-xl bg-colonial-yellow/10 text-colonial-yellow mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-white">{t("nav.gallery")}</span>
                  <span className="text-[11px] text-white/50 mt-1">
                    {lang === "es" ? "Fotos de paseos" : "Tour photos"}
                  </span>
                </button>

                {/* Testimonios */}
                <button
                  onClick={() => {
                    handleNavClick("#testimonios");
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="p-2.5 rounded-xl bg-coral/10 text-coral mb-3 group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-white">{t("nav.testimonials")}</span>
                  <span className="text-[11px] text-white/50 mt-1">
                    {lang === "es" ? "Opiniones reales" : "Real reviews"}
                  </span>
                </button>

                {/* Contacto */}
                <button
                  onClick={() => {
                    handleNavClick("#contacto");
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-white">{t("nav.contact")}</span>
                  <span className="text-[11px] text-white/50 mt-1">
                    {lang === "es" ? "Escribinos" : "Message us"}
                  </span>
                </button>

                {/* Dashboard */}
                <button
                  onClick={() => {
                    handleNavClick("#dashboard");
                    setIsOpen(false);
                  }}
                  className="flex flex-col items-start p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
                >
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-white">{t("nav.dashboard")}</span>
                  <span className="text-[11px] text-white/50 mt-1">
                    {lang === "es" ? "Métricas GA4" : "GA4 Metrics"}
                  </span>
                </button>

                {/* WhatsApp Chat Link */}
                <a
                  href="https://wa.me/50584081989?text=Hola%20BiciVentura,%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20el%20alquiler%20de%20bicicletas."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-start p-4 rounded-2xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all text-left group"
                >
                  <div className="p-2.5 rounded-xl bg-green-500/20 text-green-400 mb-3 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-white">WhatsApp</span>
                  <span className="text-[11px] text-green-400/80 mt-1">
                    {lang === "es" ? "Chateá directo" : "Chat direct"}
                  </span>
                </a>
              </div>

              {/* Language Selector inside Menu */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-5 h-5 text-colonial-yellow" />
                  <div>
                    <span className="text-sm font-bold text-white block">Idioma / Language</span>
                    <span className="text-xs text-white/50">
                      {lang === "es" ? "Español seleccionado" : "English selected"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggle}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5"
                >
                  {lang === "es" ? "SWITCH TO ENGLISH" : "CAMBIAR A ESPAÑOL"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
