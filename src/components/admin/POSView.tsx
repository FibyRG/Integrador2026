"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Bike,
  Package,
  Map,
  Banknote,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminStore, type PaymentMethod, type POSProduct } from "@/stores/adminStore";

// ── Constants ──────────────────────────────────────────────────────
const CATEGORY_TABS = [
  { key: "todos", label: "Todos", icon: ShoppingCart },
  { key: "bicicleta", label: "Bicicletas", icon: Bike },
  { key: "accesorio", label: "Accesorios", icon: Package },
  { key: "servicio", label: "Servicios", icon: Map },
] as const;

type CategoryFilter = "todos" | "bicicleta" | "accesorio" | "servicio";

const CATEGORY_STYLES: Record<string, { bg: string; border: string; badge: string; accent: string }> = {
  bicicleta: {
    bg: "bg-anil-blue/5",
    border: "border-anil-blue/15",
    badge: "bg-anil-blue text-white",
    accent: "text-anil-blue",
  },
  accesorio: {
    bg: "bg-jungle-green/5",
    border: "border-jungle-green/15",
    badge: "bg-jungle-green text-white",
    accent: "text-jungle-green",
  },
  servicio: {
    bg: "bg-coral/5",
    border: "border-coral/15",
    badge: "bg-coral text-white",
    accent: "text-coral",
  },
};

const UNIT_LABELS: Record<string, string> = {
  hora: "hr",
  dia: "día",
  unidad: "u",
  persona: "pers",
};

const PAYMENT_METHODS: {
  key: PaymentMethod;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "efectivo", label: "Efectivo", icon: Banknote },
  { key: "tarjeta", label: "Tarjeta", icon: CreditCard },
  { key: "transferencia", label: "Transferencia", icon: Building2 },
];

const CATEGORY_LABELS: Record<string, string> = {
  bicicleta: "Bici",
  accesorio: "Acc",
  servicio: "Serv",
};

// ── Animation variants ─────────────────────────────────────────────
const cartItemVariants = {
  initial: { opacity: 0, x: 20, height: 0, marginBottom: 0 },
  animate: { opacity: 1, x: 0, height: "auto", marginBottom: 8, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, x: -20, height: 0, marginBottom: 0, transition: { duration: 0.2 } },
};

const productCardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
};

const successOverlayVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { type: "spring", damping: 20, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

// ── Helper: format time ────────────────────────────────────────────
function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-NI", { hour: "2-digit", minute: "2-digit" });
}

