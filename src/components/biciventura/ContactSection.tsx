"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Send,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "¿Cuáles son los horarios de atención?",
    a: "Abrimos todos los días de 7:00 AM a 6:00 PM. Los domingos y feriados de 8:00 AM a 4:00 PM. Recomendamos reservar con anticipación especialmente en temporada alta (noviembre a abril).",
  },
  {
    q: "¿Necesito dejar un depósito?",
    a: "Sí, se requiere un depósito reembolsable de $20 USD por bicicleta estándar y $40 USD por mountain bike. El depósito se devuelve en su totalidad al devolver la bicicleta en las mismas condiciones.",
  },
  {
    q: "¿Cuál es la política de cancelación?",
    a: "Cancelaciones gratuitas con más de 24 horas de anticipación. Cancelaciones con menos de 24 horas tienen un cargo del 50%. No-shows se cobran al 100%. En caso de lluvia fuerte, ofrecemos reprogramación sin costo.",
  },
  {
    q: "¿Las bicicletas incluyen accesorios?",
    a: "Todas las bicicletas incluyen candado básico y mapa gratuito de Granada. El casco, faro extra, silla para niños y kit de picnic están disponibles por un costo adicional diario.",
  },
  {
    q: "¿Pueden llevar la bici al hotel?",
    a: "¡Por supuesto! Ofrecemos servicio de entrega y recogida en hoteles dentro del centro histórico de Granada sin costo adicional. Para hoteles fuera del centro, hay un pequeño cargo de transporte.",
  },
  {
    q: "¿Qué rutas recomiendan?",
    a: "Tenemos 3 rutas principales: 1) Ruta Colonial por el centro histórico (1-2 hrs), 2) Malecón del Lago con vista a las Isletas (2-3 hrs), y 3) Ruta al Volcán Mombacho para los más aventureros (3-4 hrs). Te proporcionamos mapas detallados de cada una.",
  },
  {
    q: "¿Es seguro andar en bicicleta en Granada?",
    a: "Granada es una ciudad relativamente plana y tranquila, ideal para ciclismo. Las calles del centro son empedradas pero transitables. Recomendamos siempre usar casco, circular por la derecha, y evitar las horas pico de tráfico (7-9 AM y 5-7 PM).",
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="contacto" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-anil-blue/10 text-anil-blue text-sm font-semibold rounded-full mb-4">
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            Hablá con{" "}
            <span className="text-colonial-yellow">nosotros</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            ¿Tenés preguntas? Estamos acá para ayudarte a planear tu aventura
            en bicicleta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact info + Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-colonial-yellow/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-colonial-yellow" />
                </div>
                <div>
                  <h4 className="font-semibold text-anil-blue text-sm">
                    Ubicación
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Frente a la Catedral,
                    <br />
                    Calle La Calzada,
                    <br />
                    Granada, Nicaragua
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-jungle-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-jungle-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-anil-blue text-sm">
                    Horarios
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Lun-Sáb: 7:00 AM - 6:00 PM
                    <br />
                    Dom y feriados: 8:00 AM - 4:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h4 className="font-semibold text-anil-blue text-sm">
                    Teléfono / WhatsApp
                  </h4>
                  <a
                    href="tel:+50512345678"
                    className="text-sm text-coral font-medium hover:underline"
                  >
                    +505 1234-5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-anil-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-anil-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-anil-blue text-sm">
                    Email
                  </h4>
                  <a
                    href="mailto:info@biciventura.com"
                    className="text-sm text-anil-blue font-medium hover:underline"
                  >
                    info@biciventura.com
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp button */}
            <a
              href="https://wa.me/50512345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-2xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              Chateá por WhatsApp
            </a>

            {/* Social media */}
            <div className="flex gap-3">
              <a
                href="#"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-anil-blue/10 rounded-2xl text-anil-blue hover:bg-anil-blue hover:text-white transition-all duration-200 text-sm font-medium"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
              <a
                href="#"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-anil-blue/10 rounded-2xl text-anil-blue hover:bg-anil-blue hover:text-white transition-all duration-200 text-sm font-medium"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            </div>

            {/* Map placeholder */}
            <div className="aspect-[4/3] bg-anil-blue/10 rounded-2xl overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15600.0!2d-85.95!3d11.93!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f73e5c8f1c0e1e1%3A0x0!2sCathedral+of+Granada%2C+Nicaragua!5e0!3m2!1sen!2s!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Ubicación BiciVentura"
              />
            </div>
          </div>

          {/* Contact Form + FAQ */}
          <div className="lg:col-span-3 space-y-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-anil-blue mb-6">
                Envianos un mensaje
              </h3>

              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-jungle-green mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-anil-blue mb-2">
                    ¡Mensaje enviado!
                  </h4>
                  <p className="text-muted-foreground">
                    Te responderemos lo antes posible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name" className="text-sm font-medium">
                        Nombre
                      </Label>
                      <Input
                        id="contact-name"
                        required
                        placeholder="Tu nombre"
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="tu@email.com"
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-subject" className="text-sm font-medium">
                      Asunto
                    </Label>
                    <Input
                      id="contact-subject"
                      required
                      placeholder="¿En qué podemos ayudarte?"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-message" className="text-sm font-medium">
                      Mensaje
                    </Label>
                    <Textarea
                      id="contact-message"
                      required
                      placeholder="Escribí tu mensaje aquí..."
                      className="mt-1.5 rounded-xl min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-anil-blue hover:bg-anil-blue-dark text-white rounded-xl py-5 font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </Button>
                </form>
              )}
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm"
            >
              <h3 className="text-xl font-bold text-anil-blue mb-6">
                Preguntas frecuentes
              </h3>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-anil-blue/5 rounded-xl px-4 data-[state=open]:border-colonial-yellow/30 transition-colors"
                  >
                    <AccordionTrigger className="text-sm font-semibold text-anil-blue hover:text-colonial-yellow text-left py-3.5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-3">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
