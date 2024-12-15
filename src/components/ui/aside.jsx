"use client";
import { menuItems, navItems, storeItems, userFunct } from "@/constants/aside";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Dropdown } from "./emerging/drop-down";
import { Item } from "./item";

export default function SideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [theme, setTheme] = useState("light");
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(!isSidebarOpen); // Mostrar/Ocultar en móvil
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed); // Colapsar en escritorio
    }
  };
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarCollapsed(false)
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  },[sidebarRef])
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-50 dark:bg-gray-800 transition-all p-2
                  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                  ${isSidebarCollapsed ? "w-20" : "w-64"} md:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="flex flex-col h-full gap-2">
        <button
          onClick={toggleSidebar}
          className="fixed top-5 -right-7 mt-4 mb-2 mx-auto p-2 bg-slate-300 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

        <ul className="space-y-2 font-medium">
          {menuItems.map((item, index) => (
            <Item
              key={index}
              icon={item.icon}
              label={isSidebarCollapsed ? "" : item.label}
              href={item.href}
              badge={isSidebarCollapsed ? "" : item.badge}
              onClick={item.onClick}
            />
          ))}
        </ul>

        <ul className="pt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
          <Dropdown label={isSidebarCollapsed ? "" : "Tienda"}>
            {storeItems.map((item, index) => (
              <Item
                key={index}
                icon={item.icon}
                label={isSidebarCollapsed ? "" : item.label}
                href={item.href}
                badge={isSidebarCollapsed ? "" : item.badge}
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
                label={isSidebarCollapsed ? "" : item.label}
                href={item.href}
                badge={isSidebarCollapsed ? "" : item.badge}
                onClick={item.onClick}
              />
            ))}
          </ul>

        <ul className="mt-auto pt-2 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
          {userFunct.map((item, index) => (
            <Item
              key={index}
              icon={item.icon}
              label={isSidebarCollapsed ? "" : item.label}
              href={item.href}
              badge={isSidebarCollapsed ? "" : item.badge}
              onClick={item.onClick}
            />
          ))}
        </ul>

        <div className="flex pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}