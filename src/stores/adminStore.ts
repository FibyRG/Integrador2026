import { create } from "zustand";

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
  status: "confirmada" | "en_curso" | "completada" | "cancelada";
  notes: string;
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

export interface AdminState {
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
}

const mockReservations: Reservation[] = [
  { id: "BV-001", customerName: "María González", email: "maria@gmail.com", phone: "+54 11 1234-5678", nationality: "Argentina", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Candado"], pickupDate: "2025-01-15", returnDate: "2025-01-15", pickupTime: "9:00 AM", returnTime: "5:00 PM", days: 1, total: 28, status: "completada", notes: "" },
  { id: "BV-002", customerName: "Thomas Müller", email: "thomas@web.de", phone: "+49 170 1234567", nationality: "Alemania", bike: "Mombacho MTB", bikeQty: 2, accessories: ["Casco", "Casco", "Kit de picnic"], pickupDate: "2025-01-16", returnDate: "2025-01-18", pickupTime: "7:00 AM", returnTime: "6:00 PM", days: 3, total: 276, status: "completada", notes: "Ruta al volcán" },
  { id: "BV-003", customerName: "Ana Rodríguez", email: "ana@mail.cr", phone: "+506 8765-4321", nationality: "Costa Rica", bike: "Colonial Urban", bikeQty: 1, accessories: ["Botella de agua"], pickupDate: "2025-01-20", returnDate: "2025-01-20", pickupTime: "10:00 AM", returnTime: "2:00 PM", days: 1, total: 21, status: "completada", notes: "" },
  { id: "BV-004", customerName: "Sarah Johnson", email: "sarah@pdx.or.us", phone: "+1 503 555-0123", nationality: "EE.UU.", bike: "Granada Cruiser", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Farol extra"], pickupDate: "2025-02-01", returnDate: "2025-02-03", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 3, total: 204, status: "completada", notes: "Pareja, tour por isletas" },
  { id: "BV-005", customerName: "Lucía Fernández", email: "lucia@mail.es", phone: "+34 612 345 678", nationality: "España", bike: "Tandem Amigos", bikeQty: 1, accessories: ["Casco", "Casco"], pickupDate: "2025-02-10", returnDate: "2025-02-10", pickupTime: "4:00 PM", returnTime: "6:00 PM", days: 1, total: 52, status: "completada", notes: "Paseo al atardecer" },
  { id: "BV-006", customerName: "Jean-Pierre Dubois", email: "jp@paris.fr", phone: "+33 6 1234 5678", nationality: "Francia", bike: "Mombacho MTB", bikeQty: 1, accessories: ["Casco", "Botella de agua"], pickupDate: "2025-02-14", returnDate: "2025-02-15", pickupTime: "7:00 AM", returnTime: "4:00 PM", days: 2, total: 100, status: "completada", notes: "Aventura en senderos" },
  { id: "BV-007", customerName: "Carlos Mendoza", email: "carlos@gmail.ni", phone: "+505 8888-1234", nationality: "Nicaragua", bike: "Colonial Urban", bikeQty: 1, accessories: [], pickupDate: "2025-02-20", returnDate: "2025-02-20", pickupTime: "9:00 AM", returnTime: "12:00 PM", days: 1, total: 20, status: "completada", notes: "Local, recorrido familiar" },
  { id: "BV-008", customerName: "Emma Williams", email: "emma@london.uk", phone: "+44 7700 900123", nationality: "Reino Unido", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Candado", "Silla para niños"], pickupDate: "2025-03-01", returnDate: "2025-03-02", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 2, total: 64, status: "completada", notes: "Con hija de 3 años" },
  { id: "BV-009", customerName: "Paolo Rossi", email: "paolo@roma.it", phone: "+39 333 456 7890", nationality: "Italia", bike: "Tandem Amigos", bikeQty: 1, accessories: ["Casco", "Casco", "Kit de picnic"], pickupDate: "2025-03-05", returnDate: "2025-03-05", pickupTime: "3:00 PM", returnTime: "6:00 PM", days: 1, total: 60, status: "completada", notes: "Luna de miel" },
  { id: "BV-010", customerName: "Lotte van der Berg", email: "lotte@amsterdam.nl", phone: "+31 6 1234 5678", nationality: "Holanda", bike: "Colonial Urban", bikeQty: 1, accessories: ["Casco"], pickupDate: "2025-03-10", returnDate: "2025-03-10", pickupTime: "10:00 AM", returnTime: "4:00 PM", days: 1, total: 22, status: "completada", notes: "" },
  { id: "BV-011", customerName: "Roberto Silva", email: "roberto@uol.com.br", phone: "+55 11 9876-5432", nationality: "Brasil", bike: "Mombacho MTB", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Botella", "Botella"], pickupDate: "2025-03-15", returnDate: "2025-03-17", pickupTime: "7:00 AM", returnTime: "6:00 PM", days: 3, total: 282, status: "completada", notes: "Grupo de aventura" },
  { id: "BV-012", customerName: "Kate Brown", email: "kate@sydney.au", phone: "+61 412 345 678", nationality: "Australia", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Candado"], pickupDate: "2025-03-20", returnDate: "2025-03-21", pickupTime: "9:00 AM", returnTime: "5:00 PM", days: 2, total: 54, status: "completada", notes: "" },
  { id: "BV-013", customerName: "Yuki Tanaka", email: "yuki@tokyo.jp", phone: "+81 90 1234 5678", nationality: "Japón", bike: "Colonial Urban", bikeQty: 1, accessories: ["Casco", "Farol extra"], pickupDate: "2025-04-01", returnDate: "2025-04-01", pickupTime: "10:00 AM", returnTime: "3:00 PM", days: 1, total: 22, status: "completada", notes: "Fotografía callejera" },
  { id: "BV-014", customerName: "María José Ramírez", email: "mj@gmail.gt", phone: "+502 5432-1098", nationality: "Guatemala", bike: "Granada Cruiser", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Botella", "Botella"], pickupDate: "2025-04-05", returnDate: "2025-04-07", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 3, total: 222, status: "completada", notes: "Amigas viajando juntas" },
  { id: "BV-015", customerName: "David Chen", email: "david@toronto.ca", phone: "+1 416 555-7890", nationality: "Canadá", bike: "Mombacho MTB", bikeQty: 1, accessories: ["Casco", "Botella de agua", "Farol extra"], pickupDate: "2025-04-10", returnDate: "2025-04-11", pickupTime: "7:00 AM", returnTime: "4:00 PM", days: 2, total: 86, status: "completada", notes: "" },
  // Active/Recent
  { id: "BV-016", customerName: "Laura Martínez", email: "laura@mail.mx", phone: "+52 55 1234-5678", nationality: "México", bike: "Tandem Amigos", bikeQty: 1, accessories: ["Casco", "Casco"], pickupDate: "2025-07-10", returnDate: "2025-07-10", pickupTime: "4:00 PM", returnTime: "6:00 PM", days: 1, total: 52, status: "en_curso", notes: "Llegando hoy" },
  { id: "BV-017", customerName: "Max Schneider", email: "max@berlin.de", phone: "+49 171 9876-5432", nationality: "Alemania", bike: "Mombacho MTB", bikeQty: 2, accessories: ["Casco", "Casco", "Candado", "Botella", "Botella", "Kit de picnic"], pickupDate: "2025-07-11", returnDate: "2025-07-13", pickupTime: "7:00 AM", returnTime: "6:00 PM", days: 3, total: 320, status: "confirmada", notes: "Grupo de 2, tour extenso" },
  { id: "BV-018", customerName: "Isabella Costa", email: "isabella@saopaulo.br", phone: "+55 11 9123-4567", nationality: "Brasil", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Candado", "Silla para niños"], pickupDate: "2025-07-12", returnDate: "2025-07-12", pickupTime: "9:00 AM", returnTime: "1:00 PM", days: 1, total: 32, status: "confirmada", notes: "Con bebé" },
  { id: "BV-019", customerName: "James Wilson", email: "james@auckland.nz", phone: "+64 21 123 4567", nationality: "Nueva Zelanda", bike: "Colonial Urban", bikeQty: 1, accessories: ["Casco"], pickupDate: "2025-07-09", returnDate: "2025-07-09", pickupTime: "10:00 AM", returnTime: "4:00 PM", days: 1, total: 22, status: "cancelada", notes: "Canceló por lluvia" },
  { id: "BV-020", customerName: "Sophie Laurent", email: "sophie@lyon.fr", phone: "+33 6 9876 5432", nationality: "Francia", bike: "Granada Cruiser", bikeQty: 1, accessories: ["Casco", "Botella de agua"], pickupDate: "2025-07-13", returnDate: "2025-07-14", pickupTime: "8:00 AM", returnTime: "5:00 PM", days: 2, total: 52, status: "confirmada", notes: "" },
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

export const useAdminStore = create<AdminState>((set) => ({
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
}));
