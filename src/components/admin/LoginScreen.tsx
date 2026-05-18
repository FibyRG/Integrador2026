"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, Shield, Bike, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginScreenProps {
  onLogin: (role: "admin" | "empleado") => void;
}

// ── Password credentials ─────────────────────────────────────────
const CREDENTIALS: Record<"admin" | "empleado", string> = {
  admin: "admin",
  empleado: "empleado",
};

// ── Role config ──────────────────────────────────────────────────
interface RoleConfig {
  role: "admin" | "empleado";
  title: string;
  description: string;
  details: string[];
  icon: React.ElementType;
  bgClass: string;
  bgHoverClass: string;
  iconBg: string;
  accentColor: string;
  buttonClass: string;
  buttonHoverClass: string;
  borderColor: string;
  errorRing: string;
}

const ROLE_CONFIGS: RoleConfig[] = [
  {
    role: "admin",
    title: "Administrador",
    description: "Acceso completo al sistema de gestión.",
    details: [
      "Dashboard con métricas en tiempo real",
      "Inventario y gestión de bicicletas",
      "Facturación y reportes financieros",
      "Gestión completa de reservas",
    ],
    icon: Shield,
    bgClass: "bg-anil-blue",
    bgHoverClass: "hover:bg-anil-blue/95",
    iconBg: "bg-white/15",
    accentColor: "#F2A900",
    buttonClass: "bg-colonial-yellow text-anil-blue hover:bg-colonial-yellow/90",
    buttonHoverClass: "",
    borderColor: "border-anil-blue/20",
    errorRing: "ring-coral/40 border-coral",
  },
  {
    role: "empleado",
    title: "Empleado",
    description: "Acceso limitado para operaciones diarias.",
    details: [
      "Punto de venta (POS)",
      "Generación de tickets",
      "Procesamiento de devoluciones",
      "Consulta de disponibilidad",
    ],
    icon: User,
    bgClass: "bg-jungle-green",
    bgHoverClass: "hover:bg-jungle-green/95",
    iconBg: "bg-white/15",
    accentColor: "#F2A900",
    buttonClass: "bg-colonial-yellow text-anil-blue hover:bg-colonial-yellow/90",
    buttonHoverClass: "",
    borderColor: "border-jungle-green/20",
    errorRing: "ring-coral/40 border-coral",
  },
];

// ── Animations ───────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

const shakeAnimation = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.5 },
};

// ── Login Card ───────────────────────────────────────────────────
function LoginCard({
  config,
  onLogin,
}: {
  config: RoleConfig;
  onLogin: (role: "admin" | "empleado") => void;
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CREDENTIALS[config.role]) {
      setError(false);
      onLogin(config.role);
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <motion.div
        animate={isShaking ? shakeAnimation : {}}
        className={`rounded-2xl shadow-lg overflow-hidden ${config.bgClass} ${config.bgHoverClass} transition-colors duration-300 h-full`}
      >
        <div className="p-6 sm:p-8 flex flex-col h-full">
          {/* Icon & Title */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{config.title}</h2>
              <p className="text-sm text-white/70">{config.description}</p>
            </div>
          </div>

          {/* Access details */}
          <div className="space-y-2 mb-6 flex-grow">
            {config.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: config.accentColor }}
                />
                <span className="text-sm text-white/80 leading-snug">
                  {detail}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`h-11 rounded-xl pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 text-sm backdrop-blur-sm focus:bg-white/15 transition-colors ${
                    error
                      ? `border-coral ring-2 ${config.errorRing}`
                      : "focus:border-colonial-yellow/50 focus:ring-1 focus:ring-colonial-yellow/30"
                  }`}
                  autoFocus={config.role === "admin"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-medium text-coral flex items-center gap-1"
              >
                <span className="inline-block w-1 h-1 rounded-full bg-coral" />
                Contraseña incorrecta
              </motion.p>
            )}

            <Button
              type="submit"
              className={`w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] ${config.buttonClass}`}
            >
              Ingresar
            </Button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Login Screen ─────────────────────────────────────────────────
export default function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-white via-white to-colonial-yellow/5 pointer-events-none" />

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-anil-blue"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-jungle-green"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-colonial-yellow"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-3xl mx-auto"
      >
        {/* Branding Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-anil-blue rounded-2xl shadow-lg shadow-anil-blue/20 mb-5"
          >
            <Bike className="w-8 h-8 text-colonial-yellow" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-anil-blue tracking-tight mb-2">
            Bici<span className="text-colonial-yellow">Ventura</span>
          </h1>
          <p className="text-sm sm:text-base text-anil-blue/50 font-medium tracking-wide uppercase">
            Panel de Gestión
          </p>
        </motion.div>

        {/* Login Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
        >
          {ROLE_CONFIGS.map((config) => (
            <LoginCard key={config.role} config={config} onLogin={onLogin} />
          ))}
        </motion.div>

        {/* Demo hint */}
        <motion.p
          variants={itemVariants}
          className="text-center text-[11px] text-muted-foreground/40 mt-8"
        >
          Demo: admin / empleado
        </motion.p>
      </motion.div>
    </div>
  );
}
