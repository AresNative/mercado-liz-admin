import SideBar from '@/components/ui/template/side-bar';
import Navbar from '@/components/ui/template/nav-bar';
import { Providers } from '@/actions/providers';

const DashboardLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <SideBar />
            <main className='w-full'>
                <Navbar />
                {/* Muestra el contenido según el rol o un mensaje por defecto */}
                <section className='p-2 pt-20 md:ml-24'>
                    <Providers>
                        {children}
                    </Providers>
                </section>
            </main>
        </div>
    );
};

export default DashboardLayout;
