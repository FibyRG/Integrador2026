"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";

interface Bike {
  id: string;
  name: string;
  type: "urbana" | "montaña" | "cruiser" | "tandem";
  image: string;
  description: string;
  features: string[];
  pricePerHour: number;
  pricePerDay: number;
  available: boolean;
}

const bikes: Bike[] = [
  {
    id: "granada-cruiser",
    name: "Granada Cruiser",
    type: "cruiser",
    image: "/images/bikes/granada-cruiser.jpg",
    description:
      "Bicicleta estilo cruiser perfecta para pasear por las calles coloniales. Asiento cómodo, canasta incluida y diseño vintage que combina con la ciudad.",
    features: ["Canasta", "Asiento acolchado", "Cambios 3 velocidades", "Faro LED"],
    pricePerHour: 5,
    pricePerDay: 25,
    available: true,
  },
  {
    id: "mombacho-mtb",
    name: "Mombacho MTB",
    type: "montaña",
    image: "/images/bikes/mombacho-mtb.jpg",
    description:
      "Mountain bike robusta para aventuras en los senderos del volcán Mombacho o rutas fuera del asfalto. Suspensión delantera y frenos de disco.",
    features: ["Suspensión delantera", "Frenos de disco", "21 velocidades", "Llanta antipinchaduras"],
    pricePerHour: 8,
    pricePerDay: 40,
    available: true,
  },
  {
    id: "colonial-urban",
    name: "Colonial Urban",
    type: "urbana",
    image: "/images/bikes/colonial-urban.jpg",
    description:
      "Bicicleta urbana clásica en tono colonial amarillo. Ideal para recorrer el centro histórico y tomar fotos. Liviana y fácil de manejar.",
    features: ["Canasta tejida", "Portaequipajes", "7 velocidades", "Cascó incluido"],
    pricePerHour: 4,
    pricePerDay: 20,
    available: true,
  },
  {
    id: "tandem-amigos",
    name: "Tandem Amigos",
    type: "tandem",
    image: "/images/bikes/tandem-amigos.jpg",
    description:
      "Bicicleta tandem para compartir la aventura. Perfecta para parejas o amigos que quieren pedalear juntos por el malecón del lago.",
    features: ["Doble asiento", "Frenos independientes", "7 velocidades", "Soporte para celular"],
    pricePerHour: 10,
    pricePerDay: 50,
    available: false,
  },
];

const accessories = [
  { id: "casco", name: "Casco de seguridad", price: 2, icon: "🪖" },
  { id: "candado", name: "Candado U-Lock", price: 1, icon: "🔒" },
  { id: "silla", name: "Silla para niños", price: 5, icon: "🧒" },
  { id: "picnic", name: "Kit de picnic", price: 8, icon: "🧺" },
  { id: "botella", name: "Botella de agua", price: 1, icon: "💧" },
  { id: "farol", name: "Farol extra", price: 1, icon: "🔦" },
];

const typeFilters = [
  { value: "todos", label: "Todas" },
  { value: "urbana", label: "Urbanas" },
  { value: "montaña", label: "Montaña" },
  { value: "cruiser", label: "Cruiser" },
  { value: "tandem", label: "Tandem" },
];

function BikeCard({ bike, onSelect }: { bike: Bike; onSelect: (bike: Bike) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-colonial-yellow/20"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={bike.image}
          alt={bike.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-anil-blue/90 text-white backdrop-blur-sm border-none">
            {bike.type.charAt(0).toUpperCase() + bike.type.slice(1)}
          </Badge>
          {!bike.available && (
            <Badge className="bg-coral/90 text-white backdrop-blur-sm border-none">
              Agotada
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-bold text-anil-blue mb-2">{bike.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
          {bike.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {bike.features.map((f) => (
            <span
              key={f}
              className="px-2.5 py-1 bg-jungle-green/8 text-jungle-green text-xs font-medium rounded-lg"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-end gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Por hora</span>
            </div>
            <span className="text-2xl font-extrabold text-coral">
              ${bike.pricePerHour}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Por día</span>
            </div>
            <span className="text-2xl font-extrabold text-coral">
              ${bike.pricePerDay}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={() => onSelect(bike)}
          disabled={!bike.available}
          className={`w-full py-5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
            bike.available
              ? "bg-coral hover:bg-coral-dark text-white hover:shadow-lg hover:shadow-coral/20 hover:scale-[1.02]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {bike.available ? "Reservar esta bici" : "No disponible"}
        </Button>
      </div>
    </motion.div>
  );
}

export default function BikeCatalog({ onReserve }: { onReserve: (bike?: Bike) => void }) {
  const [filter, setFilter] = useState("todos");
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const filteredBikes =
    filter === "todos" ? bikes : bikes.filter((b) => b.type === filter);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="bicicletas" className="py-16 sm:py-20 lg:py-24 bg-anil-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 bg-coral/10 text-coral text-sm font-semibold rounded-full mb-4">
            Nuestra flota
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            Elegí tu{" "}
            <span className="text-colonial-yellow">compañera de ruta</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bicicletas para cada estilo de aventura. Todas incluyen mapa gratuito
            de Granada.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === f.value
                  ? "bg-anil-blue text-white shadow-md"
                  : "bg-white text-anil-blue hover:bg-anil-blue/10 border border-anil-blue/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Bike Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredBikes.map((bike) => (
            <BikeCard key={bike.id} bike={bike} onSelect={onReserve} />
          ))}
        </div>

        {/* Accessories */}
        <div className="mt-12 lg:mt-16">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-anil-blue mb-6 text-center"
          >
            Complementos disponibles
          </motion.h3>

          <div className="relative">
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-colonial-yellow hover:text-white transition-all duration-200 -translate-x-2 hidden md:flex"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-colonial-yellow hover:text-white transition-all duration-200 translate-x-2 hidden md:flex"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {accessories.map((acc) => (
                <div
                  key={acc.id}
                  className="flex-shrink-0 w-44 bg-white rounded-2xl p-4 border border-anil-blue/5 hover:border-colonial-yellow/30 hover:shadow-md transition-all duration-200 snap-start text-center"
                >
                  <span className="text-3xl mb-2 block">{acc.icon}</span>
                  <h4 className="text-sm font-semibold text-anil-blue mb-1">
                    {acc.name}
                  </h4>
                  <span className="text-coral font-bold">
                    +${acc.price}/día
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
