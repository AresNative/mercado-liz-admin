// components/NavBar.js
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthModal from "../func/log-in";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Menu, X } from "lucide-react"; // Iconos de hamburguesa
import { links } from "@/constant/router";

const NavBar = () => {
  const router = useRouter(); // Ruta activa
  const { theme, setTheme } = useTheme(); // Configurar tema
  const [mounted, setMounted] = useState(false); // Control del montaje
  const [isOpen, setIsOpen] = useState(false); // Control del menú móvil

  // Verificar si el componente se ha montado (para evitar errores SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevenir renderizado SSR

  return (
    <nav className="shadow-md bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              Administración
            </Link>
          </div>

          {/* Menú de escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    router.pathname === link.href
                      ? "bg-blue-600 text-white"
                      : "text-gray-800 dark:text-gray-200 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            {/* Cambio de tema */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="px-4 py-2 rounded-md"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <AuthModal />
          </div>

          {/* Botón hamburguesa (visible en móviles) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pb-4 space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`block px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  router.pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-800 dark:text-gray-200 hover:text-blue-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </span>
            </Link>
          ))}

          {/* Cambio de tema en móvil */}
          <button
            onClick={() => {
              setTheme(theme === "light" ? "dark" : "light");
              setIsOpen(false);
            }}
            className="flex items-center px-3 py-2 rounded-md space-x-2"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="text-sm">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          </button>

          <AuthModal />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
