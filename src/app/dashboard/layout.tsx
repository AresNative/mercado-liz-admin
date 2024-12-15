import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { DashboardLayoutProps } from '@/interfaces/render-page';
import { getLocalStorageItem } from '@/hooks/localStorage';
import SideBar from '@/components/ui/aside';
import Navbar from '@/components/ui/navbar';
import Providers from '@/hooks/providers';

const DashboardLayout = async ({ admin, user }: DashboardLayoutProps) => {
    // Función para obtener el rol del usuario desde las cookies en el lado del servidor
    const getCookie = async (cookieName: string) => {
        const cookieStore = await cookies();
        const cookie = cookieStore.get(cookieName);
        return cookie ? cookie.value : "";
    };
    const userData = () => getLocalStorageItem('user-role');
    // Obtenemos el rol del usuario directamente desde las cookies (ya que estamos en el lado del servidor)
    const userRole = userData.token // ?? await getCookie('user-role');
    console.log(userRole);

    // Contenido a mostrar según el rol del usuario
    const roleContent: Record<string, ReactNode> = {
        admin: admin,
        user: user,
    };

    // Renderizado en el servidor
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <SideBar />
            <main className='w-full'>
                <Navbar />
                {/* Muestra el contenido según el rol o un mensaje por defecto */}
                <section className='p-2 pt-20 md:ml-24'>
                    <Providers>
                        {userRole && roleContent[userRole] ? roleContent[userRole] : <>Acceso no autorizado</>}
                    </Providers>
                </section>
            </main>
        </div>
    );
};

export default DashboardLayout;