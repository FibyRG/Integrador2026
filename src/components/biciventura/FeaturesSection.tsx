"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Bike, Map, Truck } from "lucide-react";

const features = [
  {
    icon: Bike,
    title: "Bicicletas en excelente estado",
    description:
      "Nuestra flota se mantiene impecable. Cada bici recibe mantenimiento preventivo semanal para tu seguridad y comodidad.",
    color: "colonial-yellow",
  },
  {
    icon: Map,
    title: "Rutas recomendadas con mapas",
    description:
      "Te proporcionamos mapas ilustrados de las mejores rutas por la ciudad colonial, el malecón del lago y las isletas.",
    color: "jungle-green",
  },
  {
    icon: Truck,
    title: "Pick-up y drop-off flexible",
    description:
      "Recogé tu bici en nuestro punto central frente a la Catedral o te la llevamos a tu hotel. ¡Tú elegís!",
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
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

export default function FeaturesSection() {
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
            ¿Por qué elegirnos?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            ¿Por qué{" "}
            <span className="text-colonial-yellow">BiciVentura</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Más que un alquiler, una experiencia completa para descubrir Granada
            a tu ritmo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
