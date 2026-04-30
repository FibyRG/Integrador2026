"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
  name: string;
  price: number;
  icon: LucideIcon;
  qty: number;
}

const timeSlots = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

const nationalities = [
  "Nicaragüense", "Costarricense", "Estadounidense", "Canadiense",
  "Español", "Argentino", "Mexicano", "Colombiano", "Alemán", "Francés",
  "Británico", "Italiano", "Holandés", "Brasileño", "Otro",
];

const steps = [
  { icon: Bike, label: "Elegí tus ruedas" },
  { icon: CalendarDays, label: "Fecha y hora" },
  { icon: UserCheck, label: "Tus datos" },
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

  // Step 3 state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    notes: "",
  });

  const allAccessories: { id: string; name: string; price: number; icon: LucideIcon }[] = [
    { id: "casco", name: "Casco de seguridad", price: 2, icon: HardHat },
    { id: "candado", name: "Candado U-Lock", price: 1, icon: Lock },
    { id: "silla", name: "Silla para niños", price: 5, icon: Baby },
    { id: "picnic", name: "Kit de picnic", price: 8, icon: UtensilsCrossed },
    { id: "botella", name: "Botella de agua", price: 1, icon: Droplets },
    { id: "farol", name: "Farol extra", price: 1, icon: Flashlight },
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
  const canSubmit = formData.name && formData.email && formData.phone;

  const handleSubmit = () => {
    setCompleted(true);
  };

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
              Reserva recibida
            </h2>
          </div>
          <p className="text-muted-foreground mb-2">
            Gracias, <span className="font-semibold text-anil-blue">{formData.name}</span>! Hemos recibido tu solicitud de reserva.
          </p>
          <p className="text-muted-foreground mb-6">
            Te enviaremos un email de confirmación a{" "}
            <span className="font-semibold text-anil-blue">{formData.email}</span>{" "}
            con todos los detalles y un código QR para tu recogida.
          </p>

          <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 text-left">
            <h3 className="font-bold text-anil-blue mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-colonial-yellow" />
              Resumen de tu reserva
            </h3>
            {cart.map((item) => (
              <div key={item.bikeId} className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.qty}
                </span>
                <span className="font-semibold text-anil-blue">
                  ${item.price * item.qty * days}
                </span>
              </div>
            ))}
            {accessories.map((item) => (
              <div key={item.id} className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">
                  {item.name} × {item.qty}
                </span>
                <span className="font-semibold text-anil-blue">
                  ${item.price * item.qty * days}
                </span>
              </div>
            ))}
            <div className="border-t border-anil-blue/10 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-bold text-anil-blue">Total estimado</span>
                <span className="text-xl font-extrabold text-coral">${total}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Pago en persona al momento de la recogida
              </p>
            </div>
          </div>

          <div className="bg-colonial-yellow/10 rounded-2xl p-4 mb-8">
            <p className="text-sm text-anil-blue flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-coral" />
              <span className="font-medium">Punto de encuentro:</span> Frente a la Catedral, Calle La Calzada
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
              setFormData({ name: "", email: "", phone: "", nationality: "", notes: "" });
            }}
            className="bg-anil-blue hover:bg-anil-blue-dark text-white rounded-2xl px-8"
          >
            Hacer otra reserva
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
            Reservar
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Reservá tu{" "}
            <span className="text-colonial-yellow">aventura</span>
          </h2>
          <p className="text-warm-white/70 max-w-xl mx-auto">
            Completá los 3 pasos y recibí tu confirmación por email.
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
                    {s.label}
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
                  Paso 1: Elegí tus ruedas
                </h3>

                {/* Available bikes */}
                <div className="space-y-3 mb-6">
                  {[
                    { id: "granada-cruiser", name: "Granada Cruiser", price: 25, image: "/images/bikes/granada-cruiser.jpg" },
                    { id: "mombacho-mtb", name: "Mombacho MTB", price: 40, image: "/images/bikes/mombacho-mtb.jpg" },
                    { id: "colonial-urban", name: "Colonial Urban", price: 20, image: "/images/bikes/colonial-urban.jpg" },
                    { id: "tandem-amigos", name: "Tandem Amigos", price: 50, image: "/images/bikes/tandem-amigos.jpg" },
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
                            ${bike.price}/día
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

                {/* Accessories */}
                <h4 className="text-sm font-bold text-anil-blue mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-jungle-green" />
                  Complementos
                </h4>
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
                            {acc.name}
                          </p>
                          <p className="text-xs text-coral font-bold">
                            ${acc.price}/día
                            {inCart && <span> ×{inCart.qty}</span>}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Cart summary */}
                {cart.length > 0 && (
                  <div className="bg-warm-white rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-anil-blue">
                        Carrito
                      </span>
                      <span className="text-lg font-extrabold text-coral">
                        ${total}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cart.reduce((acc, c) => acc + c.qty, 0)} bici(s) +
                      {accessories.reduce((acc, a) => acc + a.qty, 0)} complemento(s) · Precio por 1 día
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Date and time */}
            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-anil-blue mb-6 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-colonial-yellow" />
                  Paso 2: Fecha y hora
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {/* Pickup */}
                  <div>
                    <Label className="text-sm font-semibold text-anil-blue mb-2 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-colonial-yellow" />
                      Fecha de recogida
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
                        Hora de recogida
                      </Label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger className="rounded-xl">
                          <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Seleccionar hora" />
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
                      Fecha de devolución
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
                        Hora de devolución
                      </Label>
                      <Select value={returnTime} onValueChange={setReturnTime}>
                        <SelectTrigger className="rounded-xl">
                          <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue placeholder="Seleccionar hora" />
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
                        <p className="text-xs text-muted-foreground">Duración</p>
                        <p className="text-lg font-bold text-anil-blue">
                          {days} {days === 1 ? "día" : "días"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bicicletas</p>
                        <p className="text-lg font-bold text-anil-blue">
                          {cart.reduce((a, c) => a + c.qty, 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold text-coral">${total}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: User data */}
            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-anil-blue mb-6 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-colonial-yellow" />
                  Paso 3: Tus datos
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nombre completo *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Tu nombre"
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="tu@email.com"
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Teléfono / WhatsApp *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+505 1234 5678"
                        className="mt-1.5 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Nacionalidad</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(val) =>
                        setFormData({ ...formData, nationality: val })
                      }
                    >
                      <SelectTrigger className="mt-1.5 rounded-xl">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {nationalities.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Notas especiales
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="¿Algo que debamos saber? (alergias, necesidades especiales, preferencias de ruta...)"
                      className="mt-1.5 rounded-xl min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Order summary */}
                <div className="bg-warm-white rounded-2xl p-4 mt-6">
                  <h4 className="font-bold text-anil-blue text-sm mb-3">
                    Resumen del pedido
                  </h4>
                  {cart.map((item) => (
                    <div
                      key={item.bikeId}
                      className="flex justify-between py-1.5 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.name} × {item.qty} × {days}d
                      </span>
                      <span className="font-medium">
                        ${item.price * item.qty * days}
                      </span>
                    </div>
                  ))}
                  {accessories.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-1.5 text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.name} × {item.qty} × {days}d
                      </span>
                      <span className="font-medium">
                        ${item.price * item.qty * days}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-anil-blue/10 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-anil-blue">Total</span>
                      <span className="text-2xl font-extrabold text-coral">
                        ${total}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Pago en persona al momento de la recogida
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
              Anterior
            </Button>

            {step < 2 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  step === 0 ? !canProceedStep1 : !canProceedStep2
                }
                className="bg-anil-blue hover:bg-anil-blue-dark text-white rounded-xl px-6"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="bg-coral hover:bg-coral-dark text-white rounded-xl px-8 font-semibold"
              >
                Confirmar reserva
                <Check className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