// ── Product Card ───────────────────────────────────────────────────
function ProductCard({ product, onAdd }: { product: POSProduct; onAdd: () => void }) {
  const style = CATEGORY_STYLES[product.category] || CATEGORY_STYLES.bicicleta;
  const unitLabel = UNIT_LABELS[product.unit] || product.unit;

  return (
    <motion.div variants={productCardVariants} initial="initial" animate="animate" layout>
      <Card className={`${style.bg} ${style.border} border hover:shadow-md transition-all duration-200 group cursor-pointer h-full`}>
        <CardContent className="p-3 sm:p-4 flex flex-col justify-between h-full gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-anil-blue leading-tight truncate">{product.name}</p>
              <Badge className={`${style.badge} text-[10px] mt-1.5 px-1.5 py-0`}>
                {CATEGORY_LABELS[product.category]}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className={`text-lg font-bold ${style.accent} tabular-nums`}>
              ${product.price}<span className="text-xs font-normal text-muted-foreground">/{unitLabel}</span>
            </p>
            <Button
              size="sm"
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className={`${style.badge} h-8 w-8 p-0 rounded-full hover:opacity-90 transition-all active:scale-90 shadow-sm`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Cart Item ──────────────────────────────────────────────────────
function CartItemRow({
  item,
  onQtyChange,
  onRemove,
}: {
  item: ReturnType<typeof useAdminStore.getState>["posCart"][number];
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  const style = CATEGORY_STYLES[item.product.category] || CATEGORY_STYLES.bicicleta;
  const unitLabel = UNIT_LABELS[item.product.unit] || item.product.unit;

  return (
    <motion.div
      variants={cartItemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className="bg-white rounded-xl border border-anil-blue/8 p-3 shadow-sm"
    >
      <div className="flex items-start gap-3">
        {/* Color indicator */}
        <div className={`w-1 self-stretch rounded-full ${item.product.category === "bicicleta" ? "bg-anil-blue" : item.product.category === "accesorio" ? "bg-jungle-green" : "bg-coral"} flex-shrink-0`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-anil-blue leading-tight truncate">{item.product.name}</p>
            <button
              onClick={onRemove}
              className="text-muted-foreground hover:text-coral transition-colors p-0.5 rounded hover:bg-coral/5 flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            ${item.product.price}/{unitLabel}
          </p>

          {/* Qty controls + subtotal */}
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-0.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQtyChange(item.qty - 1)}
                className="h-7 w-7 p-0 rounded-lg border-anil-blue/15 hover:bg-anil-blue/5"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-9 text-center text-sm font-bold text-anil-blue tabular-nums">{item.qty}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQtyChange(item.qty + 1)}
                className="h-7 w-7 p-0 rounded-lg border-anil-blue/15 hover:bg-anil-blue/5"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-base font-bold text-anil-blue tabular-nums">${item.subtotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Recent Transactions ────────────────────────────────────────────
function RecentTransactions() {
  const { posTransactions } = useAdminStore();
  const [expanded, setExpanded] = useState(false);
  const recent = expanded ? posTransactions.slice(0, 10) : posTransactions.slice(0, 3);

  if (posTransactions.length === 0) return null;

  return (
    <div className="mt-4 border-t border-anil-blue/10 pt-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-anil-blue transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Receipt className="w-3.5 h-3.5" />
          Transacciones recientes ({posTransactions.length})
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      <div className="mt-2.5 space-y-1.5 max-h-60 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {recent.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2 border border-anil-blue/5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle className="w-3.5 h-3.5 text-jungle-green flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-anil-blue truncate">{tx.customerName || "Cliente"}</p>
                  <p className="text-[10px] text-muted-foreground">{formatTime(tx.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-anil-blue/15 text-muted-foreground">
                  {tx.paymentMethod === "efectivo" ? "Efectivo" : tx.paymentMethod === "tarjeta" ? "Tarjeta" : "Transfer."}
                </Badge>
                <span className="text-xs font-bold text-anil-blue tabular-nums">${tx.total.toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Success Notification ───────────────────────────────────────────
function SuccessNotification({ txId, onClose }: { txId: string; onClose: () => void }) {
  return (
    <motion.div
      variants={successOverlayVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 15, stiffness: 200 }}
        className="w-20 h-20 bg-jungle-green/10 rounded-full flex items-center justify-center mb-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", damping: 15 }}
        >
          <CheckCircle className="w-10 h-10 text-jungle-green" />
        </motion.div>
      </motion.div>
      <h3 className="text-xl font-bold text-anil-blue mb-1">¡Cobro exitoso!</h3>
      <p className="text-sm text-muted-foreground mb-1">Transacción {txId}</p>
      <p className="text-xs text-muted-foreground mb-6">Se ha registrado correctamente</p>
      <Button
        onClick={onClose}
        className="bg-jungle-green hover:bg-jungle-green/90 text-white rounded-xl px-8 h-11 font-semibold shadow-sm"
      >
        Continuar
      </Button>
    </motion.div>
  );
}

// ── Main POS View ──────────────────────────────────────────────────
export default function POSView() {
  const {
    posProducts,
    posCart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    completePOSTransaction,
  } = useAdminStore();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("todos");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo");
  const [lastTxId, setLastTxId] = useState<string | null>(null);

  // Derived state
  const filteredProducts =
    categoryFilter === "todos"
      ? posProducts
      : posProducts.filter((p) => p.category === categoryFilter);

  const cartTotal = posCart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartItemCount = posCart.reduce((sum, item) => sum + item.qty, 0);

  // Handlers
  const handleAddToCart = (product: POSProduct) => {
    addToCart(product);
  };

  const handleCharge = () => {
    if (posCart.length === 0) return;
    const txId = completePOSTransaction(customerName, customerPhone, paymentMethod);
    setLastTxId(txId);
    setCustomerName("");
    setCustomerPhone("");
  };

  const handleCloseSuccess = () => {
    setLastTxId(null);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 sm:gap-5">
      {/* ── Left Column: Product Catalog ──────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = categoryFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setCategoryFilter(tab.key)}
                className={`
                  flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap
                  transition-all duration-200 flex-shrink-0
                  ${isActive
                    ? "bg-anil-blue text-white shadow-md shadow-anil-blue/20"
                    : "bg-white text-muted-foreground border border-anil-blue/10 hover:border-anil-blue/25 hover:text-anil-blue"
                  }
                `}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {tab.label}
                {tab.key !== "todos" && (
                  <span className={`text-[10px] ml-0.5 tabular-nums ${isActive ? "text-white/70" : "text-muted-foreground/60"}`}>
                    {posProducts.filter((p) => p.category === tab.key).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => handleAddToCart(product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Package className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">Sin productos en esta categoría</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Column: Cart + Payment ──────────────────────────── */}
      <div className="w-full lg:w-[380px] xl:w-[400px] flex-shrink-0 flex flex-col relative">
        <Card className="flex-1 flex flex-col border-0 shadow-sm overflow-hidden relative">
          {/* Cart Header */}
          <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-anil-blue flex items-center gap-2">
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </div>
                Carrito
              </CardTitle>
              {posCart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-coral hover:bg-coral/5 h-7 px-2"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Vaciar
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col px-4 sm:px-5 pb-4 sm:pb-5 gap-4 min-h-0">
            {/* Cart Items */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
              <AnimatePresence mode="popLayout">
                {posCart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-10 text-muted-foreground"
                  >
                    <div className="w-14 h-14 bg-anil-blue/5 rounded-2xl flex items-center justify-center mb-3">
                      <Bike className="w-7 h-7 text-anil-blue/30" />
                    </div>
                    <p className="text-sm font-medium">Carrito vacío</p>
                    <p className="text-xs mt-1 opacity-60">Agregá productos desde el catálogo</p>
                  </motion.div>
                ) : (
                  <div className="space-y-0">
                    {posCart.map((item) => (
                      <CartItemRow
                        key={item.product.id}
                        item={item}
                        onQtyChange={(qty) => updateCartQty(item.product.id, qty)}
                        onRemove={() => removeFromCart(item.product.id)}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Customer Info */}
            {posCart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <User className="w-3 h-3" />
                  Datos del cliente
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                    <Input
                      placeholder="Nombre"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="h-9 pl-8 text-xs rounded-lg border-anil-blue/10"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                    <Input
                      placeholder="Teléfono"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="h-9 pl-8 text-xs rounded-lg border-anil-blue/10"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Payment Method */}
            {posCart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Banknote className="w-3 h-3" />
                  Método de pago
                </div>
                <div className="flex gap-2">
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = paymentMethod === pm.key;
                    return (
                      <button
                        key={pm.key}
                        onClick={() => setPaymentMethod(pm.key)}
                        className={`
                          flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-medium
                          transition-all duration-200 active:scale-95
                          ${isSelected
                            ? "bg-anil-blue text-white border-anil-blue shadow-md shadow-anil-blue/20"
                            : "bg-white text-muted-foreground border-anil-blue/10 hover:border-anil-blue/25 hover:text-anil-blue"
                          }
                        `}
                      >
                        <pm.icon className="w-4 h-4" />
                        {pm.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Total + Charge Button */}
            {posCart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="space-y-3 pt-1"
              >
                {/* Total */}
                <div className="flex items-end justify-between">
                  <span className="text-sm text-muted-foreground font-medium">Total</span>
                  <span className="text-3xl font-extrabold text-anil-blue tabular-nums">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 -mt-1.5">
                  {cartItemCount} {cartItemCount === 1 ? "artículo" : "artículos"} en el carrito
                </p>

                {/* Charge Button */}
                <Button
                  onClick={handleCharge}
                  className="w-full h-12 bg-coral hover:bg-coral-dark text-white rounded-xl font-bold text-base shadow-md shadow-coral/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Banknote className="w-5 h-5" />
                  Cobrar ${cartTotal.toFixed(2)}
                </Button>
              </motion.div>
            )}

            {/* Recent Transactions */}
            <RecentTransactions />
          </CardContent>

          {/* Success Overlay */}
          <AnimatePresence>
            {lastTxId && (
              <SuccessNotification txId={lastTxId} onClose={handleCloseSuccess} />
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
