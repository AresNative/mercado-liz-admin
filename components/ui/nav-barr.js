// components/NavBar.js
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthModal from "../func/log-in";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NavBar = () => {
  const router = useRouter(); // Ruta activa
  const { theme, setTheme } = useTheme(); // Configurar tema
  const [mounted, setMounted] = useState(false); // Control del montaje

  const links = [
    { href: "/", label: "Inicio" },
    { href: "/Reports", label: "Reportes" },
    { href: "/ToDo", label: "Tareas" },
  ];

  // Verificar si el componente se ha montado (para evitar errores SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevenir renderizado SSR

  return (
    <nav className="bg-background shadow-md dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 dark:text-white"
            >
              Administracion
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    router.pathname === link.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <AuthModal />
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
