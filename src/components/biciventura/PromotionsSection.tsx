"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Gift, Users, Bike, Sparkles, Tag } from "lucide-react";
import { useTranslation } from "./LanguageToggle";
import PromoCarousel from "@/components/ui/PromoCarousel";

const promoCards = [
  {
    icon: Gift,
    titleKey: "promotions.p1.title",
    descriptionKey: "promotions.p1.desc",
    color: "colonial-yellow",
    badge: { es: "3x2 Renta", en: "3x2 Rental" },
    tag: "3X2",
  },
  {
    icon: Users,
    titleKey: "promotions.p2.title",
    descriptionKey: "promotions.p2.desc",
    color: "jungle-green",
    badge: { es: "Grupal -15%", en: "Group -15%" },
    tag: "-15%",
  },
  {
    icon: Bike,
    titleKey: "promotions.p3.title",
    descriptionKey: "promotions.p3.desc",
    color: "coral",
    badge: { es: "Picnic Gratis", en: "Free Picnic" },
    tag: "GRATIS",
  },
];

export default function PromotionsSection() {
  const { lang, t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const colorClasses: Record<string, { bg: string; icon: string; border: string; accent: string; badgeBg: string }> = {
    "colonial-yellow": {
      bg: "bg-colonial-yellow/5 hover:bg-colonial-yellow/10",
      icon: "text-colonial-yellow bg-colonial-yellow/10",
      border: "border-colonial-yellow/20 hover:border-colonial-yellow/40",
      accent: "text-colonial-yellow",
      badgeBg: "bg-colonial-yellow text-anil-blue",
    },
    "jungle-green": {
      bg: "bg-jungle-green/5 hover:bg-jungle-green/10",
      icon: "text-jungle-green bg-jungle-green/10",
      border: "border-jungle-green/20 hover:border-jungle-green/40",
      accent: "text-jungle-green",
      badgeBg: "bg-jungle-green text-white",
    },
    coral: {
      bg: "bg-coral/5 hover:bg-coral/10",
      icon: "text-coral bg-coral/10",
      border: "border-coral/20 hover:border-coral/40",
      accent: "text-coral",
      badgeBg: "bg-coral text-white",
    },
  };

  return (
    <section id="promociones" className="py-16 sm:py-20 lg:py-24 bg-warm-white texture-overlay">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-coral/10 text-coral text-sm font-semibold rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 inline-block mr-1.5 align-text-top" />
            {t("promotions.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            {t("promotions.title.1")}{" "}
            <span className="text-colonial-yellow">{t("promotions.title.2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg mb-8">
            {t("promotions.subtitle")}
          </p>
        </motion.div>

        {/* Promo Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 max-w-5xl mx-auto"
        >
          <PromoCarousel
            slides={[
              {
                image: "carrusel 1.jpg",
                title: lang === "es" ? "Explorá Granada a tu ritmo" : "Explore Granada at your own pace",
                description: lang === "es" ? "Alquileres por hora o por día con mapas ilustrados gratis y asistencia local." : "Hourly or daily rentals with free illustrated maps and local assistance.",
                ctaText: lang === "es" ? "Reservar Ahora" : "Book Now",
                ctaLink: "/#reservar",
                alt: "Bicicletas de alquiler BiciVentura en Granada"
              },
              {
                image: "carrusel 2.jpg",
                title: lang === "es" ? "Promoción Especial Fin de Semana" : "Special Weekend Promotion",
                description: lang === "es" ? "Alquilá 2 días y llevate el 3er día totalmente gratis. ¡Disfrutá más de la ciudad colonial!" : "Rent for 2 days and get the 3rd day completely free. Enjoy more of the colonial city!",
                ctaText: lang === "es" ? "Ver Catálogo" : "View Catalog",
                ctaLink: "/#bicicletas",
                alt: "Recorrido en bicicleta colonial por Granada"
              }
            ]}
            autoPlay={true}
            interval={5000}
          />
        </motion.div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {promoCards.map((promo, index) => {
            const colors = colorClasses[promo.color] || colorClasses["colonial-yellow"];
            const Icon = promo.icon;
            const badgeText = lang === "es" ? promo.badge.es : promo.badge.en;

            return (
              <motion.div
                key={promo.titleKey}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white border ${colors.border} transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Floating promo badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-xl text-xs font-bold ${colors.badgeBg} flex items-center gap-1`}>
                  <Tag className="w-3 h-3" />
                  <span>{badgeText}</span>
                </div>

                {/* Promo Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colors.icon}`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Promo Text */}
                <h3 className="text-xl font-bold text-anil-blue mb-3">
                  {t(promo.titleKey)}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                  {t(promo.descriptionKey)}
                </p>

                {/* Large background watermark */}
                <div className="absolute -bottom-8 -right-8 opacity-5 font-black text-8xl text-anil-blue select-none">
                  {promo.tag}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
