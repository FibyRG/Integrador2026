"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  DollarSign,
  CalendarCheck,
  Star,
  Users,
  TrendingUp,
  Bike,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  RefreshCw,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import { useAdminStore } from "@/stores/adminStore";

// ── Chart configs ──────────────────────────────────────────────────
const revenueConfig = {
  revenue: { label: "Ingresos ($)", color: "#F2A900" },
  reservations: { label: "Reservas", color: "#E76F51" },
} satisfies ChartConfig;

const bikeConfig = {
  rentals: { label: "Alquileres", color: "#1B4965" },
  revenue: { label: "Ingresos ($)", color: "#F2A900" },
} satisfies ChartConfig;

const nationalityConfig = {
  count: { label: "Visitantes" },
  EE_UU: { label: "EE.UU.", color: "#1B4965" },
  Alemania: { label: "Alemania", color: "#2D6A4F" },
  Francia: { label: "Francia", color: "#F2A900" },
  Canada: { label: "Canadá", color: "#E76F51" },
  Argentina: { label: "Argentina", color: "#40916C" },
  Espana: { label: "España", color: "#F4845F" },
  "Reino Unido": { label: "R. Unido", color: "#1B4965" },
  Brasil: { label: "Brasil", color: "#2D6A4F" },
  Otros: { label: "Otros", color: "#94A3B8" },
} satisfies ChartConfig;

const trafficConfig = {
  visitors: { label: "Visitantes", color: "#1B4965" },
  reservations: { label: "Reservas", color: "#E76F51" },
} satisfies ChartConfig;

const NATIONALITY_COLORS = [
  "#1B4965", "#2D6A4F", "#F2A900", "#E76F51", "#40916C", "#F4845F", "#1B4965", "#2D6A4F", "#94A3B8",
];

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  confirmada: { label: "Confirmada", variant: "default" },
  en_curso: { label: "En curso", variant: "secondary" },
  completada: { label: "Completada", variant: "outline" },
  cancelada: { label: "Cancelada", variant: "destructive" },
};

// ── KPI Card ──────────────────────────────────────────────────────
function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: string;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-3xl font-extrabold tabular-nums" style={{ color }}>
              {value}
            </p>
            <div className="flex items-center gap-1.5">
              {trend && (
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-jungle-green">
                  <TrendingUp className="w-3 h-3" />
                  {trend}
                </span>
              )}
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Revenue Chart ─────────────────────────────────────────────────
function RevenueChart() {
  const { monthlyRevenue } = useAdminStore();
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-anil-blue flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-colonial-yellow" />
          Ingresos mensuales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueConfig} className="h-[280px] w-full">
          <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F2A900" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#F2A900" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFD5" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#F2A900"
              strokeWidth={2.5}
              fill="url(#fillRevenue)"
            />
            <Line
              type="monotone"
              dataKey="reservations"
              stroke="#E76F51"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: "#E76F51" }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ── Bike Popularity Chart ─────────────────────────────────────────
