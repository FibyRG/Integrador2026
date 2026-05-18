"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Printer,
  Eye,
  Search,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminStore, type Invoice, type PaymentMethod, type InvoiceStatus } from "@/stores/adminStore";

// ── Helpers ──────────────────────────────────────────────────────────
const fmt = (n: number) => `$${n.toFixed(2)}`;

const STATUS_BADGE: Record<InvoiceStatus, { label: string; color: string; bg: string }> = {
  pagada: { label: "Pagada", color: "text-jungle-green", bg: "bg-jungle-green/10" },
  pendiente: { label: "Pendiente", color: "text-colonial-yellow", bg: "bg-colonial-yellow/10" },
  vencida: { label: "Vencida", color: "text-coral", bg: "bg-coral/10" },
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

// ── Empty Invoice Item ───────────────────────────────────────────────
function emptyItem() {
  return { description: "", qty: 1, unitPrice: 0, subtotal: 0 };
}

// ── Stats Card ───────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
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
        </div>
      </CardContent>
    </Card>
  );
}

// ── Invoice Detail Dialog ────────────────────────────────────────────
function InvoiceDetailDialog({
  invoice,
  open,
  onOpenChange,
}: {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible" showCloseButton>
        {/* Print-only header */}
        <div className="print:block hidden text-center mb-4">
          <h1 className="text-2xl font-bold text-anil-blue">BiciVentura</h1>
          <p className="text-sm text-muted-foreground">Granada, Nicaragua</p>
        </div>

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-anil-blue">
            <FileText className="w-5 h-5 text-colonial-yellow" />
            {invoice.invoiceNumber}
          </DialogTitle>
          <DialogDescription>
            Detalle completo de la factura
          </DialogDescription>
        </DialogHeader>

        {/* Invoice Body */}
        <div className="space-y-4" id="invoice-printable">
          {/* Brand Header */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-anil-blue/5 border border-anil-blue/10">
            <div className="w-12 h-12 rounded-xl bg-anil-blue flex items-center justify-center">
              <span className="text-xl font-bold text-colonial-yellow">BV</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-anil-blue">BiciVentura</h2>
              <p className="text-xs text-muted-foreground">
                Alquiler de Bicicletas · Granada, Nicaragua
              </p>
            </div>
            <div className="ml-auto text-right">
              <Badge className={STATUS_BADGE[invoice.status].bg + " " + STATUS_BADGE[invoice.status].color + " border-0"}>
                {STATUS_BADGE[invoice.status].label}
              </Badge>
              <p className="text-[10px] text-muted-foreground mt-1">{invoice.createdAt.split("T")[0]}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-0 bg-muted/40">
              <CardContent className="p-3 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Cliente</p>
                <p className="text-sm font-medium">{invoice.customerName}</p>
                <p className="text-xs text-muted-foreground">{invoice.customerPhone}</p>
                {invoice.customerEmail && (
                  <p className="text-xs text-muted-foreground">{invoice.customerEmail}</p>
                )}
                {invoice.customerTaxId && (
                  <p className="text-xs text-muted-foreground">RUC/CI: {invoice.customerTaxId}</p>
                )}
              </CardContent>
            </Card>
            <Card className="border-0 bg-muted/40">
              <CardContent className="p-3 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Factura</p>
                <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground">Emisión: {invoice.createdAt.split("T")[0]}</p>
                <p className="text-xs text-muted-foreground">Vencimiento: {invoice.dueDate}</p>
                <p className="text-xs text-muted-foreground">Pago: {PAYMENT_LABEL[invoice.paymentMethod]}</p>
              </CardContent>
            </Card>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto rounded-xl border border-anil-blue/5">
            <Table>
              <TableHeader>
                <TableRow className="bg-anil-blue/5 hover:bg-anil-blue/5">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Descripción</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Cant.</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Precio</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm">{item.description}</TableCell>
                    <TableCell className="text-sm text-center">{item.qty}</TableCell>
                    <TableCell className="text-sm text-right">{fmt(item.unitPrice)}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{fmt(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{fmt(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA ({invoice.taxRate}%)</span>
                <span>{fmt(invoice.tax)}</span>
              </div>
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between text-base font-bold">
                <span className="text-anil-blue">Total</span>
                <span className="text-colonial-yellow">{fmt(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <Card className="border-0 bg-colonial-yellow/5">
              <CardContent className="p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Notas
                </p>
                <p className="text-sm">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
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

// ── New Invoice Form Dialog ──────────────────────────────────────────
function NewInvoiceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { createInvoice } = useAdminStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerTaxId, setCustomerTaxId] = useState("");
  const [items, setItems] = useState([emptyItem()]);
  const [taxRate, setTaxRate] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [status, setStatus] = useState<InvoiceStatus>("pendiente");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  const recalc = (newItems: typeof items) =>
    newItems.map((it) => ({ ...it, subtotal: it.qty * it.unitPrice }));

  const subtotal = items.reduce((s, it) => s + it.subtotal, 0);
  const tax = subtotal * (parseFloat(taxRate) / 100);
  const total = subtotal + tax;

  const updateItem = (index: number, field: string, value: string | number) => {
    const updated = items.map((it, i) => {
      if (i !== index) return it;
      const next = { ...it, [field]: value };
      next.subtotal = next.qty * next.unitPrice;
      return next;
    });
    setItems(updated);
  };

  const addItem = () => setItems([...recalc(items), emptyItem()]);
  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(recalc(items.filter((_, i) => i !== index)));
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerTaxId("");
    setItems([emptyItem()]);
    setTaxRate("0");
    setPaymentMethod("efectivo");
    setStatus("pendiente");
    setDueDate(new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]);
    setNotes("");
  };

  const handleSave = () => {
    if (!customerName.trim() || items.every((it) => !it.description.trim())) return;
    createInvoice({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerTaxId: customerTaxId.trim() || undefined,
      items: recalc(items).filter((it) => it.description.trim()),
      subtotal,
      tax,
      taxRate: parseFloat(taxRate),
      total,
      paymentMethod,
      status,
      dueDate,
      notes: notes.trim() || undefined,
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
            Nueva Factura
          </DialogTitle>
          <DialogDescription>Completá los datos para emitir una nueva factura.</DialogDescription>
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
                <Label className="text-xs">RUC / Cédula</Label>
                <Input
                  value={customerTaxId}
                  onChange={(e) => setCustomerTaxId(e.target.value)}
                  placeholder="Opcional"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Conceptos
              </p>
              <Button variant="ghost" size="sm" onClick={addItem} className="h-7 text-xs gap-1">
                <Plus className="w-3 h-3" /> Agregar
              </Button>
            </div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_60px_80px] gap-2">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="Descripción"
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateItem(idx, "qty", Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-sm text-center"
                    />
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.unitPrice || ""}
                      onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                      placeholder="Precio"
                      className="text-sm text-right"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <span className="text-xs font-medium text-muted-foreground w-16 text-right">
                      {fmt(item.subtotal)}
                    </span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-muted-foreground hover:text-coral transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Preview */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">IVA (%)</span>
              <Input
                type="number"
                min={0}
                max={100}
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-20 h-7 text-xs text-right"
              />
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

          {/* Payment & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <Label className="text-xs">Estado</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as InvoiceStatus)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pagada">Pagada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="vencida">Vencida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Fecha de vencimiento</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <Label className="text-xs">Notas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas opcionales..."
              className="min-h-[60px] text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!customerName.trim() || items.every((it) => !it.description.trim())}
            className="bg-anil-blue hover:bg-anil-blue/90 text-white gap-2"
          >
            <Receipt className="w-4 h-4" />
            Emitir Factura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main InvoiceView ─────────────────────────────────────────────────
export default function InvoiceView() {
  const { invoices } = useAdminStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  const totalFacturado = invoices.reduce((s, i) => s + i.total, 0);
  const pagadas = invoices.filter((i) => i.status === "pagada");
  const pendientes = invoices.filter((i) => i.status === "pendiente" || i.status === "vencida");

  const openDetail = (inv: Invoice) => {
    setDetailInvoice(inv);
    setDetailOpen(true);
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
            <Receipt className="w-5 h-5 text-colonial-yellow" />
            Facturación
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestión de facturas y comprobantes de pago
          </p>
        </div>
        <Button
          onClick={() => setNewOpen(true)}
          className="bg-anil-blue hover:bg-anil-blue/90 text-white gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Nueva Factura
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={DollarSign}
          label="Total facturado"
          value={fmt(totalFacturado)}
          color="#F2A900"
        />
        <StatCard
          icon={CheckCircle2}
          label="Facturas pagadas"
          value={`${pagadas.length}`}
          color="#2D6A4F"
        />
        <StatCard
          icon={Clock}
          label="Facturas pendientes"
          value={`${pendientes.length}`}
          color="#E76F51"
        />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm rounded-lg"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pagada", "pendiente", "vencida"] as const).map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
              className={`text-xs h-9 rounded-lg ${
                statusFilter === s
                  ? "bg-anil-blue hover:bg-anil-blue/90 text-white"
                  : ""
              }`}
            >
              {s === "all" ? "Todos" : STATUS_BADGE[s]?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="max-h-[480px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center"
                >
                  <FileText className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">No se encontraron facturas</p>
                </motion.div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-anil-blue/5 hover:bg-anil-blue/5">
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Factura</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Cliente</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider hidden md:table-cell">Fecha</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider hidden sm:table-cell">Pago</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Total</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Estado</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((inv) => {
                      const badge = STATUS_BADGE[inv.status];
                      return (
                        <motion.tr
                          key={inv.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="border-b last:border-0 hover:bg-anil-blue/3 transition-colors"
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {inv.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium text-anil-blue">{inv.customerName}</p>
                              <p className="text-[11px] text-muted-foreground hidden sm:block">{inv.customerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                            {inv.createdAt.split("T")[0]}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-xs">
                            {PAYMENT_LABEL[inv.paymentMethod]}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm font-bold text-coral">{fmt(inv.total)}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${badge.bg} ${badge.color} border-0 text-[10px] px-2 py-0.5`}>
                              {badge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDetail(inv)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-anil-blue"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setDetailInvoice(inv); setDetailOpen(true); }}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-anil-blue"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <InvoiceDetailDialog
        invoice={detailInvoice}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <NewInvoiceDialog open={newOpen} onOpenChange={setNewOpen} />
    </motion.div>
  );
}
