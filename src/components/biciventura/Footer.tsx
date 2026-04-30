"use client";

import { motion } from "framer-motion";
import { Bike, Navigation, Truck, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import Image from "next/image";

const quickLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Bicicletas", href: "#bicicletas" },
  { label: "Galería", href: "#galeria" },
  { label: "Reservar", href: "#reservar" },
  { label: "Contacto", href: "#contacto" },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer className="bg-anil-blue text-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/favicon.svg"
              alt="BiciVentura"
              width={48}
              height={48}
              className="mb-4"
            />
            <h3 className="text-xl font-bold text-colonial-yellow mb-2">
              BiciVentura
            </h3>
            <p className="text-warm-white/70 text-sm leading-relaxed mb-4">
              Pedaleá la aventura colonial. Alquiler de bicicletas en el corazón
              de Granada, Nicaragua.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-colonial-yellow hover:text-anil-blue flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-colonial-yellow hover:text-anil-blue flex items-center justify-center transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-colonial-yellow mb-4">
              Enlaces
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-warm-white/70 hover:text-colonial-yellow text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-semibold text-colonial-yellow mb-4">
              Servicios
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-warm-white/70 text-sm">
                <Bike className="w-4 h-4 text-jungle-green flex-shrink-0" />
                Alquiler por hora y día
              </li>
              <li className="flex items-center gap-2 text-warm-white/70 text-sm">
                <Navigation className="w-4 h-4 text-jungle-green flex-shrink-0" />
                Rutas recomendadas
              </li>
              <li className="flex items-center gap-2 text-warm-white/70 text-sm">
                <Truck className="w-4 h-4 text-jungle-green flex-shrink-0" />
                Pick-up y drop-off flexible
              </li>
              <li className="flex items-center gap-2 text-warm-white/70 text-sm">
                <MapPin className="w-4 h-4 text-jungle-green flex-shrink-0" />
                Tours guiados
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold text-colonial-yellow mb-4">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-warm-white/70 text-sm">
                <MapPin className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
                <span>
                  Frente a la Catedral,
                  <br />
                  Calle La Calzada,
                  <br />
                  Granada, Nicaragua
                </span>
              </li>
              <li>
                <a
                  href="tel:+50512345678"
                  className="flex items-center gap-2 text-warm-white/70 hover:text-colonial-yellow text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +505 1234-5678
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@biciventura.com"
                  className="flex items-center gap-2 text-warm-white/70 hover:text-colonial-yellow text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@biciventura.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-warm-white/50 text-xs">
            &copy; {new Date().getFullYear()} BiciVentura. Todos los derechos
            reservados.
          </p>
          <p className="text-warm-white/50 text-xs">
            Hecho con ❤️ en Granada, Nicaragua
          </p>
        </div>
      </div>
    </footer>
  );
}
