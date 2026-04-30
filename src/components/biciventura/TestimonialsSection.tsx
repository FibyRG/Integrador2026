"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  origin: string;
  date: string;
  text: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María González",
    origin: "Buenos Aires, Argentina",
    date: "Diciembre 2024",
    text: "¡Increíble experiencia! Las bicis estaban en perfecto estado y el mapa que nos dieron fue super útil. Granada es aún más hermosa cuando la recorrés pedaleando. Volvería sin dudar.",
    rating: 5,
    avatar: "/images/testimonials/person-1.jpg",
  },
  {
    id: 2,
    name: "Thomas Müller",
    origin: "Berlín, Alemania",
    date: "Noviembre 2024",
    text: "The best way to explore Granada! The team was super friendly and the bikes are high quality. We rented the Mombacho MTB and had an amazing adventure on the volcano trails.",
    rating: 5,
    avatar: "/images/testimonials/person-2.jpg",
  },
  {
    id: 3,
    name: "Ana y Carlos",
    origin: "San José, Costa Rica",
    date: "Enero 2025",
    text: "Alquilamos el tandem para pasear por el malecón al atardecer. ¡Fue mágico! El servicio de entrega al hotel fue un gran plus. Muy recomendados para familias.",
    rating: 5,
    avatar: "/images/testimonials/person-3.jpg",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    origin: "Portland, EE.UU.",
    date: "Octubre 2024",
    text: "Como ciclista experimentada, puedo decir que las bicis de BiciVentura están bien mantenidas. Los recorridos recomendados por la isleta fueron el punto máximo de nuestro viaje a Nicaragua.",
    rating: 4,
    avatar: "/images/testimonials/person-1.jpg",
  },
  {
    id: 5,
    name: "Lucía Fernández",
    origin: "Madrid, España",
    date: "Febrero 2025",
    text: "Reservamos online y todo fue súper fácil. La bici urban nos permitió conocer cada rincón de la ciudad colonial. Los precios son muy justos para la calidad del servicio.",
    rating: 5,
    avatar: "/images/testimonials/person-2.jpg",
  },
  {
    id: 6,
    name: "Jean-Pierre Dubois",
    origin: "París, Francia",
    date: "Enero 2025",
    text: "Magnifique! Granada is even more beautiful from a bicycle. The colonial architecture, the lake, the volcano... everything is perfect. BiciVentura made it easy and fun.",
    rating: 5,
    avatar: "/images/testimonials/person-3.jpg",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-colonial-yellow fill-colonial-yellow"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-colonial-yellow/10"
    >
      <Quote className="w-8 h-8 text-colonial-yellow/30 mb-3" />
      <p className="text-sm sm:text-base text-anil-blue/80 leading-relaxed mb-4 line-clamp-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-anil-blue/5">
        <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="44px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-anil-blue truncate">
            {testimonial.name}
          </p>
          <p className="text-xs text-muted-foreground">{testimonial.origin}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={testimonial.rating} />
          <span className="text-[10px] text-muted-foreground">
            {testimonial.date}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const avgRating = (
    testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length
  ).toFixed(1);

  return (
    <section
      id="testimonios"
      className="py-16 sm:py-20 lg:py-24 bg-anil-blue/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 bg-jungle-green/10 text-jungle-green text-sm font-semibold rounded-full mb-4">
            Testimonios
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            Lo que dicen nuestros{" "}
            <span className="text-colonial-yellow">aventureros</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Experiencias reales de viajeros que descubrieron Granada con
            BiciVentura.
          </p>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm">
            <span className="text-3xl font-extrabold text-colonial-yellow">
              {avgRating}
            </span>
            <div>
              <StarRating rating={5} />
              <p className="text-xs text-muted-foreground">
                Basado en {testimonials.length} reseñas
              </p>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* CTA to leave review */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground text-sm mb-3">
            ¿Pedaleaste con nosotros? ¡Contanos tu experiencia!
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-anil-blue rounded-2xl text-sm font-semibold hover:bg-colonial-yellow hover:text-anil-blue transition-all duration-200 shadow-sm hover:shadow-md border border-anil-blue/10"
          >
            Dejar una reseña
          </a>
        </motion.div>
      </div>
    </section>
  );
}
