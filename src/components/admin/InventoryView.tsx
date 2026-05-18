"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  Wrench,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Clock,
  Zap,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminStore } from "@/stores/adminStore";
import type { BikeInventory, BikeStatus } from "@/stores/adminStore";

// ── Constants ────────────────────────────────────────────────────
type StatusFilter = "todas" | "disponible" | "alquilada" | "mantenimiento" | "retirada";
type TypeFilter = "todas" | "cruiser" | "mtb" | "urban" | "tandem" | "kids";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "disponible", label: "Disponibles" },
  { value: "alquilada", label: "Alquiladas" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "retirada", label: "Retiradas" },
];

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "todas", label: "Todos" },
  { value: "cruiser", label: "Cruiser" },
  { value: "mtb", label: "MTB" },
  { value: "urban", label: "Urban" },
  { value: "tandem", label: "Tandem" },
  { value: "kids", label: "Kids" },
];

const STATUS_COLORS: Record<BikeStatus, string> = {
  disponible: "#2D6A4F",
  alquilada: "#1B4965",
  mantenimiento: "#F2A900",
  retirada: "#94A3B8",
};

const STATUS_LABELS: Record<BikeStatus, string> = {
  disponible: "Disponible",
  alquilada: "Alquilada",
  mantenimiento: "Mantenimiento",
  retirada: "Retirada",
};

const CONDITION_COLORS: Record<string, string> = {
  excelente: "#2D6A4F",
  buena: "#1B4965",
  regular: "#F2A900",
  malo: "#E76F51",
};

const CONDITION_LABELS: Record<string, string> = {
  excelente: "Excelente",
  buena: "Buena",
  regular: "Regular",
  malo: "Malo",
};

const TYPE_LABELS: Record<string, string> = {
  cruiser: "Cruiser",
  mtb: "MTB",
  urban: "Urban",
  tandem: "Tandem",
  kids: "Kids",
};

const TYPE_COLORS: Record<string, string> = {
  cruiser: "#1B4965",
  mtb: "#2D6A4F",
  urban: "#F2A900",
  tandem: "#E76F51",
  kids: "#9333EA",
};

// ── Allowed status transitions ───────────────────────────────────
const ALLOWED_TRANSITIONS: Record<BikeStatus, BikeStatus[]> = {
  disponible: ["alquilada", "mantenimiento", "retirada"],
  alquilada: ["disponible"],
  mantenimiento: ["disponible", "retirada"],
  retirada: ["mantenimiento", "disponible"],
};

// ── Animation ────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// ── Stats Card ───────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold tabular-nums" style={{ color }}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Condition Dots ───────────────────────────────────────────────
function ConditionIndicator({ condition }: { condition: string }) {
  const levels = ["excelente", "buena", "regular", "malo"] as const;
  const currentIdx = levels.indexOf(condition as (typeof levels)[number]);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-1">
        {levels.map((level, i) => (
          <div
            key={level}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                i <= currentIdx
                  ? CONDITION_COLORS[level]
                  : "#E5DFD5",
            }}
          />
        ))}
      </div>
      <span
        className="text-[11px] font-medium"
        style={{ color: CONDITION_COLORS[condition] || "#94A3B8" }}
      >
        {CONDITION_LABELS[condition] || condition}
      </span>
    </div>
  );
}

// ── Status Badge ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: BikeStatus }) {
  return (
    <Badge
      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border-0"
      style={{
        backgroundColor: `${STATUS_COLORS[status]}18`,
        color: STATUS_COLORS[status],
      }}
    >
      {status === "disponible" && <CheckCircle className="w-3 h-3 mr-1" />}
      {status === "alquilada" && <Zap className="w-3 h-3 mr-1" />}
      {status === "mantenimiento" && <Wrench className="w-3 h-3 mr-1" />}
      {status === "retirada" && <XCircle className="w-3 h-3 mr-1" />}
      {STATUS_LABELS[status]}
    </Badge>
  );
}

