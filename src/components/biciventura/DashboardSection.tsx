"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { BarChart3, Users, Clock, Percent, AlertCircle, RefreshCw, CalendarDays, Share2, Bike } from "lucide-react";
import { useTranslation } from "./LanguageToggle";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type TabId = "traffic" | "bookings" | "acquisition" | "bikes";

export default function DashboardSection() {
  const { lang } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<TabId>("traffic");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Web Traffic (GA4) Data
  const trafficData = [
    { name: "Lun", visitas: 120, vistas: 340 },
    { name: "Mar", visitas: 150, vistas: 410 },
    { name: "Mié", visitas: 220, vistas: 580 },
    { name: "Jue", visitas: 180, vistas: 460 },
    { name: "Vie", visitas: 290, vistas: 720 },
    { name: "Sáb", visitas: 340, vistas: 890 },
    { name: "Dom", visitas: 270, vistas: 680 },
  ];

  // 2. Bookings & Sales Data
  const bookingsData = [
    { name: "Lun", reservas: 8, ingresos: 3200 },
    { name: "Mar", reservas: 12, ingresos: 4800 },
    { name: "Mié", reservas: 15, ingresos: 6000 },
    { name: "Jue", reservas: 11, ingresos: 4400 },
    { name: "Vie", reservas: 22, ingresos: 8800 },
    { name: "Sáb", reservas: 31, ingresos: 12400 },
    { name: "Dom", reservas: 25, ingresos: 10000 },
  ];

  // 3. Acquisition Channels Data
  const acquisitionData = [
    { name: lang === "es" ? "Búsqueda Orgánica" : "Organic Search", value: 45, color: "#F2A900" },
    { name: lang === "es" ? "Acceso Directo" : "Direct Access", value: 30, color: "#E76F51" },
    { name: lang === "es" ? "Redes Sociales" : "Social Media", value: 15, color: "#4CAF50" },
    { name: lang === "es" ? "Referidos" : "Referrals", value: 10, color: "#00BCD4" },
  ];

  // 4. Popular Bikes Data
  const bikesData = [
    { name: lang === "es" ? "Paseo Colonial" : "Colonial Cruiser", rentas: 85, color: "#F2A900" },
    { name: lang === "es" ? "Mombacho Explorer" : "Mombacho Explorer", rentas: 64, color: "#E76F51" },
    { name: lang === "es" ? "Volcán Trail" : "Volcano Trail", rentas: 52, color: "#4CAF50" },
    { name: lang === "es" ? "Granada Tandem" : "Granada Tandem", rentas: 38, color: "#00BCD4" },
    { name: lang === "es" ? "Aventura Infantil" : "Kids Adventure", rentas: 24, color: "#9C27B0" },
  ];

  const metrics = [
    {
      title: lang === "es" ? "Usuarios Activos" : "Active Users",
      value: "1,570",
      change: "+12.5%",
      icon: Users,
      color: "text-colonial-yellow",
      bg: "bg-gradient-to-br from-colonial-yellow/10 to-transparent border-colonial-yellow/15 shadow-[0_8px_30px_rgb(242,169,0,0.03)]",
      hoverBorder: "hover:border-colonial-yellow/40",
    },
    {
      title: lang === "es" ? "Vistas de Página" : "Page Views",
      value: "4,080",
      change: "+18.3%",
      icon: BarChart3,
      color: "text-coral",
      bg: "bg-gradient-to-br from-coral/10 to-transparent border-coral/15 shadow-[0_8px_30px_rgb(231,111,81,0.03)]",
      hoverBorder: "hover:border-coral/40",
    },
    {
      title: lang === "es" ? "Reservas Totales" : "Total Bookings",
      value: "144",
      change: "+22.4%",
      icon: CalendarDays,
      color: "text-jungle-green",
      bg: "bg-gradient-to-br from-jungle-green/15 to-transparent border-jungle-green/20 shadow-[0_8px_30px_rgb(38,166,154,0.03)]",
      hoverBorder: "hover:border-jungle-green/45",
    },
    {
      title: lang === "es" ? "Duración Media" : "Avg. Duration",
      value: "2m 45s",
      change: "+4.1%",
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/15 shadow-[0_8px_30px_rgb(59,130,246,0.03)]",
      hoverBorder: "hover:border-blue-500/40",
    },
  ];

  const tabs = [
    { id: "traffic", label: lang === "es" ? "Tráfico (GA4)" : "Traffic (GA4)", icon: BarChart3 },
    { id: "bookings", label: lang === "es" ? "Reservas e Ingresos" : "Bookings & Sales", icon: CalendarDays },
    { id: "acquisition", label: lang === "es" ? "Canales de Adquisición" : "Acquisition Channels", icon: Share2 },
    { id: "bikes", label: lang === "es" ? "Bicicletas Populares" : "Popular Bikes", icon: Bike },
  ];

  return (
    <section id="dashboard" className="py-16 sm:py-20 lg:py-24 bg-[#0a111e] text-white overflow-hidden relative">
      {/* Colonial Tile Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:32px_32px] pointer-events-none" />

      {/* Decorative glows with refined brand colors */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-colonial-yellow/10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-coral/10 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-[#0288D1]/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-colonial-yellow/20 to-coral/20 border border-colonial-yellow/30 text-colonial-yellow text-sm font-semibold rounded-full mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            {lang === "es" ? "Métricas del Negocio" : "Business Insights"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 font-display tracking-tight">
            {lang === "es" ? "Panel de" : "Interactive"}{" "}
            <span className="bg-gradient-to-r from-colonial-yellow via-coral to-[#4CAF50] bg-clip-text text-transparent">
              {lang === "es" ? "Rendimiento Analítico" : "Performance Hub"}
            </span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base sm:text-lg">
            {lang === "es"
              ? "Análisis consolidado de tráfico web, reservas, canales de adquisición y modelos preferidos en BiciVentura."
              : "Consolidated analytics covering web traffic, reservations, channel acquisition, and preferred models."}
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`p-5 rounded-2xl bg-white/[0.03] border backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${metric.bg} ${metric.hoverBorder}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs sm:text-sm font-medium text-white/50">{metric.title}</span>
                  <div className={`p-2 rounded-xl bg-white/5`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mt-4 flex-wrap gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-white">
                    {metric.value}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    metric.change.startsWith("+") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Multi-Tab Analytics Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/[0.02] border border-white/10 rounded-3xl p-4 sm:p-8 backdrop-blur-xl mb-8 shadow-2xl"
        >
          {/* Tabs Navigation */}
          <div className="flex flex-wrap border-b border-white/10 gap-1 sm:gap-2 mb-6 sm:mb-8 pb-1 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold rounded-t-xl transition-all duration-300 relative ${
                    isActive ? "text-colonial-yellow" : "text-white/60 hover:text-white"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-dashboard-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-colonial-yellow"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Chart Panel */}
          <div className="w-full h-[280px] sm:h-[380px] relative">
            {isMounted ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  {activeTab === "traffic" && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <span className="text-xs sm:text-sm text-white/50">
                          {lang === "es" ? "Sesiones únicas de usuarios y páginas vistas estimadas" : "Unique user sessions and estimated page views"}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-semibold">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-colonial-yellow block" />{lang === "es" ? "Visitas" : "Visits"}</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-coral block" />{lang === "es" ? "Páginas Vistas" : "Page Views"}</span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="visitasGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#F2A900" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#F2A900" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="vistasGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E76F51" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#E76F51" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0a111e",
                              borderColor: "rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                          />
                          <Area type="monotone" dataKey="visitas" stroke="#F2A900" strokeWidth={2.5} fillOpacity={1} fill="url(#visitasGrad)" />
                          <Area type="monotone" dataKey="vistas" stroke="#E76F51" strokeWidth={2.5} fillOpacity={1} fill="url(#vistasGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </>
                  )}

                  {activeTab === "bookings" && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <span className="text-xs sm:text-sm text-white/50">
                          {lang === "es" ? "Ingresos generados e historial de reservas por día (en C$)" : "Generated revenue and booking history by day (in C$)"}
                        </span>
                        <div className="flex items-center gap-3 text-xs font-semibold">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-jungle-green block" />{lang === "es" ? "Ingresos" : "Revenue"}</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-400 block" />{lang === "es" ? "Reservas" : "Bookings"}</span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={bookingsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                          <YAxis yAxisId="left" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} label={{ value: "C$", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.4)" }} />
                          <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0a111e",
                              borderColor: "rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                          />
                          <Bar yAxisId="left" dataKey="ingresos" fill="#26A69A" radius={[4, 4, 0, 0]} barSize={20} />
                          <Bar yAxisId="right" dataKey="reservas" fill="#42A5F5" radius={[4, 4, 0, 0]} barSize={8} />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  )}

                  {activeTab === "acquisition" && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <span className="text-xs sm:text-sm text-white/50">
                          {lang === "es" ? "Canales que dirigen tráfico al sitio web" : "Channels driving traffic to the website"}
                        </span>
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={acquisitionData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                          <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} unit="%" />
                          <YAxis type="category" dataKey="name" stroke="#fff" fontSize={12} tickLine={false} width={100} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0a111e",
                              borderColor: "rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                            formatter={(value) => [`${value}%`, lang === "es" ? "Porcentaje" : "Percentage"]}
                          />
                          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={25}>
                            {acquisitionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  )}

                  {activeTab === "bikes" && (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                        <span className="text-xs sm:text-sm text-white/50">
                          {lang === "es" ? "Modelos de bicicletas más populares alquilados en total" : "Total popular bike models rented"}
                        </span>
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={bikesData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                          <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                          <YAxis type="category" dataKey="name" stroke="#fff" fontSize={12} tickLine={false} width={110} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0a111e",
                              borderColor: "rgba(255,255,255,0.1)",
                              borderRadius: "12px",
                              color: "#fff",
                            }}
                            formatter={(value) => [value, lang === "es" ? "Alquileres" : "Rentals"]}
                          />
                          <Bar dataKey="rentas" radius={[0, 8, 8, 0]} barSize={22}>
                            {bikesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30">
                {lang === "es" ? "Cargando métricas..." : "Loading metrics..."}
              </div>
            )}
          </div>
        </motion.div>

        {/* Informative connection alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start sm:items-center gap-4 text-xs sm:text-sm text-white/70 shadow-lg backdrop-blur-md"
        >
          <AlertCircle className="w-5 h-5 text-colonial-yellow flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-bold block text-white">
                {lang === "es" ? "Estado de Integración" : "Integration Status"}
              </span>
              <span>
                {lang === "es"
                  ? "Este panel muestra datos de prueba y se encuentra optimizado para conectarse de manera fluida a la API de Google Analytics 4 (GA4) y al panel de reservas de BiciVentura."
                  : "This dashboard displays testing data and is optimized to seamlessly connect to the Google Analytics 4 (GA4) API and BiciVentura's booking panel."}
              </span>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-colonial-yellow/20 to-coral/20 hover:from-colonial-yellow/30 hover:to-coral/30 rounded-xl font-bold transition-all text-xs text-white border border-colonial-yellow/20 hover:scale-102 cursor-pointer w-fit shadow-md">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === "es" ? "Reconectar API" : "Reconnect API"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
