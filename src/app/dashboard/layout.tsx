import Logout from '@/components/ux/logout';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';

interface DashboardLayoutProps {
    admin: ReactNode;
    user: ReactNode;
}

const DashboardLayout = ({ admin, user }: DashboardLayoutProps) => {
    // Función para obtener el rol del usuario desde las cookies en el lado del servidor
    const getCookie = async (cookieName: string) => {
        const cookieStore = await cookies();  // Acceso sincrónico a las cookies
        const cookie = cookieStore.get(cookieName);
        return cookie ? cookie.value : undefined;
    };

    // Obtenemos el rol del usuario directamente desde las cookies (ya que estamos en el lado del servidor)
    const userRole = getCookie('user-role');
    console.log(userRole); // Puede ser 'admin', 'user' o undefined si no está presente

    // Contenido a mostrar según el rol del usuario
    const roleContent: any = {
        admin: admin,
        user: user,
    };

    // Renderizado en el servidor
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <aside style={{ width: '20%', backgroundColor: '#f0f0f0' }}>
                <Logout />
            </aside>
            <main style={{ width: '80%', padding: '20px' }}>
                {/* Muestra el contenido según el rol o un mensaje por defecto */}
                {userRole ? roleContent[userRole] : <>Acceso no autorizado</>}
            </main>
        </div>
    );
};

export default DashboardLayout;
