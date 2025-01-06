import {
  ChartCandlestick,
  CircleUserRound,
  FolderArchive,
  Inbox,
  LayoutDashboard,
  ListTodo,
  LogIn,
  LogOut,
  ScanBarcode,
  ScanText,
  ScrollText,
  Settings,
  Store,
  Truck,
  UsersRound,
} from "lucide-react";
const handleLogout = () => {
  // Eliminar cookies estableciendo fechas de expiración pasadas
  document.cookie =
    "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "user-role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

// Lista de ítems principales
export const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ScrollText, label: "Facturacion", href: "/facturacion" },
  {
    icon: ChartCandlestick,
    label: "Tablas",
    href: "/tablas",
    badge: { text: "Pro", color: "fuchsia" },
  },
  {
    icon: Inbox,
    label: "Mensajes",
    href: "/mensajes",
    badge: { text: "12", color: "indigo" },
  },
  {
    icon: ListTodo,
    label: "Tareas",
    href: "/tareas",
    badge: { text: "3", color: "purple" },
  },
  { icon: UsersRound, label: "Usuarios", href: "/usuarios" },
];
// Lista de ítems principales
export const badgeItems = [
  { text: "Sprint 3", color: "purple" },
  { text: "Backend", color: "fuchsia" },
  { text: "In Progress", color: "indigo" },
];
// Lista de ítems principales
export const navItems = [
  { icon: Settings, label: "Ajustes", href: "#" },
  { icon: CircleUserRound, label: "Perfil", href: "/perfil" },
];

export const storeItems = [
  { icon: Store, label: "Mapa de tienda", href: "#" },
  { icon: FolderArchive, label: "Archivo muerto", href: "archivo-muerto" },
  { icon: Truck, label: "Envios", href: "#" },
  { icon: ScanBarcode, label: "Productos", href: "#" },
  { icon: ScanText, label: "Listas", href: "#" },
];

// Funciones de usuario
export const userFunct = [
  { icon: LogIn, label: "Inicio de sesión", href: "#" },
  { icon: LogOut, label: "Cerrar sesión", href: "/", onclick: handleLogout },
];
