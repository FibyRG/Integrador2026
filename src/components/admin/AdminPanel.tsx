"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Ticket as TicketIcon,
  Wrench,
  LogOut,
  ChevronLeft,
  Bike,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/stores/adminStore";
import LoginScreen from "./LoginScreen";
import DashboardView from "./DashboardView";
import POSView from "./POSView";
import InvoiceView from "./InvoiceView";
import TicketView from "./TicketView";
import InventoryView from "./InventoryView";

// ── Sidebar nav items ────────────────────────────────────────────────
interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  adminOnly: boolean;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
  { id: "pos", label: "Punto de Venta", icon: ShoppingCart, adminOnly: false },
  { id: "tickets", label: "Tickets", icon: TicketIcon, adminOnly: false },
  { id: "invoices", label: "Facturación", icon: FileText, adminOnly: true },
  { id: "inventory", label: "Inventario", icon: Wrench, adminOnly: true },
];

// ── Main Admin Panel ─────────────────────────────────────────────────
export default function AdminPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isAuthenticated, userRole, activeView, setActiveView, logout } =
    useAdminStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Reset view when opening
  useEffect(() => {
    if (open && !isAuthenticated) {
      logout();
    }
  }, [open, logout, isAuthenticated]);

  const filteredNav = navItems.filter(
    (item) => !item.adminOnly || userRole === "admin"
  );

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "pos":
        return <POSView />;
      case "invoices":
        return <InvoiceView />;
      case "tickets":
        return <TicketView />;
      case "inventory":
        return <InventoryView />;
      default:
        return <DashboardView />;
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="admin-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Full-screen panel */}
      <motion.div
        key="admin-panel"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="fixed inset-2 sm:inset-4 md:inset-6 z-[201] bg-warm-white rounded-2xl overflow-hidden flex flex-col shadow-2xl"
      >
        {!isAuthenticated ? (
          <LoginScreen onLogin={(role) => useAdminStore.getState().login(role)} />
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* ── Sidebar ───────────────────────────────────────── */}
            <aside
              className={`hidden md:flex flex-col bg-anil-blue text-warm-white transition-all duration-300 ${
                sidebarCollapsed ? "w-[68px]" : "w-[250px]"
              }`}
            >
              {/* Brand */}
              <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
                <div className="w-9 h-9 rounded-xl bg-colonial-yellow flex items-center justify-center flex-shrink-0">
                  <Bike className="w-5 h-5 text-anil-blue" />
                </div>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <h2 className="text-sm font-bold text-colonial-yellow leading-tight">
                      BiciVentura
                    </h2>
                    <p className="text-[10px] text-white/50 leading-tight">
                      Panel de Gestión
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-white/15 text-colonial-yellow"
                          : "text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </nav>

              {/* Collapse toggle */}
              <div className="px-2 py-2 border-t border-white/10">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors text-xs"
                >
                  <ChevronLeft
                    className={`w-4 h-4 transition-transform duration-200 ${
                      sidebarCollapsed ? "rotate-180" : ""
                    }`}
                  />
                  {!sidebarCollapsed && <span>Colapsar</span>}
                </button>
              </div>

              {/* User info + logout */}
              <div className="px-2 py-3 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      userRole === "admin"
                        ? "bg-colonial-yellow text-anil-blue"
                        : "bg-jungle-green text-white"
                    }`}
                  >
                    {userRole === "admin" ? "A" : "E"}
                  </div>
                  {!sidebarCollapsed && (
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white/90 truncate">
                        {userRole === "admin" ? "Administrador" : "Empleado"}
                      </p>
                      <p className="text-[10px] text-white/40 truncate">
                        Conectado
                      </p>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-coral hover:bg-coral/10 transition-colors text-xs cursor-pointer"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span>Cerrar</span>}
                </button>
              </div>
            </aside>

            {/* ── Mobile header ─────────────────────────────────── */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-anil-blue text-white">
              <div className="flex items-center gap-3">
                <Bike className="w-5 h-5 text-colonial-yellow" />
                <span className="text-sm font-bold">BiciVentura</span>
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-1.5 ${
                    userRole === "admin"
                      ? "bg-colonial-yellow text-anil-blue"
                      : "bg-jungle-green text-white"
                  }`}
                >
                  {userRole === "admin" ? "Admin" : "Empleado"}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {/* Mobile nav buttons */}
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-white/15 text-colonial-yellow"
                          : "text-white/50 hover:text-white"
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </button>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/60 hover:text-white hover:bg-white/10 ml-1"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Mobile nav bar */}
            <div className="md:hidden flex items-center gap-1 px-3 py-2 bg-white border-b border-border overflow-x-auto">
              {filteredNav.map((item) => {
                const isActive = activeView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-anil-blue text-white"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* ── Main content ──────────────────────────────────── */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="w-12 h-12 rounded-full border-[3px] border-anil-blue/20 border-t-colonial-yellow"
                        />
                        <Bike className="absolute inset-0 m-auto w-5 h-5 text-anil-blue" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Cargando...
                      </p>
                    </motion.div>
                  </div>
                }
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderView()}
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </main>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