function BikePopularityChart() {
  const { bikeStats } = useAdminStore();
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-anil-blue flex items-center gap-2">
          <Bike className="w-4 h-4 text-jungle-green" />
          Popularidad de bicicletas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={bikeConfig} className="h-[280px] w-full">
          <BarChart data={bikeStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFD5" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="rentals" fill="#1B4965" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ── Status Donut Chart ────────────────────────────────────────────
function StatusDonutChart() {
  const { reservations } = useAdminStore();
  const statusCounts = reservations.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.entries(statusCounts).map(([key, value]) => ({
    name: STATUS_MAP[key]?.label || key,
    value,
    color:
      key === "confirmada"
        ? "#F2A900"
        : key === "en_curso"
        ? "#1B4965"
        : key === "completada"
        ? "#2D6A4F"
        : "#E76F51",
  }));

  const statusConfig = {
    value: { label: "Reservas" },
    ...Object.fromEntries(data.map((d) => [d.name, { label: d.name, color: d.color }])),
  } satisfies ChartConfig;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-anil-blue flex items-center gap-2">
          <PieChartIcon className="w-4 h-4 text-coral" />
          Estado de reservas
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ChartContainer config={statusConfig} className="h-[220px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ── Nationality Chart ─────────────────────────────────────────────
function NationalityChart() {
  const { nationalityStats } = useAdminStore();
  const data = nationalityStats.map((n, i) => ({
    ...n,
    fill: NATIONALITY_COLORS[i % NATIONALITY_COLORS.length],
  }));

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-anil-blue flex items-center gap-2">
          <Users className="w-4 h-4 text-anil-blue" />
            Nacionalidad de clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={nationalityConfig} className="h-[280px] w-full">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5DFD5" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="country" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={80} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ── Weekly Traffic Chart ───────────────────────────────────────────
function WeeklyTrafficChart() {
  const { dailyTraffic } = useAdminStore();
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-anil-blue flex items-center gap-2">
          <Activity className="w-4 h-4 text-colonial-yellow" />
          Tráfico semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={trafficConfig} className="h-[250px] w-full">
          <LineChart data={dailyTraffic} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFD5" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#1B4965"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#1B4965" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="reservations"
              stroke="#E76F51"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#E76F51" }}
              activeDot={{ r: 6 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ── Reservations Table ────────────────────────────────────────────
function ReservationsTable() {
  const { reservations } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = reservations.filter((r) => {
    const matchSearch =
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.bike.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base font-semibold text-anil-blue">
            Reservas recientes ({filtered.length})
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs w-48 rounded-lg"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 text-xs rounded-lg border border-input bg-white px-3 pr-7 appearance-none cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_curso">En curso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-anil-blue/5">
          <Table>
            <TableHeader>
              <TableRow className="bg-anil-blue/5 hover:bg-anil-blue/5">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">ID</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Cliente</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider hidden md:table-cell">Nacionalidad</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Bicicleta</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider hidden lg:table-cell">Fechas</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">Total</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 10).map((r) => {
                const status = STATUS_MAP[r.status] || { label: r.status, variant: "outline" as const };
                return (
                  <TableRow key={r.id} className="hover:bg-anil-blue/3">
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-anil-blue">{r.customerName}</p>
                        <p className="text-[11px] text-muted-foreground hidden sm:block">{r.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{r.nationality}</TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-anil-blue">{r.bike}</span>
                      {r.bikeQty > 1 && <span className="text-[10px] text-muted-foreground ml-1">x{r.bikeQty}</span>}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {r.pickupDate} → {r.returnDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-bold text-coral">${r.total}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={status.variant} className="text-[10px] px-2 py-0.5">
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Login Gate ─────────────────────────────────────────────────────
function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm mx-auto text-center"
    >
      <div className="w-16 h-16 bg-anil-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Lock className="w-8 h-8 text-anil-blue" />
      </div>
      <h2 className="text-2xl font-bold text-anil-blue mb-2">Panel de Administración</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Ingresá la contraseña para acceder al dashboard.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`h-12 rounded-xl text-center text-lg tracking-widest ${
              error ? "border-coral ring-1 ring-coral/30" : ""
            }`}
            autoFocus
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-coral text-xs font-medium"
          >
            Contraseña incorrecta. Intentá de nuevo.
          </motion.p>
        )}
        <Button
          type="submit"
          className="w-full h-12 bg-anil-blue hover:bg-anil-blue-dark text-white rounded-xl font-semibold"
        >
          Ingresar
        </Button>
        <p className="text-[10px] text-muted-foreground/50 mt-4">
          Demo: contraseña = admin
        </p>
      </form>
    </motion.div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────
export default function AdminPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const { refreshData, totalRevenue, totalReservations, activeReservations, avgRating, completionRate } =
    useAdminStore();

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="admin-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        key="admin-panel"
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 right-0 z-[201] w-full max-w-[95vw] lg:max-w-[90vw] xl:max-w-[1200px] bg-warm-white overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-anil-blue text-white">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5" />
            <h1 className="text-lg font-bold">Dashboard — BiciVentura</h1>
          </div>
          <div className="flex items-center gap-2">
            {authenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Actualizar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!authenticated ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoginGate onLogin={() => setAuthenticated(true)} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <KPICard
                  title="Ingresos totales"
                  value={`$${totalRevenue.toLocaleString()}`}
                  subtitle="Este periodo"
                  icon={DollarSign}
                  trend="+18%"
                  color="#F2A900"
                />
                <KPICard
                  title="Reservas totales"
                  value={totalReservations.toString()}
                  subtitle="Acumuladas"
                  icon={CalendarCheck}
                  trend="+12%"
                  color="#1B4965"
                />
                <KPICard
                  title="Reservas activas"
                  value={activeReservations.toString()}
                  subtitle="Ahora mismo"
                  icon={Activity}
                  color="#E76F51"
                />
                <KPICard
                  title="Calificación"
                  value={avgRating.toString()}
                  subtitle="Promedio Google"
                  icon={Star}
                  color="#2D6A4F"
                />
                <KPICard
                  title="Tasa de éxito"
                  value={`${completionRate}%`}
                  subtitle="Completadas"
                  icon={TrendingUp}
                  trend="+5%"
                  color="#40916C"
                />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <RevenueChart />
                </div>
                <StatusDonutChart />
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <BikePopularityChart />
                <NationalityChart />
              </div>

              {/* Tabs: Traffic + Table */}
              <Tabs defaultValue="traffic" className="space-y-4">
                <TabsList className="bg-anil-blue/5">
                  <TabsTrigger value="traffic" className="data-[state=active]:bg-anil-blue data-[state=active]:text-white text-sm">
                    Tráfico semanal
                  </TabsTrigger>
                  <TabsTrigger value="reservations" className="data-[state=active]:bg-anil-blue data-[state=active]:text-white text-sm">
                    Todas las reservas
                  </TabsTrigger>
                  <TabsTrigger value="revenue-bike" className="data-[state=active]:bg-anil-blue data-[state=active]:text-white text-sm">
                    Ingresos por bici
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="traffic">
                  <WeeklyTrafficChart />
                </TabsContent>

                <TabsContent value="reservations">
                  <ReservationsTable />
                </TabsContent>

                <TabsContent value="revenue-bike">
                  <RevenueByBikeChart />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Revenue by Bike (tab content) ──────────────────────────────────
function RevenueByBikeChart() {
  const { bikeStats } = useAdminStore();
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-anil-blue flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-colonial-yellow" />
          Ingresos por modelo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={bikeConfig} className="h-[300px] w-full">
          <BarChart data={bikeStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5DFD5" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={55}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="#F2A900" radius={[6, 6, 0, 0]} barSize={50} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
