import { ReactNode, useEffect, useState } from "react";
import { cookies } from "next/headers";
import SideBar from "@/components/ui/aside";
import Navbar from "@/components/ui/navbar";
import Providers from "@/hooks/providers";
import { DashboardLayoutProps } from "@/interfaces/render-page";
import { getLocalStorageItem } from "@/hooks/localStorage";

// Función para obtener cookies en el lado del servidor
const getCookieValue = async (cookieName: string) => {
    try {
        const cookieStore = await cookies(); // Acceso síncrono a cookies
        const cookie = cookieStore.get(cookieName);
        return cookie ? cookie.value : "";
    } catch (error) {
        console.error("Error obteniendo cookie:", error);
        return undefined;
    }
};

const DashboardLayout = async ({ admin, user }: DashboardLayoutProps) => {
    // Obtener el rol desde cookies o localStorage (lado del servidor)
    const userRoleFromCookie = await getCookieValue("user-role");

    // Componente cliente para manejar localStorage
    const ClientSideRoleChecker = () => {
        const [userRole, setUserRole] = useState<string | null>(null);

        useEffect(() => {
            // Revisar primero las cookies obtenidas desde el servidor
            if (userRoleFromCookie) {
                setUserRole(userRoleFromCookie);
            } else {
                // Si no hay cookies, revisar localStorage
                const roleFromLocalStorage = getLocalStorageItem("user-role");
                setUserRole(roleFromLocalStorage || null);
            }
        }, []);

        // Contenido basado en roles
        const roleContent: Record<string, ReactNode> = {
            admin,
            user,
        };

        const renderContent = roleContent[userRole || ""] || (
            <div className="text-center text-red-500">
                <h2>Acceso no autorizado</h2>
                <p>No tienes permiso para acceder a este contenido.</p>
            </div>
        );

        return (
            <Providers>
                <div className="p-4 pt-20 md:ml-24">{renderContent}</div>
            </Providers>
        );
    };

    // Renderizado del layout principal
    return (
        <div className="flex h-screen">
            <SideBar />
            <main className="w-full">
                <Navbar />
                <ClientSideRoleChecker />
            </main>
        </div>
    );
};

export default DashboardLayout;
