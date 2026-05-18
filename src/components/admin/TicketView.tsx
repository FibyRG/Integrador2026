"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket as TicketIcon,
  Plus,
  Printer,
  Eye,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bike,
  Users,
  DollarSign,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminStore,
  type Ticket,
  type PaymentMethod,
} from "@/stores/adminStore";

// ── Helpers ──────────────────────────────────────────────────────────
const fmt = (n: number) => `$${n.toFixed(2)}`;

const STATUS_BADGE: Record<
  Ticket["status"],
  { label: string; color: string; bg: string }
> = {
  activa: { label: "Activa", color: "text-anil-blue", bg: "bg-anil-blue/10" },
  devuelta: { label: "Devuelta", color: "text-jungle-green", bg: "bg-jungle-green/10" },
  pendiente: { label: "Pendiente", color: "text-colonial-yellow", bg: "bg-colonial-yellow/10" },
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

const DEFAULT_CONDITIONS = [
  "El cliente se compromete a devolver la bicicleta en las mismas condiciones en que fue entregada.",
  "La bicicleta debe ser utilizada únicamente dentro del área autorizada de la ciudad de Granada.",
  "En caso de daño, pérdida o robo, el cliente será responsable del costo de reparación o reposición.",
  "El depósito es reembolsable al devolver la bicicleta en buen estado.",
  "BiciVentura no se hace responsable por accidentes durante el uso de la bicicleta.",
  "El cliente debe usar el casco proporcionado en todo momento durante el alquiler.",
];

const BIKE_OPTIONS = [
  "Granada Cruiser",
  "Mombacho MTB",
  "Colonial Urban",
  "Tandem Amigos",
];

const ACCESSORY_OPTIONS = [
  "Casco",
  "Candado",
  "Botella de agua",
  "Farol extra",
  "Silla para niños",
  "Kit de picnic",
];

// ── Stat Card ────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-lg font-bold tabular-nums" style={{ color }}>
            {value}
          </p>
          {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Ticket Card ──────────────────────────────────────────────────────
function TicketCard({
  ticket,
  onView,
  onReturn,
}: {
  ticket: Ticket;
  onView: () => void;
  onReturn: () => void;
}) {
  const badge = STATUS_BADGE[ticket.status];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl border border-anil-blue/5 bg-white p-4 shadow-sm hover:shadow-md transition-shadow space-y-3"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
            <Badge className={`${badge.bg} ${badge.color} border-0 text-[10px] px-2 py-0.5`}>
              {badge.label}
            </Badge>
          </div>
          <h3 className="text-sm font-semibold text-anil-blue">{ticket.customerName}</h3>
          <p className="text-xs text-muted-foreground">
            {ticket.customerNationality}
            {ticket.customerPhone && ` · ${ticket.customerPhone}`}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-base font-bold text-coral">{fmt(ticket.total)}</p>
          <p className="text-[10px] text-muted-foreground">Depósito: {fmt(ticket.deposit)}</p>
        </div>
      </div>

      {/* Bike info */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-anil-blue">
          <Bike className="w-3.5 h-3.5" />
          <span className="font-medium">
            {ticket.bike}
            {ticket.bikeQty > 1 && <span className="text-muted-foreground"> x{ticket.bikeQty}</span>}
          </span>
        </div>
        {ticket.accessories.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {ticket.accessories.slice(0, 3).map((a) => (
              <span key={a} className="px-1.5 py-0.5 rounded bg-muted text-[10px]">
                {a}
              </span>
            ))}
            {ticket.accessories.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{ticket.accessories.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>
          {ticket.pickupDate} {ticket.pickupTime} → {ticket.returnDate} {ticket.returnTime}
        </span>
        <span className="ml-auto font-medium text-anil-blue">{ticket.days} día{ticket.days > 1 ? "s" : ""}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="h-8 text-xs gap-1.5 flex-1"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver
        </Button>
        {ticket.status === "activa" && (
          <Button
            size="sm"
            onClick={onReturn}
            className="h-8 text-xs gap-1.5 bg-jungle-green hover:bg-jungle-green/90 text-white flex-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Devolver
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ── Ticket Detail Dialog ─────────────────────────────────────────────
function TicketDetailDialog({
  ticket,
  open,
  onOpenChange,
}: {
  ticket: Ticket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!ticket) return null;
  const badge = STATUS_BADGE[ticket.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible" showCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-anil-blue">
            <TicketIcon className="w-5 h-5 text-colonial-yellow" />
            {ticket.id} — Contrato de Alquiler
          </DialogTitle>
          <DialogDescription>
            Detalle completo del ticket de alquiler
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4" id="ticket-printable">
          {/* Brand Header */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-anil-blue text-white">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-xl font-bold text-colonial-yellow">BV</span>
            </div>
            <div>
              <h2 className="text-lg font-bold">BiciVentura</h2>
              <p className="text-xs text-white/70">
                Alquiler de Bicicletas · Granada, Nicaragua
              </p>
            </div>
            <div className="ml-auto text-right">
              <Badge className={`${badge.bg} ${badge.color} border-0`}>
                {badge.label}
              </Badge>
            </div>
          </div>

          {/* Contract Title */}
          <div className="text-center py-2">
            <h3 className="text-lg font-bold uppercase tracking-widest text-anil-blue">
              Contrato de Alquiler
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Ticket #{ticket.id} · Creado {ticket.createdAt.split("T")[0]}
            </p>
          </div>

          {/* Customer Details */}
          <Card className="border-0 bg-muted/40">
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Datos del Cliente
              </p>
              <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-medium text-right">{ticket.customerName}</span>
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="text-right">{ticket.customerPhone}</span>
                <span className="text-muted-foreground">Email:</span>
                <span className="text-right">{ticket.customerEmail}</span>
                <span className="text-muted-foreground">Nacionalidad:</span>
                <span className="text-right">{ticket.customerNationality}</span>
                {ticket.customerPassport && (
                  <>
                    <span className="text-muted-foreground">Pasaporte:</span>
                    <span className="text-right">{ticket.customerPassport}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bike & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="border-0 bg-muted/40">
              <CardContent className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Bicicleta
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modelo:</span>
                    <span className="font-medium">{ticket.bike}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cantidad:</span>
                    <span>{ticket.bikeQty}</span>
                  </div>
                  {ticket.accessories.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">Accesorios:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {ticket.accessories.map((a) => (
                          <span key={a} className="px-1.5 py-0.5 rounded bg-anil-blue/10 text-anil-blue text-[10px]">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-muted/40">
              <CardContent className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Fechas y Horarios
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recogida:</span>
                    <span>{ticket.pickupDate} {ticket.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Devolución:</span>
                    <span>{ticket.returnDate} {ticket.returnTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span className="font-medium">{ticket.days} día{ticket.days > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pago:</span>
                    <span>{PAYMENT_LABEL[ticket.paymentMethod]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Breakdown */}
          <Card className="border-0 bg-colonial-yellow/5">
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Desglose de Precio
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio por día:</span>
                  <span>{fmt(ticket.pricePerDay)} × {ticket.days}d</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{fmt(ticket.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA:</span>
                  <span>{fmt(ticket.tax)}</span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-anil-blue">Total:</span>
                  <span className="text-colonial-yellow">{fmt(ticket.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Depósito:</span>
                  <span className="font-medium text-coral">{fmt(ticket.deposit)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card className="border-0 bg-muted/30">
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Condiciones del Alquiler
              </p>
              <ol className="space-y-1.5">
                {ticket.conditions.map((c, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="text-anil-blue font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Signature Area */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="text-center">
              <div className="border-b border-dashed border-muted-foreground/30 pb-2 mb-1">
                <p className="text-xs text-muted-foreground">Firma del Cliente</p>
              </div>
              <p className="text-[10px] text-muted-foreground">{ticket.customerName}</p>
            </div>
            <div className="text-center">
              <div className="border-b border-dashed border-muted-foreground/30 pb-2 mb-1">
                <p className="text-xs text-muted-foreground">Firma BiciVentura</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Representante autorizado</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── New Ticket Form Dialog ───────────────────────────────────────────
function NewTicketDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { createTicket, reservations } = useAdminStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNationality, setCustomerNationality] = useState("");
  const [customerPassport, setCustomerPassport] = useState("");
  const [bike, setBike] = useState("");
  const [bikeQty, setBikeQty] = useState(1);
  const [accessories, setAccessories] = useState<string[]>([]);
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [pickupTime, setPickupTime] = useState("9:00 AM");
  const [returnTime, setReturnTime] = useState("5:00 PM");
  const [pricePerDay, setPricePerDay] = useState(0);
  const [deposit, setDeposit] = useState(30);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [notes, setNotes] = useState("");

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / 86400000
    )
  );
  const subtotal = pricePerDay * bikeQty * days;
  const tax = 0;
  const total = subtotal + tax;

  const toggleAccessory = (name: string) => {
    setAccessories((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerNationality("");
    setCustomerPassport("");
    setBike("");
    setBikeQty(1);
    setAccessories([]);
    setPickupDate(new Date().toISOString().split("T")[0]);
    setReturnDate(new Date().toISOString().split("T")[0]);
    setPickupTime("9:00 AM");
    setReturnTime("5:00 PM");
    setPricePerDay(0);
    setDeposit(30);
    setPaymentMethod("efectivo");
    setNotes("");
  };

  const handleSave = () => {
    if (!customerName.trim() || !bike) return;
    // Find matching reservation or generate placeholder
    const matchingRes = reservations.find(
      (r) => r.customerName.toLowerCase() === customerName.trim().toLowerCase() && r.bike === bike
    );
    createTicket({
      reservationId: matchingRes?.id || `WALK-${Date.now().toString(36).toUpperCase()}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerNationality: customerNationality.trim(),
      customerPassport: customerPassport.trim() || undefined,
      bike,
      bikeQty,
      accessories,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      days,
      pricePerDay,
      subtotal,
      tax,
      total,
      deposit,
      paymentMethod,
      conditions: DEFAULT_CONDITIONS,
      status: "activa",
    });
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-anil-blue">
            <Plus className="w-5 h-5 text-colonial-yellow" />
            Nuevo Ticket de Alquiler
          </DialogTitle>
          <DialogDescription>
            Creá un ticket para un alquiler walk-in o asigná a una reserva existente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Customer Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Datos del cliente
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nombre *</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Teléfono</Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+505 8888-1234"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="cliente@email.com"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Nacionalidad</Label>
                <Input
                  value={customerNationality}
                  onChange={(e) => setCustomerNationality(e.target.value)}
                  placeholder="Ej: Nicaragua"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Pasaporte</Label>
                <Input
                  value={customerPassport}
                  onChange={(e) => setCustomerPassport(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>
          </div>

          {/* Bike Selection */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Bicicleta
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Modelo *</Label>
                <Select value={bike} onValueChange={setBike}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {BIKE_OPTIONS.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Cantidad</Label>
                <Input
                  type="number"
                  min={1}
                  value={bikeQty}
                  onChange={(e) => setBikeQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Precio / día ($)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={pricePerDay || ""}
                  onChange={(e) => setPricePerDay(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Accessories */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Accesorios
            </p>
            <div className="flex flex-wrap gap-2">
              {ACCESSORY_OPTIONS.map((a) => (
                <Button
                  key={a}
                  type="button"
                  variant={accessories.includes(a) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleAccessory(a)}
                  className={`text-xs h-8 rounded-lg ${
                    accessories.includes(a)
                      ? "bg-anil-blue hover:bg-anil-blue/90 text-white"
                      : ""
                  }`}
                >
                  {a}
                </Button>
              ))}
            </div>
          </div>

          {/* Dates & Times */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Fechas y Horarios
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Recogida</Label>
                <Input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hora recogida</Label>
                <Input
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  placeholder="9:00 AM"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Devolución</Label>
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hora devolución</Label>
                <Input
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  placeholder="5:00 PM"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Price Preview */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {pricePerDay > 0 ? fmt(pricePerDay) : "—"} × {bikeQty} bici × {days} día{days > 1 ? "s" : ""}
              </span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA</span>
              <span>{fmt(tax)}</span>
            </div>
            <div className="h-px bg-border my-1" />
            <div className="flex justify-between text-base font-bold">
              <span className="text-anil-blue">Total</span>
              <span className="text-colonial-yellow">{fmt(total)}</span>
            </div>
          </div>

          {/* Payment & Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Método de pago</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Depósito ($)</Label>
              <Input
                type="number"
                min={0}
                step={5}
                value={deposit}
                onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!customerName.trim() || !bike}
            className="bg-anil-blue hover:bg-anil-blue/90 text-white gap-2"
          >
            <TicketIcon className="w-4 h-4" />
            Crear Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main TicketView ──────────────────────────────────────────────────
export default function TicketView() {
  const { tickets, returnBike } = useAdminStore();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<string>("todos");
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.customerName.toLowerCase().includes(search.toLowerCase()) ||
        t.bike.toLowerCase().includes(search.toLowerCase());
      const matchTab = tab === "todos" || t.status === tab;
      return matchSearch && matchTab;
    });
  }, [tickets, search, tab]);

  const activos = tickets.filter((t) => t.status === "activa").length;
  const devueltosHoy = tickets.filter((t) => {
    if (t.status !== "devuelta") return false;
    const today = new Date().toISOString().split("T")[0];
    return t.createdAt.startsWith(today);
  }).length;
  const totalMes = tickets.reduce((s, t) => s + t.total, 0);

  const openDetail = (ticket: Ticket) => {
    setDetailTicket(ticket);
    setDetailOpen(true);
  };

  const handleReturn = (ticket: Ticket) => {
    returnBike(ticket.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-anil-blue flex items-center gap-2">
            <TicketIcon className="w-5 h-5 text-colonial-yellow" />
            Tickets de Alquiler
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Contratos y seguimiento de alquileres activos
          </p>
        </div>
        <Button
          onClick={() => setNewOpen(true)}
          className="bg-anil-blue hover:bg-anil-blue/90 text-white gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Nuevo Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={Bike}
          label="Activos"
          value={activos.toString()}
          sub="En curso ahora"
          color="#1B4965"
        />
        <StatCard
          icon={CheckCircle2}
          label="Devueltos hoy"
          value={devueltosHoy.toString()}
          sub="Completados"
          color="#2D6A4F"
        />
        <StatCard
          icon={DollarSign}
          label="Total del mes"
          value={fmt(totalMes)}
          sub={`${tickets.length} tickets`}
          color="#F2A900"
        />
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticket, cliente o bicicleta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm rounded-lg"
          />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-anil-blue/5 h-9">
            {(
              [
                ["todos", "Todos"],
                ["activa", "Activos"],
                ["devuelta", "Devueltos"],
                ["pendiente", "Pendientes"],
              ] as const
            ).map(([val, label]) => (
              <TabsTrigger
                key={val}
                value={val}
                className="text-xs data-[state=active]:bg-anil-blue data-[state=active]:text-white"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-16 text-center"
            >
              <TicketIcon className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No se encontraron tickets</p>
            </motion.div>
          ) : (
            filtered.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onView={() => openDetail(ticket)}
                onReturn={() => handleReturn(ticket)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Dialogs */}
      <TicketDetailDialog
        ticket={detailTicket}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <NewTicketDialog open={newOpen} onOpenChange={setNewOpen} />
    </motion.div>
  );
}
