"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useTranslation } from "./LanguageToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bike,
  CalendarDays,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  Clock,
  MapPin,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  HardHat,
  Lock,
  Baby,
  UtensilsCrossed,
  Droplets,
  Flashlight,
  Calendar as CalendarIcon,
  Lightbulb,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

interface CartItem {
  bikeId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface AccessoryItem {
  id: string;
  nameKey: string;
  price: number;
  icon: LucideIcon;
  qty: number;
}

const timeSlots = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const nationalities = {
  es: [
    "Nicaragüense", "Costarricense", "Estadounidense", "Canadiense",
    "Español", "Argentino", "Mexicano", "Colombiano", "Alemán", "Francés",
    "Británico", "Italiano", "Holandés", "Brasileño", "Otro",
  ],
  en: [
    "Nicaraguan", "Costa Rican", "American", "Canadian",
    "Spanish", "Argentinian", "Mexican", "Colombian", "German", "French",
    "British", "Italian", "Dutch", "Brazilian", "Other",
  ]
};

const steps = [
  { icon: Bike, labelKey: "reserve.step1" },
  { icon: ShoppingBag, labelKey: "reserve.accessories" },
  { icon: CalendarDays, labelKey: "reserve.step2" },
  { icon: UserCheck, labelKey: "reserve.step3" },
];

export default function ReservationWizard({
  preselectedBike,
}: {
  preselectedBike?: {
    id: string;
    name: string;
    pricePerDay: number;
    image: string;
  };
}) {
  const { lang, t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Step 1 state
  const [cart, setCart] = useState<CartItem[]>(
    preselectedBike
      ? [
          {
            bikeId: preselectedBike.id,
            name: preselectedBike.name,
            price: preselectedBike.pricePerDay,
            qty: 1,
            image: preselectedBike.image,
          },
        ]
      : []
  );
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);

  // Step 2 state
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("");
  const [returnTime, setReturnTime] = useState("");

  // Step 3 state (aligned with SQL columns)
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    codigo: "",
    genero: "",
    nacionalidad: "",
    telefono: "",
  });

  const allAccessories: { id: string; nameKey: string; price: number; icon: LucideIcon }[] = [
    { id: "casco", nameKey: "accessories.helmet", price: 40, icon: HardHat },
    { id: "candado", nameKey: "accessories.lock", price: 20, icon: Lock },
    { id: "silla", nameKey: "accessories.child_seat", price: 100, icon: Baby },
    { id: "picnic", nameKey: "accessories.picnic_kit", price: 160, icon: UtensilsCrossed },
    { id: "botella", nameKey: "accessories.water_bottle", price: 20, icon: Droplets },
    { id: "farol", nameKey: "accessories.extra_light", price: 20, icon: Flashlight },
  ];

  const addAccessory = (acc: (typeof allAccessories)[0]) => {
    setAccessories((prev) => {
      const existing = prev.find((a) => a.id === acc.id);
      if (existing) {
        return prev.map((a) =>
          a.id === acc.id ? { ...a, qty: a.qty + 1 } : a
        );
      }
      return [...prev, { ...acc, qty: 1 }];
    });
  };

  const removeAccessory = (id: string) => {
    setAccessories((prev) => {
      const existing = prev.find((a) => a.id === id);
      if (existing && existing.qty > 1) {
        return prev.map((a) =>
          a.id === id ? { ...a, qty: a.qty - 1 } : a
        );
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  const days =
    pickupDate && returnDate
      ? Math.max(1, Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)))
      : 1;

  const bikesTotal = cart.reduce((acc, item) => acc + item.price * item.qty * days, 0);
  const accTotal = accessories.reduce(
    (acc, item) => acc + item.price * item.qty * days,
    0
  );
  const total = bikesTotal + accTotal;

  const canProceedStep1 = cart.length > 0;
  const canProceedStep2 = pickupDate && returnDate && pickupTime && returnTime;
  const canSubmit =
    formData.nombres.trim() !== "" &&
    formData.apellidos.trim() !== "" &&
    formData.codigo.trim() !== "" &&
    formData.genero.trim() !== "" &&
    formData.nacionalidad.trim() !== "" &&
    formData.telefono.trim() !== "";

  const handleSubmit = () => {
    setCompleted(true);
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const nationalityList = nationalities[lang] || nationalities.es;

  if (completed) {
    return (
      <section id="reservar" className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-jungle-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-jungle-green" />
          </motion.div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <PartyPopper className="w-6 h-6 text-colonial-yellow" />
            <h2 className="text-3xl font-extrabold text-anil-blue">
              {t("reserve.confirmed")}
            </h2>
          </div>
          <p className="text-muted-foreground mb-2">
            {lang === "es" ? "¡Gracias" : "Thank you"}, <span className="font-semibold text-anil-blue">{formData.nombres} {formData.apellidos}</span>! {t("reserve.thanks")}
          </p>
          <p className="text-muted-foreground mb-6">
            {lang === "es" ? "Tu reserva ha sido registrada con el código:" : "Your booking has been registered with code:"}{" "}
            <span className="font-semibold text-anil-blue">{formData.codigo}</span>{" "}
            {lang === "es" ? "para el momento de tu recogida." : "for your pickup."}
          </p>

          <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 text-left">
            <h3 className="font-bold text-anil-blue mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-colonial-yellow" />
              {t("reserve.summary")}
            </h3>
            {cart.map((item) => (
              <div key={item.bikeId} className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.qty}
                </span>
                <span className="font-semibold text-anil-blue">
                  C$ {item.price * item.qty * days}
                </span>
              </div>
            ))}
            {accessories.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">
                  {t(item.nameKey)} × {item.qty}
                </span>
                <span className="font-semibold text-anil-blue">
                  C$ {item.price * item.qty * days}
                </span>
              </div>
            ))}
            <div className="border-t border-anil-blue/10 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-bold text-anil-blue">{t("reserve.total")}</span>
                <span className="text-xl font-extrabold text-coral">C$ {total}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("reserve.payment")}
              </p>
            </div>
          </div>

          <div className="bg-colonial-yellow/10 rounded-2xl p-4 mb-8">
            <p className="text-sm text-anil-blue flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-coral" />
              <span className="font-medium">{t("reserve.meeting")}</span> {t("reserve.meeting_addr")}
            </p>
          </div>

          <Button
            onClick={() => {
              setCompleted(false);
              setStep(0);
              setCart([]);
              setAccessories([]);
              setPickupDate(undefined);
              setReturnDate(undefined);
              setPickupTime("");
              setReturnTime("");
              setFormData({ nombres: "", apellidos: "", codigo: "", genero: "", nacionalidad: "", telefono: "" });
            }}
            className="bg-anil-blue hover:bg-anil-blue-dark text-white rounded-2xl px-8"
          >
            {t("reserve.another")}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="reservar" className="py-16 sm:py-20 lg:py-24 bg-anil-blue">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-block px-4 py-1.5 bg-coral/20 text-coral text-sm font-semibold rounded-full mb-4">
            {t("reserve.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            {t("reserve.title.1")}{" "}
            <span className="text-colonial-yellow">{t("reserve.title.2")}</span>
          </h2>
          <p className="text-warm-white/70 max-w-xl mx-auto">
            {t("reserve.subtitle")}
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-colonial-yellow text-anil-blue scale-110"
                        : isDone
                        ? "bg-jungle-green text-white"
                        : "bg-white/10 text-warm-white/50"
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1.5 font-medium ${
                      isActive
                        ? "text-colonial-yellow"
                        : isDone
                        ? "text-jungle-green"
                        : "text-warm-white/40"
                    }`}
                  >
                    {t(s.labelKey)}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 rounded mb-5 transition-colors duration-300 ${
                      i < step ? "bg-jungle-green" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Choose bikes */}
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-anil-blue mb-6 flex items-center gap-2">
                  <Bike className="w-5 h-5 text-colonial-yellow" />
                  {t("reserve.step1")}
                </h3>

                {/* Available bikes */}
                <div className="space-y-3 mb-6">
                  {[
                    { id: "granada-cruiser", name: "Granada Cruiser", price: 500, image: "/images/bikes/granada-cruiser.jpg" },
                    { id: "mombacho-mtb", name: "Mombacho MTB", price: 800, image: "/images/bikes/mombacho-mtb.jpg" },
                    { id: "colonial-urban", name: "Colonial Urban", price: 400, image: "/images/bikes/colonial-urban.jpg" },
                    { id: "tandem-amigos", name: "Tandem Amigos", price: 1000, image: "/images/bikes/tandem-amigos.jpg" },
                  ].map((bike) => {
                    const inCart = cart.find((c) => c.bikeId === bike.id);
                    return (
                      <div
                        key={bike.id}
                        className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                          inCart
                            ? "border-colonial-yellow bg-colonial-yellow/5"
                            : "border-transparent bg-warm-white hover:border-anil-blue/20"
                        }`}
                        onClick={() => {
                          if (inCart) {
                            setCart((prev) =>
                              prev.filter((c) => c.bikeId !== bike.id)
                            );
                          } else {
                            setCart((prev) => [
                              ...prev,
                              {
                                bikeId: bike.id,
                                name: bike.name,
                                price: bike.price,
                                qty: 1,
                                image: bike.image,
                              },
                            ]);
                          }
                        }}
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={bike.image}
                            alt={bike.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-anil-blue text-sm">
                            {bike.name}
                          </p>
                          <p className="text-coral font-bold text-sm">
                            C$ {bike.price}/{t("reserve.day")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {inCart && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCart((prev) =>
                                    prev
                                      .map((c) =>
                                        c.bikeId === bike.id
                                          ? { ...c, qty: Math.max(1, c.qty - 1) }
                                          : c
                                      )
                                      .filter((c) => c.qty > 0)
                                  );
                                }}
                                className="w-7 h-7 rounded-lg bg-anil-blue/10 flex items-center justify-center text-anil-blue hover:bg-anil-blue/20"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-anil-blue">
                                {inCart.qty}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCart((prev) =>
                                    prev.map((c) =>
                                      c.bikeId === bike.id
                                        ? { ...c, qty: c.qty + 1 }
                                        : c
                                    )
                                  );
                                }}
                                className="w-7 h-7 rounded-lg bg-anil-blue/10 flex items-center justify-center text-anil-blue hover:bg-anil-blue/20"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (inCart) {
                                  setCart((prev) =>
                                    prev.filter((c) => c.bikeId !== bike.id)
                                  );
                              } else {
                                setCart((prev) => [
                                  ...prev,
                                  {
                                    bikeId: bike.id,
                                    name: bike.name,
                                    price: bike.price,
                                    qty: 1,
                                    image: bike.image,
                                  },
                                ]);
                              }
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                              inCart
                                ? "bg-coral/10 text-coral hover:bg-coral/20"
                                : "bg-jungle-green/10 text-jungle-green hover:bg-jungle-green/20"
                            }`}
                          >
                            {inCart ? (
                              <Trash2 className="w-3.5 h-3.5" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart summary */}
                {cart.length > 0 && (
                  <div className="bg-warm-white rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-anil-blue">
                        {t("reserve.cart")}
                      </span>
                      <span className="text-lg font-extrabold text-coral">
                        C$ {bikesTotal}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cart.reduce((acc, c) => acc + c.qty, 0)} {lang === "es" ? "bici(s)" : "bike(s)"} · {t("reserve.perday")}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Choose accessories */}
            {step === 1 && (
              <motion.div
                key="step_acc"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-anil-blue mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-colonial-yellow" />
                  {t("reserve.accessories")}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {allAccessories.map((acc) => {
                    const AccIcon = acc.icon;
                    const inCart = accessories.find((a) => a.id === acc.id);
                    return (
                      <button
                        key={acc.id}
                        onClick={() =>
                          inCart ? removeAccessory(acc.id) : addAccessory(acc)
                        }
                        className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all duration-200 ${
                          inCart
                            ? "bg-jungle-green/10 border-2 border-jungle-green/30"
                            : "bg-warm-white border-2 border-transparent hover:border-anil-blue/10"
                        }`}
                      >
                        <div className="w-8 h-8 bg-colonial-yellow/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AccIcon className="w-4 h-4 text-colonial-yellow" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-anil-blue truncate">
                            {t(acc.nameKey)}
                          </p>
                          <p className="text-xs text-coral font-bold">
                            C$ {acc.price}/{t("reserve.day")}
                            {inCart && <span> ×{inCart.qty}</span>}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Cart summary */}
                <div className="bg-warm-white rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-anil-blue">
                      {t("reserve.cart")}
                    </span>
                    <span className="text-lg font-extrabold text-coral">
                      C$ {total}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cart.reduce((acc, c) => acc + c.qty, 0)} {lang === "es" ? "bici(s)" : "bike(s)"} +{" "}
                    {accessories.reduce((acc, a) => acc + a.qty, 0)} {t("reserve.accessories").toLowerCase()} · {t("reserve.perday")}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Date and time */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-anil-blue mb-6 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-colonial-yellow" />
                  {t("reserve.step2")}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {/* Pickup */}
                  <div>
                    <Label className="text-sm font-semibold text-anil-blue mb-2 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-colonial-yellow" />
                      {t("reserve.pickup")}
                    </Label>
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={(date) => setPickupDate(date || undefined)}
                      disabled={(date) => date < new Date()}
                      className="rounded-xl border-anil-blue/10"
                    />
                    <div className="mt-3">
                      <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                        {t("reserve.pickupTime")}
                      </Label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger className="rounded-xl">
                          <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder={t("reserve.select_time")} />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Return */}
                  <div>
                    <Label className="text-sm font-semibold text-anil-blue mb-2 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-colonial-yellow" />
                      {t("reserve.return")}
                    </Label>
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={(date) => setReturnDate(date || undefined)}
                      disabled={(date) =>
                        date < (pickupDate || new Date())
                      }
                      className="rounded-xl border-anil-blue/10"
                    />
                    <div className="mt-3">
                      <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                        {t("reserve.returnTime")}
                      </Label>
                      <Select value={returnTime} onValueChange={setReturnTime}>
                        <SelectTrigger className="rounded-xl">
                          <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder={t("reserve.select_time")} />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {pickupDate && returnDate && (
                  <div className="bg-warm-white rounded-2xl p-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">{t("reserve.duration")}</p>
                        <p className="text-lg font-bold text-anil-blue">
                          {days} {days === 1 ? t("reserve.day") : t("reserve.days")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("reserve.bikes")}</p>
                        <p className="text-lg font-bold text-anil-blue">
                          {cart.reduce((a, c) => a + c.qty, 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{t("reserve.total")}</p>
                        <p className="text-lg font-bold text-coral">C$ {total}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: User data */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-anil-blue mb-6 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-colonial-yellow" />
                  {t("reserve.step3")}
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombres" className="text-sm font-medium">
                        {t("reserve.nombres")}
                      </Label>
                      <Input
                        id="nombres"
                        maxLength={100}
                        value={formData.nombres}
                        onChange={(e) =>
                          setFormData({ ...formData, nombres: e.target.value })
                        }
                        placeholder={t("reserve.ph_nombres")}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellidos" className="text-sm font-medium">
                        {t("reserve.apellidos")}
                      </Label>
                      <Input
                        id="apellidos"
                        maxLength={100}
                        value={formData.apellidos}
                        onChange={(e) =>
                          setFormData({ ...formData, apellidos: e.target.value })
                        }
                        placeholder={t("reserve.ph_apellidos")}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="codigo" className="text-sm font-medium">
                        {t("reserve.codigo")}
                      </Label>
                      <Input
                        id="codigo"
                        maxLength={50}
                        value={formData.codigo}
                        onChange={(e) =>
                          setFormData({ ...formData, codigo: e.target.value })
                        }
                        placeholder={t("reserve.ph_codigo")}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono" className="text-sm font-medium">
                        {t("reserve.telefono")}
                      </Label>
                      <Input
                        id="telefono"
                        type="number"
                        pattern="[0-9]*"
                        value={formData.telefono}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^\d+$/.test(val)) {
                            setFormData({ ...formData, telefono: val });
                          }
                        }}
                        placeholder={t("reserve.ph_telefono")}
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        {t("reserve.genero")}
                      </Label>
                      <Select
                        value={formData.genero}
                        onValueChange={(val) =>
                          setFormData({ ...formData, genero: val })
                        }
                      >
                        <SelectTrigger className="mt-1.5 rounded-xl">
                          <SelectValue placeholder={t("reserve.select_gender")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">
                            {lang === "es" ? "Masculino" : "Male"}
                          </SelectItem>
                          <SelectItem value="Femenino">
                            {lang === "es" ? "Femenino" : "Female"}
                          </SelectItem>
                          <SelectItem value="Otro">
                            {lang === "es" ? "Otro" : "Other"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        {t("reserve.nacionalidad")}
                      </Label>
                      <Select
                        value={formData.nacionalidad}
                        onValueChange={(val) =>
                          setFormData({ ...formData, nacionalidad: val })
                        }
                      >
                        <SelectTrigger className="mt-1.5 rounded-xl">
                          <SelectValue placeholder={t("reserve.select_nationality")} />
                        </SelectTrigger>
                        <SelectContent>
                          {nationalityList.map((n) => (
                            <SelectItem key={n} value={n}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Order summary */}
                <div className="bg-warm-white rounded-2xl p-4 mt-6">
                  <h4 className="font-bold text-anil-blue text-sm mb-3">
                    {t("reserve.summary")}
                  </h4>
                  {cart.map((item) => (
                    <div
                      key={item.bikeId}
                      className="flex justify-between py-1.5 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.name} × {item.qty} × {days} {days === 1 ? t("reserve.day") : t("reserve.days")}
                      </span>
                      <span className="font-medium">
                        C$ {item.price * item.qty * days}
                      </span>
                    </div>
                  ))}
                  {accessories.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-1.5 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {t(item.nameKey)} × {item.qty} × {days} {days === 1 ? t("reserve.day") : t("reserve.days")}
                      </span>
                      <span className="font-medium">
                        C$ {item.price * item.qty * days}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-anil-blue/10 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-anil-blue">{t("reserve.total")}</span>
                      <span className="text-2xl font-extrabold text-coral">
                        C$ {total}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      {t("reserve.payment")}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex items-center justify-between">
            <Button
              onClick={() => setStep(Math.max(0, step - 1))}
              variant="ghost"
              className={step === 0 ? "invisible" : "text-muted-foreground hover:text-anil-blue"}
              disabled={step === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t("reserve.previous")}
            </Button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  step === 0 ? !canProceedStep1 : step === 1 ? false : !canProceedStep2
                }
                className="bg-anil-blue hover:bg-anil-blue-dark text-white rounded-xl px-6"
              >
                {t("reserve.next")}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-coral hover:bg-coral-dark text-white rounded-xl px-8 font-semibold"
              >
                {t("reserve.confirm")}
                <Check className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
