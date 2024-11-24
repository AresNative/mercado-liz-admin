import Logout from '@/components/ux/logout';
import { CookieStore } from '@/interfaces/cookies';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    admin: ReactNode;
    user: ReactNode;
}


const DashboardLayout = ({ admin, user }: DashboardLayoutProps) => {
    // Función para obtener el rol del usuario desde las cookies
    const getCookie = async (cookieName: string) => {
        const cookieStore = await cookies();
        const cookie = cookieStore.get(cookieName);
        return cookie ? cookie.value : undefined;
    };
    // Obtenemos el rol del usuario
    const userRole = getCookie('user-role');
    console.log(userRole); // Puede ser 'admin', 'user' o undefined si no está presente


    // Contenido a mostrar según el rol del usuario
    const roleContent = {
        admin: admin,
        user: user,
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ width: '20%', backgroundColor: '#f0f0f0' }}>
                <Logout />
            </aside>
            <main style={{ width: '80%', padding: '20px' }}>
                {/* Muestra el contenido según el rol o un mensaje por defecto */}
                {roleContent[userRole] || <>nada</>}
            </main>
        </div>
    );
};

export default DashboardLayout;
