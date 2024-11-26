import SideBar from '@/components/ui/side-bar';
import Navbar from '@/components/ui/nav-bar';

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
                <section className='p-2 pt-20 md:ml-64'>
                    {children}
                </section>
            </main>
        </div>
    );
};

export default DashboardLayout;
