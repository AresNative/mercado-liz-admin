"use client";
import { menuItems, navItems, storeItems, userFunct } from "@/constants/aside";
import {
  AlignJustify,
  Clock3,
  Moon,
  PackagePlus,
  Sun,
  TriangleAlert,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Dropdown } from "./drop-down";
import { Item } from "./item";
export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Detecta clics fuera del aside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    // Agrega el evento cuando el sidebar está abierto
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Limpieza del evento cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);
  //configuracion de estado 'theme'
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);
  // Alterna el tema y actualiza la clase en <html>
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme); // Guarda el tema seleccionado en almacenamiento local
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        aria-controls="default-sidebar"
        type="button"
        className="z-20 fixed right-0 inline-flex h-fit p-2 mt-3 me-3 text-sm text-gray-500 rounded-lg md:hidden bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <AlignJustify strokeWidth={1.30} />
      </button>


      <aside
        ref={sidebarRef}
        id="default-sidebar"
        className={`md:top-16 fixed top-0 left-0 z-40 w-64 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="md:h-[94vh] h-screen flex flex-col px-3 py-4 overflow-y-auto bg-slate-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item, index) => (
              <Item
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                badge={item.badge}
                onClick={item.onClick}
              />
            ))}
          </ul>
          <ul className="pt-4 pb-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">

            {/* Uso del nuevo componente Dropdown */}
            <Dropdown label="Tienda">
              {storeItems.map((item, index) => (
                <Item
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  badge={item.badge}
                  onClick={item.onClick}
                />
              ))}
            </Dropdown>
          </ul>
          <ul className="md:hidden pt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item, index) => (
              <Item
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                badge={item.badge}
                onClick={item.onClick}
              />
            ))}
          </ul>

          <ul className="pt-4 mt-auto space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            {userFunct.map((item, index) => (
              <Item
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                badge={item.badge}
                onClick={item.onClick}
              />
            ))}
          </ul>
          <ul className="flex pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="inline-flex h-fit p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex h-fit p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <TriangleAlert className="h-5 w-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex h-fit p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <Clock3 className="h-5 w-5" />
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex h-fit p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <PackagePlus className="h-5 w-5" />
            </button>
          </ul>
        </div>
      </aside>
    </>
  );
}
