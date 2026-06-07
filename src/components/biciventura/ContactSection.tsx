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
import { useTranslation } from "./LanguageToggle";

const faqs = {
  es: [
    {
      q: "¿Cuáles son los horarios de atención?",
      a: "Abrimos todos los días de 7:00 AM a 6:00 PM. Los domingos y feriados de 8:00 AM a 4:00 PM. Recomendamos reservar con anticipación especialmente en temporada alta (noviembre a abril).",
    },
    {
      q: "¿Necesito dejar un depósito?",
      a: "Sí, se requiere un depósito reembolsable de C$ 700 por bicicleta estándar y C$ 1400 por mountain bike. El depósito se devuelve en su totalidad al devolver la bicicleta en las mismas condiciones.",
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
  ],
  en: [
    {
      q: "What are your opening hours?",
      a: "We are open every day from 7:00 AM to 6:00 PM. Sundays and holidays from 8:00 AM to 4:00 PM. We recommend booking in advance, especially during the high season (November to April).",
    },
    {
      q: "Do I need to leave a deposit?",
      a: "Yes, a refundable deposit of C$ 700 per standard bike and C$ 1400 per mountain bike is required. The deposit is fully refunded when the bike is returned in the same condition.",
    },
    {
      q: "What is the cancellation policy?",
      a: "Free cancellation up to 24 hours in advance. Cancellations with less than 24 hours notice incur a 50% charge. No-shows are charged at 100%. In case of heavy rain, we offer free rescheduling.",
    },
    {
      q: "Are accessories included with the bikes?",
      a: "All bikes include a basic lock and a free map of Granada. Helmets, extra lights, child seats, and picnic kits are available for an additional daily fee.",
    },
    {
      q: "Can you deliver the bike to my hotel?",
      a: "Of course! We offer free delivery and pickup service at hotels within Granada's historic center. For hotels outside the center, there is a small transport fee.",
    },
    {
      q: "Which routes do you recommend?",
      a: "We have 3 main routes: 1) Colonial Route through the historic center (1-2 hrs), 2) Lake Waterfront with a view of the Islets (2-3 hrs), and 3) Route to Mombacho Volcano for the more adventurous (3-4 hrs). We provide detailed maps for each.",
    },
    {
      q: "Is it safe to ride a bike in Granada?",
      a: "Granada is a relatively flat and peaceful city, perfect for cycling. The streets in the center are cobblestone but passable. We always recommend wearing a helmet, keeping to the right, and avoiding peak traffic hours (7-9 AM and 5-7 PM).",
    },
  ],
};

export default function ContactSection() {
  const { lang, t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
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
            {t("contact.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-anil-blue mb-4">
            {t("contact.title.1")}{" "}
            <span className="text-colonial-yellow">{t("contact.title.2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("contact.subtitle")}
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
                    {t("contact.location")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
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
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-jungle-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-jungle-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-anil-blue text-sm">
                    {t("contact.hours")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {lang === "es" ? (
                      <>
                        Lun-Sáb: 7:00 AM - 6:00 PM
                        <br />
                        Dom y feriados: 8:00 AM - 4:00 PM
                      </>
                    ) : (
                      <>
                        Mon-Sat: 7:00 AM - 6:00 PM
                        <br />
                        Sun & Holidays: 8:00 AM - 4:00 PM
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h4 className="font-semibold text-anil-blue text-sm">
                    {t("contact.phone")}
                  </h4>
                  <a
                    href="https://wa.me/50584081989?text=Hola%20BiciVentura,%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20el%20alquiler%20de%20bicicletas."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-coral font-medium hover:underline"
                  >
                    +505 8408 1989
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-anil-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-anil-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-anil-blue text-sm">
                    {t("contact.email")}
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
              href="https://wa.me/50584081989?text=Hola%20BiciVentura,%20me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20el%20alquiler%20de%20bicicletas."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-2xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              {t("contact.whatsapp")}
            </a>

            {/* Social media */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/bici_venturas?igsh=MXYwdmRyb2N3NWZjcA%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-anil-blue/10 rounded-2xl text-anil-blue hover:bg-anil-blue hover:text-white transition-all duration-200 text-sm font-medium"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
              <a
                href="https://www.facebook.com/share/192LVEA4LH/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
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
                {t("contact.form.title")}
              </h3>

              {sent ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-jungle-green mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-anil-blue mb-2">
                    {t("contact.form.sent")}
                  </h4>
                  <p className="text-muted-foreground">
                    {t("contact.form.sentmsg")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name" className="text-sm font-medium">
                        {t("contact.form.name")}
                      </Label>
                      <Input
                        id="contact-name"
                        required
                        placeholder={t("contact.form.ph_name")}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email" className="text-sm font-medium">
                        {t("contact.form.email")}
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        required
                        placeholder={t("contact.form.ph_email")}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-subject" className="text-sm font-medium">
                      {t("contact.form.subject")}
                    </Label>
                    <Input
                      id="contact-subject"
                      required
                      placeholder={t("contact.form.ph_subject")}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-message" className="text-sm font-medium">
                      {t("contact.form.message")}
                    </Label>
                    <Textarea
                      id="contact-message"
                      required
                      placeholder={t("contact.form.ph_message")}
                      className="mt-1.5 rounded-xl min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-anil-blue hover:bg-anil-blue-dark text-white rounded-xl py-5 font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t("contact.form.send")}
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
                {t("contact.faq")}
              </h3>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs[lang].map((faq, i) => (
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