// ── Bike Card ────────────────────────────────────────────────────
function BikeCard({
  bike,
  onStatusChange,
  onClick,
}: {
  bike: BikeInventory;
  onStatusChange: (bikeId: string, newStatus: BikeStatus) => void;
  onClick: () => void;
}) {
  const allowedTransitions = ALLOWED_TRANSITIONS[bike.status] || [];

  return (
    <motion.div variants={cardVariants} layout>
      <Card
        className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${TYPE_COLORS[bike.type]}15` }}
              >
                <Bike
                  className="w-4 h-4"
                  style={{ color: TYPE_COLORS[bike.type] }}
                />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold text-anil-blue truncate">
                  {bike.name}
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">
                  {bike.model} &middot; {bike.id}
                </p>
              </div>
            </div>
            <StatusBadge status={bike.status} />
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 space-y-3">
          {/* Type badge */}
          <Badge
            variant="outline"
            className="text-[10px] font-medium px-2 py-0 rounded-full"
            style={{
              borderColor: TYPE_COLORS[bike.type],
              color: TYPE_COLORS[bike.type],
            }}
          >
            {TYPE_LABELS[bike.type]}
          </Badge>

          {/* Condition */}
          <ConditionIndicator condition={bike.condition} />

          {/* Pricing */}
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Precio/hora
              </p>
              <p className="text-sm font-bold text-anil-blue">
                ${bike.pricePerHour}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Precio/día
              </p>
              <p className="text-sm font-bold text-colonial-yellow">
                ${bike.pricePerDay}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 text-center bg-muted/60 rounded-lg p-2">
            <div>
              <p className="text-sm font-bold text-anil-blue tabular-nums">
                {bike.totalRides}
              </p>
              <p className="text-[10px] text-muted-foreground">Viajes</p>
            </div>
            <div>
              <p className="text-sm font-bold text-colonial-yellow tabular-nums">
                ${bike.revenueGenerated.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">Ingresos</p>
            </div>
          </div>

          {/* Maintenance dates */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Wrench className="w-3 h-3" />
              <span>Último: {bike.lastMaintenance}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Próx: {bike.nextMaintenance}</span>
            </div>
          </div>

          {/* Status change buttons */}
          {allowedTransitions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/50">
              {allowedTransitions.map((newStatus) => (
                <Button
                  key={newStatus}
                  size="sm"
                  variant="outline"
                  className="text-[10px] h-7 px-2 rounded-full border-dashed hover:solid"
                  style={{
                    borderColor: `${STATUS_COLORS[newStatus]}60`,
                    color: STATUS_COLORS[newStatus],
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(bike.id, newStatus);
                  }}
                >
                  {STATUS_LABELS[newStatus]}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Bike Detail Dialog ───────────────────────────────────────────
function BikeDetailDialog({
  bike,
  open,
  onClose,
  onStatusChange,
}: {
  bike: BikeInventory | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (bikeId: string, newStatus: BikeStatus) => void;
}) {
  if (!bike) return null;

  const allowedTransitions = ALLOWED_TRANSITIONS[bike.status] || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-warm-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-anil-blue">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${TYPE_COLORS[bike.type]}15`,
              }}
            >
              <Bike
                className="w-5 h-5"
                style={{ color: TYPE_COLORS[bike.type] }}
              />
            </div>
            <div>
              <p className="text-lg font-bold">{bike.name}</p>
              <p className="text-sm font-normal text-muted-foreground">
                {bike.model} &middot; {bike.id}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Status & Condition */}
          <div className="flex items-center justify-between">
            <StatusBadge status={bike.status} />
            <Badge
              variant="outline"
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
              style={{
                borderColor: TYPE_COLORS[bike.type],
                color: TYPE_COLORS[bike.type],
              }}
            >
              {TYPE_LABELS[bike.type]}
            </Badge>
          </div>

          {/* Condition */}
          <div className="bg-muted/60 rounded-xl p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Condición
            </p>
            <ConditionIndicator condition={bike.condition} />
          </div>

          {/* Pricing & Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/60 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Precio/hora</p>
              <p className="text-2xl font-bold text-anil-blue">${bike.pricePerHour}</p>
            </div>
            <div className="bg-muted/60 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Precio/día</p>
              <p className="text-2xl font-bold text-colonial-yellow">
                ${bike.pricePerDay}
              </p>
            </div>
            <div className="bg-muted/60 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total viajes</p>
              <p className="text-2xl font-bold text-anil-blue tabular-nums">
                {bike.totalRides}
              </p>
            </div>
            <div className="bg-muted/60 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Ingresos generados</p>
              <p className="text-2xl font-bold text-colonial-yellow tabular-nums">
                ${bike.revenueGenerated.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Maintenance */}
          <div className="bg-muted/60 rounded-xl p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Mantenimiento
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-anil-blue">Último servicio</span>
              <span className="text-sm font-medium tabular-nums">
                {bike.lastMaintenance}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-anil-blue">Próximo servicio</span>
              <span className="text-sm font-medium tabular-nums">
                {bike.nextMaintenance}
              </span>
            </div>
          </div>

          {/* Status change */}
          {allowedTransitions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Cambiar estado
              </p>
              <div className="flex flex-wrap gap-2">
                {allowedTransitions.map((newStatus) => (
                  <Button
                    key={newStatus}
                    variant="outline"
                    className="gap-1.5 rounded-full"
                    style={{
                      borderColor: `${STATUS_COLORS[newStatus]}60`,
                      color: STATUS_COLORS[newStatus],
                    }}
                    onClick={() => {
                      onStatusChange(bike.id, newStatus);
                      onClose();
                    }}
                  >
                    {newStatus === "disponible" && (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    {newStatus === "alquilada" && (
                      <Zap className="w-3.5 h-3.5" />
                    )}
                    {newStatus === "mantenimiento" && (
                      <Wrench className="w-3.5 h-3.5" />
                    )}
                    {newStatus === "retirada" && (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    {STATUS_LABELS[newStatus]}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main InventoryView ───────────────────────────────────────────
export default function InventoryView() {
  const { inventory, updateBikeStatus } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todas");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("todas");
  const [search, setSearch] = useState("");
  const [selectedBike, setSelectedBike] = useState<BikeInventory | null>(null);

  // ── Computed stats ───────────────────────────────────────────
  const stats = useMemo(() => {
    const total = inventory.length;
    const disponibles = inventory.filter(
      (b) => b.status === "disponible"
    ).length;
    const alquiladas = inventory.filter(
      (b) => b.status === "alquilada"
    ).length;
    const mantenimiento = inventory.filter(
      (b) => b.status === "mantenimiento"
    ).length;
    return { total, disponibles, alquiladas, mantenimiento };
  }, [inventory]);

  // ── Filtered bikes ───────────────────────────────────────────
  const filteredBikes = useMemo(() => {
    return inventory.filter((bike) => {
      const matchStatus =
        statusFilter === "todas" || bike.status === statusFilter;
      const matchType =
        typeFilter === "todas" || bike.type === typeFilter;
      const matchSearch =
        search === "" ||
        bike.name.toLowerCase().includes(search.toLowerCase()) ||
        bike.model.toLowerCase().includes(search.toLowerCase()) ||
        bike.id.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [inventory, statusFilter, typeFilter, search]);

  const handleStatusChange = (bikeId: string, newStatus: BikeStatus) => {
    updateBikeStatus(bikeId, newStatus);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-anil-blue">
            Inventario de Bicicletas
          </h2>
          <Badge
            className="bg-anil-blue text-white text-xs font-semibold px-2.5 py-0.5 rounded-full"
          >
            {stats.total}
          </Badge>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, modelo o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm rounded-xl"
          />
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Total bicicletas"
          value={stats.total}
          icon={Bike}
          color="#1B4965"
          bgColor="#1B496512"
        />
        <StatCard
          label="Disponibles"
          value={stats.disponibles}
          icon={CheckCircle}
          color="#2D6A4F"
          bgColor="#2D6A4F12"
        />
        <StatCard
          label="Alquiladas"
          value={stats.alquiladas}
          icon={Zap}
          color="#1B4965"
          bgColor="#1B496512"
        />
        <StatCard
          label="En mantenimiento"
          value={stats.mantenimiento}
          icon={AlertTriangle}
          color="#F2A900"
          bgColor="#F2A90012"
        />
      </div>

      {/* ── Status Filter Tabs ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Status tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((opt) => {
            const isActive = statusFilter === opt.value;
            const color =
              opt.value === "todas"
                ? "#1B4965"
                : STATUS_COLORS[opt.value as BikeStatus] || "#94A3B8";
            return (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className="text-xs font-medium px-3.5 py-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: isActive ? `${color}18` : "transparent",
                  color: isActive ? color : "#6B7280",
                  border: isActive
                    ? `1px solid ${color}40`
                    : "1px solid transparent",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Type filter dropdown */}
        <div className="relative sm:ml-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="h-9 text-xs font-medium rounded-xl border border-input bg-white px-3 pr-8 appearance-none cursor-pointer"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label === "Todos" ? "Tipo: Todos" : `Tipo: ${opt.label}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* ── Bike Cards Grid ──────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {filteredBikes.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredBikes.map((bike) => (
              <BikeCard
                key={bike.id}
                bike={bike}
                onStatusChange={handleStatusChange}
                onClick={() => setSelectedBike(bike)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Bike className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No se encontraron bicicletas con los filtros seleccionados.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bike Detail Dialog ───────────────────────────────── */}
      <BikeDetailDialog
        bike={selectedBike}
        open={!!selectedBike}
        onClose={() => setSelectedBike(null)}
        onStatusChange={handleStatusChange}
      />
    </motion.div>
  );
}
