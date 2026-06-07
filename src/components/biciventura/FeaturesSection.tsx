"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Banknote, Map, Truck } from "lucide-react";
import { useTranslation } from "./LanguageToggle";

const features = [
  {
    icon: Banknote,
    titleKey: "features.f1.title",
    descriptionKey: "features.f1.desc",
    color: "colonial-yellow",
  },
  {
    icon: Map,
    titleKey: "features.f2.title",
    descriptionKey: "features.f2.desc",
    color: "jungle-green",
  },
  {
    icon: Truck,
    titleKey: "features.f3.title",
    descriptionKey: "features.f3.desc",
    color: "coral",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    "colonial-yellow": {
      bg: "bg-colonial-yellow/10",
      icon: "text-colonial-yellow",
      border: "hover:border-colonial-yellow/30",
    },
    "jungle-green": {
      bg: "bg-jungle-green/10",
      icon: "text-jungle-green",
      border: "hover:border-jungle-green/30",
    },
    coral: {
      bg: "bg-coral/10",
      icon: "text-coral",
      border: "hover:border-coral/30",
    },
  };

  const colors = colorClasses[feature.color] || colorClasses["colonial-yellow"];
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`group relative bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-transparent ${colors.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
    >
      <div
        className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`w-7 h-7 ${colors.icon}`} />
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-anil-blue mb-3">
        {t(feature.titleKey)}
      </h3>
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
        {t(feature.descriptionKey)}
      </p>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 sm:py-20 lg:py-24 texture-overlay">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-jungle-green/10 text-jungle-green text-sm font-semibold rounded-full mb-4">
            {t("features.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            {t("features.title.1")}{" "}
            <span className="text-colonial-yellow">{t("features.title.2")}</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            {t("features.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.titleKey} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
