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
    { href: "/Reports", label: "Reports" },
    { href: "/Tasks", label: "Tasks" },
  ];

  // Verificar si el componente se ha montado (para evitar errores SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevenir renderizado SSR

  return (
    <nav className="shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              Administracion
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    router.pathname === link.href
                      ? "bg-blue-600 text-white hover:text-blue"
                      : "hover:text-blue"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="px-4 py-2 rounded-md"
            >
              {theme === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
            </button>
            <AuthModal />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
