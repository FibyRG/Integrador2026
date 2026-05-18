import { create } from "zustand";

// ── Types ────────────────────────────────────────────────────────────
export type UserRole = "admin" | "empleado" | null;
export type BikeStatus = "disponible" | "alquilada" | "mantenimiento" | "retirada";
export type ReservationStatus = "confirmada" | "en_curso" | "completada" | "cancelada";
export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia";
export type InvoiceStatus = "pagada" | "pendiente" | "vencida";

export interface Reservation {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  nationality: string;
  bike: string;
  bikeQty: number;
  accessories: string[];
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  days: number;
  total: number;
  status: ReservationStatus;
  notes: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  reservations: number;
}

export interface BikeStat {
  name: string;
  rentals: number;
  revenue: number;
}

export interface NationalityStat {
  country: string;
  count: number;
  percentage: number;
}

export interface DailyTraffic {
  day: string;
  visitors: number;
  reservations: number;
}

// ── POS Types ────────────────────────────────────────────────────────
export interface POSProduct {
  id: string;
  name: string;
  category: "bicicleta" | "accesorio" | "servicio";
  price: number;
  unit: "hora" | "dia" | "unidad";
  image?: string;
}

export interface POSCartItem {
  product: POSProduct;
  qty: number;
  hours?: number;
  subtotal: number;
}

export interface POSTransaction {
  id: string;
  items: POSCartItem[];
  customerName: string;
  customerPhone: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  status: "completada" | "pendiente";
}

// ── Ticket Types ─────────────────────────────────────────────────────
export interface Ticket {
  id: string;
  reservationId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNationality: string;
  customerPassport?: string;
  bike: string;
  bikeQty: number;
  accessories: string[];
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  days: number;
  pricePerDay: number;
  subtotal: number;
  tax: number;
  total: number;
  deposit: number;
  paymentMethod: PaymentMethod;
  conditions: string[];
  createdAt: string;
  status: "activa" | "devuelta" | "pendiente";
}

// ── Invoice Types ────────────────────────────────────────────────────
export interface Invoice {
  id: string;
  ticketId?: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  customerTaxId?: string;
  items: { description: string; qty: number; unitPrice: number; subtotal: number }[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  createdAt: string;
  dueDate: string;
  notes?: string;
}

// ── Inventory Types ──────────────────────────────────────────────────
export interface BikeInventory {
  id: string;
  name: string;
  model: string;
  type: "cruiser" | "mtb" | "urban" | "tandem" | "kids";
  pricePerHour: number;
  pricePerDay: number;
  status: BikeStatus;
  condition: "excelente" | "buena" | "regular" | "malo";
  lastMaintenance: string;
  nextMaintenance: string;
  totalRides: number;
  revenueGenerated: number;
}

// ── Store State ──────────────────────────────────────────────────────
export interface AdminState {
  // Auth
  userRole: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;

  // Navigation
  activeView: string;
  setActiveView: (view: string) => void;

  // Dashboard data
  reservations: Reservation[];
  monthlyRevenue: MonthlyRevenue[];
  bikeStats: BikeStat[];
  nationalityStats: NationalityStat[];
  dailyTraffic: DailyTraffic[];
  totalRevenue: number;
  totalReservations: number;
  activeReservations: number;
  avgRating: number;
  completionRate: number;
  refreshData: () => void;

