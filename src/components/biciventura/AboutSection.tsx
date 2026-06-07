"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Compass, Eye, Heart, Globe, Shield, Activity, Leaf } from "lucide-react";
import { useTranslation } from "./LanguageToggle";

export default function AboutSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Heart,
      titleKey: "about.values.v1.title",
      descriptionKey: "about.values.v1.desc",
      color: "text-coral bg-coral/10 border-coral/20",
    },
    {
      icon: Leaf,
      titleKey: "about.values.v2.title",
      descriptionKey: "about.values.v2.desc",
      color: "text-jungle-green bg-jungle-green/10 border-jungle-green/20",
    },
    {
      icon: Shield,
      titleKey: "about.values.v3.title",
      descriptionKey: "about.values.v3.desc",
      color: "text-anil-blue bg-anil-blue/10 border-anil-blue/20",
    },
    {
      icon: Activity,
      titleKey: "about.values.v4.title",
      descriptionKey: "about.values.v4.desc",
      color: "text-colonial-yellow bg-colonial-yellow/10 border-colonial-yellow/20",
    },
  ];

  return (
    <section id="nosotros" className="py-16 sm:py-20 lg:py-24 bg-anil-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-jungle-green/10 text-jungle-green text-sm font-semibold rounded-full mb-4">
            {t("about.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            {t("about.title.1")}{" "}
            <span className="text-colonial-yellow">{t("about.title.2")}</span>
          </h2>
        </motion.div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col p-8 sm:p-10 bg-white rounded-3xl shadow-sm border border-anil-blue/5 relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-coral/10 rounded-2xl flex items-center justify-center mb-6">
              <Compass className="w-6 h-6 text-coral" />
            </div>
            <h3 className="text-2xl font-bold text-anil-blue mb-4">
              {t("about.mission.title")}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed flex-1">
              {t("about.mission.desc")}
            </p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-coral/5 rounded-bl-full -z-0" />
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col p-8 sm:p-10 bg-white rounded-3xl shadow-sm border border-anil-blue/5 relative overflow-hidden"
          >
            <div className="w-12 h-12 bg-jungle-green/10 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-jungle-green" />
            </div>
            <h3 className="text-2xl font-bold text-anil-blue mb-4">
              {t("about.vision.title")}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed flex-1">
              {t("about.vision.desc")}
            </p>
            <div className="absolute top-0 right-0 w-24 h-24 bg-jungle-green/5 rounded-bl-full -z-0" />
          </motion.div>
        </div>

        {/* Values Block */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-extrabold text-anil-blue text-center mb-10"
          >
            {t("about.values.title")}
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const ValueIcon = v.icon;
              return (
                <motion.div
                  key={v.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-transparent hover:border-anil-blue/10 hover:shadow-md transition-all duration-300 text-center flex flex-col items-center"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${v.color}`}>
                    <ValueIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-anil-blue mb-2">
                    {t(v.titleKey)}
                  </h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {t(v.descriptionKey)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
