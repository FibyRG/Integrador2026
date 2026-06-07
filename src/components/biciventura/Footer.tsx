"use client";

import { motion } from "framer-motion";
import { Bike, Navigation, Truck, MapPin, Phone, Mail, Instagram, Facebook, Heart } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "./LanguageToggle";

const quickLinks = [
  { labelKey: "nav.home", href: "#inicio" },
  { labelKey: "nav.bikes", href: "#bicicletas" },
  { labelKey: "nav.gallery", href: "#galeria" },
  { labelKey: "nav.reserve", href: "#reservar" },
  { labelKey: "nav.contact", href: "#contacto" },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  const { lang, t } = useTranslation();

  return (
    <footer className="bg-anil-blue text-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/logo-transparent.png"
              alt="BiciVentura"
              width={72}
              height={72}
              className="mb-4 object-contain"
            />
            <h3 className="text-xl font-bold text-colonial-yellow mb-2">
              BiciVentura
            </h3>
            <p className="text-warm-white/70 text-sm leading-relaxed mb-4">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/bici_venturas?igsh=MXYwdmRyb2N3NWZjcA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-colonial-yellow hover:text-anil-blue flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/192LVEA4LH/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
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
              {t("footer.links")}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-warm-white/70 hover:text-colonial-yellow text-sm transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-semibold text-colonial-yellow mb-4">
              {t("footer.services")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-warm-white/70 text-sm">
                <Bike className="w-4 h-4 text-jungle-green flex-shrink-0" />
                {t("footer.service1")}
              </li>
              <li className="flex items-center gap-2 text-warm-white/70 text-sm">
                <Navigation className="w-4 h-4 text-jungle-green flex-shrink-0" />
                {t("footer.service2")}
              </li>
              <li className="flex items-center gap-2 text-warm-white/70 text-sm">
                <Truck className="w-4 h-4 text-jungle-green flex-shrink-0" />
                {t("footer.service3")}
              </li>
              <li className="flex items-center gap-2 text-warm-white/70 text-sm">
                <MapPin className="w-4 h-4 text-jungle-green flex-shrink-0" />
                {t("footer.service4")}
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold text-colonial-yellow mb-4">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-warm-white/70 text-sm">
                <MapPin className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
                <span>
                  {lang === "es" ? (
                    <>
                      Frente a la Catedral,
                      <br />
                      Calle La Calzada,
                      <br />
                      Granada, Nicaragua
                    </>
                  ) : (
                    <>
                      In front of the Cathedral,
                      <br />
                      La Calzada Street,
                      <br />
                      Granada, Nicaragua
                    </>
                  )}
                </span>
              </li>
              <li>
                <a
                  href="https://wa.me/50584081989?text=Hola%20BiciVentura,%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20el%20alquiler%20de%20bicicletas."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-warm-white/70 hover:text-colonial-yellow text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 text-colonial-yellow" />
                  +505 8408 1989
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
          <div className="flex items-center gap-4">
            <p className="text-warm-white/50 text-xs">
              &copy; {new Date().getFullYear()} BiciVentura. {t("footer.all_rights")}
            </p>
          </div>
          <p className="text-warm-white/50 text-xs inline-flex items-center gap-1">
            {lang === "es" ? (
              <>
                Hecho con <Heart className="w-3 h-3 text-coral fill-coral mx-0.5 animate-pulse" /> en Granada, Nicaragua
              </>
            ) : (
              <>
                Made with <Heart className="w-3 h-3 text-coral fill-coral mx-0.5 animate-pulse" /> in Granada, Nicaragua
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