  // POS
  posProducts: POSProduct[];
  posCart: POSCartItem[];
  addToCart: (product: POSProduct, qty?: number, hours?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  posTransactions: POSTransaction[];
  completePOSTransaction: (customerName: string, customerPhone: string, paymentMethod: PaymentMethod) => string;

  // Tickets
  tickets: Ticket[];
  createTicket: (data: Omit<Ticket, "id" | "createdAt">) => string;
  returnBike: (ticketId: string) => void;

  // Invoices
  invoices: Invoice[];
  createInvoice: (data: Omit<Invoice, "id" | "createdAt" | "invoiceNumber">) => string;

  // Inventory
  inventory: BikeInventory[];
  updateBikeStatus: (bikeId: string, status: BikeStatus) => void;
}

// ── Mock Data ────────────────────────────────────────────────────────
const mockReservations: Reservation[] = [
  { id: "BV-001", customerName: "María González", email: "maria@gmail.com", phone: "+54 11 1234-5678", nationality: "Argentina", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Candado"], pickupDate: "2025-01-15", returnDate: "2025-01-15", pickupTime: "9:00 AM", returnTime: "5:00 PM", days: 1, total: 28, status: "completada", notes: "", paymentMethod: "efectivo", createdAt: "2025-01-14" },
  { id: "BV-002", customerName: "Thomas Müller", email: "thomas@web.de", phone: "+49 170 1234567", nationality: "Alemania", bike: "Mombacho MTB", bikeQty: 2, accessories: ["Casco", "Casco", "Kit de picnic"], pickupDate: "2025-01-16", returnDate: "2025-01-18", pickupTime: "7:00 AM", returnTime: "6:00 PM", days: 3, total: 276, status: "completada", notes: "Ruta al volcán", paymentMethod: "tarjeta", createdAt: "2025-01-15" },
  { id: "BV-003", customerName: "Ana Rodríguez", email: "ana@mail.cr", phone: "+506 8765-4321", nationality: "Costa Rica", bike: "Colonial Urban", bikeQty: 1, accessories: ["Botella de agua"], pickupDate: "2025-01-20", returnDate: "2025-01-20", pickupTime: "10:00 AM", returnTime: "2:00 PM", days: 1, total: 21, status: "completada", notes: "", paymentMethod: "efectivo", createdAt: "2025-01-19" },
  { id: "BV-004", customerName: "Sarah Johnson", email: "sarah@pdx.or.us", phone: "+1 503 555-0123", nationality: "EE.UU.", bike: "Granada Cruiser", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Farol extra"], pickupDate: "2025-02-01", returnDate: "2025-02-03", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 3, total: 204, status: "completada", notes: "Pareja, tour por isletas", paymentMethod: "tarjeta", createdAt: "2025-01-31" },
  { id: "BV-005", customerName: "Lucía Fernández", email: "lucia@mail.es", phone: "+34 612 345 678", nationality: "España", bike: "Tandem Amigos", bikeQty: 1, accessories: ["Casco", "Casco"], pickupDate: "2025-02-10", returnDate: "2025-02-10", pickupTime: "4:00 PM", returnTime: "6:00 PM", days: 1, total: 52, status: "completada", notes: "Paseo al atardecer", paymentMethod: "efectivo", createdAt: "2025-02-09" },
  { id: "BV-006", customerName: "Jean-Pierre Dubois", email: "jp@paris.fr", phone: "+33 6 1234 5678", nationality: "Francia", bike: "Mombacho MTB", bikeQty: 1, accessories: ["Casco", "Botella de agua"], pickupDate: "2025-02-14", returnDate: "2025-02-15", pickupTime: "7:00 AM", returnTime: "4:00 PM", days: 2, total: 100, status: "completada", notes: "Aventura en senderos", paymentMethod: "transferencia", createdAt: "2025-02-13" },
  { id: "BV-007", customerName: "Carlos Mendoza", email: "carlos@gmail.ni", phone: "+505 8888-1234", nationality: "Nicaragua", bike: "Colonial Urban", bikeQty: 1, accessories: [], pickupDate: "2025-02-20", returnDate: "2025-02-20", pickupTime: "9:00 AM", returnTime: "12:00 PM", days: 1, total: 20, status: "completada", notes: "Local, recorrido familiar", paymentMethod: "efectivo", createdAt: "2025-02-19" },
  { id: "BV-008", customerName: "Emma Williams", email: "emma@london.uk", phone: "+44 7700 900123", nationality: "Reino Unido", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Candado", "Silla para niños"], pickupDate: "2025-03-01", returnDate: "2025-03-02", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 2, total: 64, status: "completada", notes: "Con hija de 3 años", paymentMethod: "tarjeta", createdAt: "2025-02-28" },
  { id: "BV-009", customerName: "Paolo Rossi", email: "paolo@roma.it", phone: "+39 333 456 7890", nationality: "Italia", bike: "Tandem Amigos", bikeQty: 1, accessories: ["Casco", "Casco", "Kit de picnic"], pickupDate: "2025-03-05", returnDate: "2025-03-05", pickupTime: "3:00 PM", returnTime: "6:00 PM", days: 1, total: 60, status: "completada", notes: "Luna de miel", paymentMethod: "efectivo", createdAt: "2025-03-04" },
  { id: "BV-010", customerName: "Lotte van der Berg", email: "lotte@amsterdam.nl", phone: "+31 6 1234 5678", nationality: "Holanda", bike: "Colonial Urban", bikeQty: 1, accessories: ["Casco"], pickupDate: "2025-03-10", returnDate: "2025-03-10", pickupTime: "10:00 AM", returnTime: "4:00 PM", days: 1, total: 22, status: "completada", notes: "", paymentMethod: "tarjeta", createdAt: "2025-03-09" },
  { id: "BV-011", customerName: "Roberto Silva", email: "roberto@uol.com.br", phone: "+55 11 9876-5432", nationality: "Brasil", bike: "Mombacho MTB", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Botella", "Botella"], pickupDate: "2025-03-15", returnDate: "2025-03-17", pickupTime: "7:00 AM", returnTime: "6:00 PM", days: 3, total: 282, status: "completada", notes: "Grupo de aventura", paymentMethod: "transferencia", createdAt: "2025-03-14" },
  { id: "BV-012", customerName: "Kate Brown", email: "kate@sydney.au", phone: "+61 412 345 678", nationality: "Australia", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Candado"], pickupDate: "2025-03-20", returnDate: "2025-03-21", pickupTime: "9:00 AM", returnTime: "5:00 PM", days: 2, total: 54, status: "completada", notes: "", paymentMethod: "efectivo", createdAt: "2025-03-19" },
  { id: "BV-013", customerName: "Yuki Tanaka", email: "yuki@tokyo.jp", phone: "+81 90 1234 5678", nationality: "Japón", bike: "Colonial Urban", bikeQty: 1, accessories: ["Casco", "Farol extra"], pickupDate: "2025-04-01", returnDate: "2025-04-01", pickupTime: "10:00 AM", returnTime: "3:00 PM", days: 1, total: 22, status: "completada", notes: "Fotografía callejera", paymentMethod: "efectivo", createdAt: "2025-03-31" },
  { id: "BV-014", customerName: "María José Ramírez", email: "mj@gmail.gt", phone: "+502 5432-1098", nationality: "Guatemala", bike: "Granada Cruiser", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Botella", "Botella"], pickupDate: "2025-04-05", returnDate: "2025-04-07", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 3, total: 222, status: "completada", notes: "Amigas viajando juntas", paymentMethod: "tarjeta", createdAt: "2025-04-04" },
  { id: "BV-015", customerName: "David Chen", email: "david@toronto.ca", phone: "+1 416 555-7890", nationality: "Canadá", bike: "Mombacho MTB", bikeQty: 1, accessories: ["Casco", "Botella de agua", "Farol extra"], pickupDate: "2025-04-10", returnDate: "2025-04-11", pickupTime: "7:00 AM", returnTime: "4:00 PM", days: 2, total: 86, status: "completada", notes: "", paymentMethod: "efectivo", createdAt: "2025-04-09" },
  { id: "BV-016", customerName: "Laura Martínez", email: "laura@mail.mx", phone: "+52 55 1234-5678", nationality: "México", bike: "Tandem Amigos", bikeQty: 1, accessories: ["Casco", "Casco"], pickupDate: "2025-07-10", returnDate: "2025-07-10", pickupTime: "4:00 PM", returnTime: "6:00 PM", days: 1, total: 52, status: "en_curso", notes: "Llegando hoy", paymentMethod: "efectivo", createdAt: "2025-07-09" },
  { id: "BV-017", customerName: "Max Schneider", email: "max@berlin.de", phone: "+49 171 9876-5432", nationality: "Alemania", bike: "Mombacho MTB", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Botella", "Botella", "Kit de picnic"], pickupDate: "2025-07-11", returnDate: "2025-07-13", pickupTime: "7:00 AM", returnTime: "6:00 PM", days: 3, total: 320, status: "confirmada", notes: "Grupo de 2, tour extenso", paymentMethod: "tarjeta", createdAt: "2025-07-10" },
  { id: "BV-018", customerName: "Isabella Costa", email: "isabella@saopaulo.br", phone: "+55 11 9123-4567", nationality: "Brasil", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Candado", "Silla para niños"], pickupDate: "2025-07-12", returnDate: "2025-07-12", pickupTime: "9:00 AM", returnTime: "1:00 PM", days: 1, total: 32, status: "confirmada", notes: "Con bebé", paymentMethod: "efectivo", createdAt: "2025-07-11" },
  { id: "BV-019", customerName: "James Wilson", email: "james@auckland.nz", phone: "+64 21 123 4567", nationality: "Nueva Zelanda", bike: "Colonial Urban", bikeQty: 1, accessories: ["Casco"], pickupDate: "2025-07-09", returnDate: "2025-07-09", pickupTime: "10:00 AM", returnTime: "4:00 PM", days: 1, total: 22, status: "cancelada", notes: "Canceló por lluvia", paymentMethod: "efectivo", createdAt: "2025-07-08" },
  { id: "BV-020", customerName: "Sophie Laurent", email: "sophie@lyon.fr", phone: "+33 6 9876 5432", nationality: "Francia", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Botella de agua"], pickupDate: "2025-07-13", returnDate: "2025-07-14", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 2, total: 52, status: "confirmada", notes: "", paymentMethod: "tarjeta", createdAt: "2025-07-12" },
];

const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: "Ene", revenue: 549, reservations: 22 },
  { month: "Feb", revenue: 632, reservations: 28 },
  { month: "Mar", revenue: 878, reservations: 35 },
  { month: "Abr", revenue: 712, reservations: 30 },
  { month: "May", revenue: 920, reservations: 38 },
  { month: "Jun", revenue: 1245, reservations: 48 },
  { month: "Jul", revenue: 1580, reservations: 62 },
];

const mockBikeStats: BikeStat[] = [
  { name: "Granada Cruiser", rentals: 142, revenue: 3840 },
  { name: "Mombacho MTB", rentals: 98, revenue: 3920 },
  { name: "Colonial Urban", rentals: 76, revenue: 1520 },
  { name: "Tandem Amigos", rentals: 34, revenue: 1700 },
];

const mockNationalityStats: NationalityStat[] = [
  { country: "EE.UU.", count: 48, percentage: 22 },
  { country: "Alemania", count: 32, percentage: 15 },
  { country: "Francia", count: 24, percentage: 11 },
  { country: "Canadá", count: 18, percentage: 8 },
  { country: "Argentina", count: 15, percentage: 7 },
  { country: "España", count: 14, percentage: 6 },
  { country: "Reino Unido", count: 12, percentage: 6 },
  { country: "Brasil", count: 11, percentage: 5 },
  { country: "Otros", count: 41, percentage: 19 },
];

const mockDailyTraffic: DailyTraffic[] = [
  { day: "Lun", visitors: 45, reservations: 8 },
  { day: "Mar", visitors: 52, reservations: 10 },
  { day: "Mié", visitors: 61, reservations: 12 },
  { day: "Jue", visitors: 58, reservations: 11 },
  { day: "Vie", visitors: 72, reservations: 15 },
  { day: "Sáb", visitors: 95, reservations: 22 },
  { day: "Dom", visitors: 88, reservations: 19 },
];

// ── POS Products ─────────────────────────────────────────────────────
const mockPOSProducts: POSProduct[] = [
  { id: "p1", name: "Granada Cruiser", category: "bicicleta", price: 8, unit: "hora" },
  { id: "p2", name: "Granada Cruiser (Día)", category: "bicicleta", price: 24, unit: "dia" },
  { id: "p3", name: "Mombacho MTB", category: "bicicleta", price: 12, unit: "hora" },
  { id: "p4", name: "Mombacho MTB (Día)", category: "bicicleta", price: 35, unit: "dia" },
  { id: "p5", name: "Colonial Urban", category: "bicicleta", price: 6, unit: "hora" },
  { id: "p6", name: "Colonial Urban (Día)", category: "bicicleta", price: 18, unit: "dia" },
  { id: "p7", name: "Tandem Amigos", category: "bicicleta", price: 15, unit: "hora" },
  { id: "p8", name: "Tandem Amigos (Día)", category: "bicicleta", price: 45, unit: "dia" },
  { id: "p9", name: "Casco", category: "accesorio", price: 3, unit: "unidad" },
  { id: "p10", name: "Candado", category: "accesorio", price: 2, unit: "unidad" },
  { id: "p11", name: "Botella de agua", category: "accesorio", price: 1, unit: "unidad" },
  { id: "p12", name: "Farol extra", category: "accesorio", price: 3, unit: "unidad" },
  { id: "p13", name: "Silla para niños", category: "accesorio", price: 5, unit: "unidad" },
  { id: "p14", name: "Kit de picnic", category: "accesorio", price: 8, unit: "unidad" },
  { id: "p15", name: "Tour guiado Isletas", category: "servicio", price: 25, unit: "persona" },
  { id: "p16", name: "Tour Volcán Mombacho", category: "servicio", price: 40, unit: "persona" },
  { id: "p17", name: "Mapa Granada", category: "accesorio", price: 2, unit: "unidad" },
];

const mockPOSTransactions: POSTransaction[] = [
  { id: "POS-001", items: [{ product: mockPOSProducts[0], qty: 2, hours: 4, subtotal: 64 }, { product: mockPOSProducts[8], qty: 2, subtotal: 6 }], customerName: "Ana López", customerPhone: "+505 8888-1234", subtotal: 70, tax: 0, total: 70, paymentMethod: "efectivo", createdAt: "2025-07-10T10:30:00", status: "completada" },
  { id: "POS-002", items: [{ product: mockPOSProducts[2], qty: 1, hours: 8, subtotal: 96 }, { product: mockPOSProducts[10], qty: 1, subtotal: 1 }], customerName: "Mark Smith", customerPhone: "+1 555-0123", subtotal: 97, tax: 0, total: 97, paymentMethod: "tarjeta", createdAt: "2025-07-10T11:15:00", status: "completada" },
  { id: "POS-003", items: [{ product: mockPOSProducts[6], qty: 1, hours: 2, subtotal: 30 }], customerName: "Laura Pérez", customerPhone: "+505 7777-5678", subtotal: 30, tax: 0, total: 30, paymentMethod: "efectivo", createdAt: "2025-07-10T14:00:00", status: "completada" },
];

// ── Tickets ──────────────────────────────────────────────────────────
const mockTickets: Ticket[] = [
  {
    id: "TK-001", reservationId: "BV-016", customerName: "Laura Martínez", customerPhone: "+52 55 1234-5678", customerEmail: "laura@mail.mx", customerNationality: "México",
    bike: "Tandem Amigos", bikeQty: 1, accessories: ["Casco", "Casco"],
    pickupDate: "2025-07-10", returnDate: "2025-07-10", pickupTime: "4:00 PM", returnTime: "6:00 PM", days: 1, pricePerDay: 45, subtotal: 45, tax: 0, total: 52, deposit: 30,
    paymentMethod: "efectivo", conditions: ["Devolver la bicicleta en las mismas condiciones", "No utilizar fuera del área permitida", "Depósito reembolsable al devolver"], createdAt: "2025-07-10T09:00:00", status: "activa",
  },
  {
    id: "TK-002", reservationId: "BV-004", customerName: "Sarah Johnson", customerPhone: "+1 503 555-0123", customerEmail: "sarah@pdx.or.us", customerNationality: "EE.UU.",
    bike: "Granada Cruiser", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Farol extra"],
    pickupDate: "2025-02-01", returnDate: "2025-02-03", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 3, pricePerDay: 48, subtotal: 204, tax: 0, total: 204, deposit: 50,
    paymentMethod: "tarjeta", conditions: ["Devolver la bicicleta en las mismas condiciones", "No utilizar fuera del área permitida", "Depósito reembolsable al devolver"], createdAt: "2025-01-31T16:00:00", status: "devuelta",
  },
];

// ── Invoices ─────────────────────────────────────────────────────────
const mockInvoices: Invoice[] = [
  {
    id: "INV-001", ticketId: "TK-002", invoiceNumber: "FAC-2025-001", customerName: "Sarah Johnson", customerPhone: "+1 503 555-0123", customerEmail: "sarah@pdx.or.us",
    items: [{ description: "Granada Cruiser x2 (3 días)", qty: 2, unitPrice: 102, subtotal: 204 }],
    subtotal: 204, tax: 0, taxRate: 0, total: 204, paymentMethod: "tarjeta", status: "pagada", createdAt: "2025-02-03T17:00:00", dueDate: "2025-02-03",
  },
  {
    id: "INV-002", invoiceNumber: "FAC-2025-002", customerName: "Thomas Müller", customerPhone: "+49 170 1234567", customerEmail: "thomas@web.de", customerTaxId: "DE123456789",
    items: [{ description: "Mombacho MTB x2 (3 días)", qty: 2, unitPrice: 138, subtotal: 276 }],
    subtotal: 276, tax: 0, taxRate: 0, total: 276, paymentMethod: "tarjeta", status: "pagada", createdAt: "2025-01-18T18:00:00", dueDate: "2025-01-18",
  },
];

// ── Inventory ────────────────────────────────────────────────────────
const mockInventory: BikeInventory[] = [
  { id: "BIKE-001", name: "Granada Cruiser", model: "GC-2024", type: "cruiser", pricePerHour: 8, pricePerDay: 24, status: "disponible", condition: "excelente", lastMaintenance: "2025-06-01", nextMaintenance: "2025-09-01", totalRides: 87, revenueGenerated: 2340 },
  { id: "BIKE-002", name: "Granada Cruiser", model: "GC-2024", type: "cruiser", pricePerHour: 8, pricePerDay: 24, status: "alquilada", condition: "buena", lastMaintenance: "2025-05-15", nextMaintenance: "2025-08-15", totalRides: 95, revenueGenerated: 2580 },
  { id: "BIKE-003", name: "Granada Cruiser", model: "GC-2023", type: "cruiser", pricePerHour: 8, pricePerDay: 24, status: "disponible", condition: "buena", lastMaintenance: "2025-06-10", nextMaintenance: "2025-09-10", totalRides: 112, revenueGenerated: 3010 },
  { id: "BIKE-004", name: "Granada Cruiser", model: "GC-2024", type: "cruiser", pricePerHour: 8, pricePerDay: 24, status: "mantenimiento", condition: "regular", lastMaintenance: "2025-07-08", nextMaintenance: "2025-07-15", totalRides: 68, revenueGenerated: 1840 },
  { id: "BIKE-005", name: "Mombacho MTB", model: "MM-2024", type: "mtb", pricePerHour: 12, pricePerDay: 35, status: "disponible", condition: "excelente", lastMaintenance: "2025-06-20", nextMaintenance: "2025-09-20", totalRides: 54, revenueGenerated: 2160 },
  { id: "BIKE-006", name: "Mombacho MTB", model: "MM-2024", type: "mtb", pricePerHour: 12, pricePerDay: 35, status: "alquilada", condition: "buena", lastMaintenance: "2025-05-28", nextMaintenance: "2025-08-28", totalRides: 62, revenueGenerated: 2480 },
  { id: "BIKE-007", name: "Mombacho MTB", model: "MM-2023", type: "mtb", pricePerHour: 12, pricePerDay: 35, status: "disponible", condition: "buena", lastMaintenance: "2025-06-15", nextMaintenance: "2025-09-15", totalRides: 48, revenueGenerated: 1920 },
  { id: "BIKE-008", name: "Colonial Urban", model: "CU-2024", type: "urban", pricePerHour: 6, pricePerDay: 18, status: "disponible", condition: "excelente", lastMaintenance: "2025-06-25", nextMaintenance: "2025-09-25", totalRides: 76, revenueGenerated: 1520 },
  { id: "BIKE-009", name: "Colonial Urban", model: "CU-2024", type: "urban", pricePerHour: 6, pricePerDay: 18, status: "disponible", condition: "buena", lastMaintenance: "2025-07-01", nextMaintenance: "2025-10-01", totalRides: 45, revenueGenerated: 900 },
  { id: "BIKE-010", name: "Tandem Amigos", model: "TA-2024", type: "tandem", pricePerHour: 15, pricePerDay: 45, status: "alquilada", condition: "excelente", lastMaintenance: "2025-06-30", nextMaintenance: "2025-09-30", totalRides: 34, revenueGenerated: 1700 },
];

// ── Counter ──────────────────────────────────────────────────────────
let posCounter = 4;
let ticketCounter = 3;
let invoiceCounter = 3;

// ── Store ────────────────────────────────────────────────────────────
export const useAdminStore = create<AdminState>((set, get) => ({
  // Auth
  userRole: null,
  isAuthenticated: false,
  login: (role) => set({ userRole: role, isAuthenticated: true, activeView: "dashboard" }),
  logout: () => set({ userRole: null, isAuthenticated: false, activeView: "dashboard", posCart: [] }),

  // Navigation
  activeView: "dashboard",
  setActiveView: (view) => set({ activeView: view }),

  // Dashboard
  reservations: mockReservations,
  monthlyRevenue: mockMonthlyRevenue,
  bikeStats: mockBikeStats,
  nationalityStats: mockNationalityStats,
  dailyTraffic: mockDailyTraffic,
  totalRevenue: 6516,
  totalReservations: 263,
  activeReservations: 5,
  avgRating: 4.8,
  completionRate: 92,
  refreshData: () => {
    set((state) => ({
      totalReservations: state.totalReservations + Math.floor(Math.random() * 3),
      totalRevenue: state.totalRevenue + Math.floor(Math.random() * 100),
    }));
  },

  // POS
  posProducts: mockPOSProducts,
  posCart: [],
  addToCart: (product, qty = 1) => {
    const cart = get().posCart;
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      set({
        posCart: cart.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + qty, subtotal: (item.qty + qty) * product.price }
            : item
        ),
      });
    } else {
      set({ posCart: [...cart, { product, qty, subtotal: qty * product.price }] });
    }
  },
  removeFromCart: (productId) => {
    set({ posCart: get().posCart.filter((item) => item.product.id !== productId) });
  },
  updateCartQty: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      posCart: get().posCart.map((item) =>
        item.product.id === productId
          ? { ...item, qty, subtotal: qty * item.product.price }
          : item
      ),
    });
  },
  clearCart: () => set({ posCart: [] }),
  posTransactions: mockPOSTransactions,
  completePOSTransaction: (customerName, customerPhone, paymentMethod) => {
    const cart = get().posCart;
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const id = `POS-${String(posCounter++).padStart(3, "0")}`;
    const tx: POSTransaction = {
      id,
      items: [...cart],
      customerName,
      customerPhone,
      subtotal,
      tax: 0,
      total: subtotal,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: "completada",
    };
    set((state) => ({
      posTransactions: [tx, ...state.posTransactions],
      posCart: [],
      totalRevenue: state.totalRevenue + tx.total,
    }));
    return id;
  },

  // Tickets
  tickets: mockTickets,
  createTicket: (data) => {
    const id = `TK-${String(ticketCounter++).padStart(3, "0")}`;
    const ticket: Ticket = { ...data, id, createdAt: new Date().toISOString() };
    set((state) => ({ tickets: [ticket, ...state.tickets] }));
    return id;
  },
  returnBike: (ticketId) => {
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === ticketId ? { ...t, status: "devuelta" as const } : t)),
    }));
  },

  // Invoices
  invoices: mockInvoices,
  createInvoice: (data) => {
    const id = `INV-${String(invoiceCounter++).padStart(3, "0")}`;
    const invoice: Invoice = { ...data, id, createdAt: new Date().toISOString() };
    set((state) => ({ invoices: [invoice, ...state.invoices] }));
    return id;
  },

  // Inventory
  inventory: mockInventory,
  updateBikeStatus: (bikeId, status) => {
    set((state) => ({
      inventory: state.inventory.map((b) => (b.id === bikeId ? { ...b, status } : b)),
    }));
  },
}));
