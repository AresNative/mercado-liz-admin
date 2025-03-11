export default function Footer() {
    const date = new Date().getFullYear();
    return (
        <footer className="lg:fixed md:absolute bottom-0 left-0 w-full px-6 py-3 sm:px-8 shadow-md bg-white dark:bg-zinc-800 backdrop-blur-lg">
            <div className="flex items-center justify-between flex-wrap gap-y-2">
                {/* Logo y Derechos */}
                <div className="flex items-center gap-x-2">
                    <img
                        alt="Logo"
                        src="logo.png"
                        className="h-8 w-auto"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-200">
                        © {date} Mercado Liz. Todos los derechos reservados.
                    </span>
                </div>

                {/* Enlaces */}
                <div className="flex items-center gap-x-4">
                    <a href="#" className="text-sm text-gray-500 dark:text-gray-200 hover:text-indigo-600 transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="text-sm text-gray-500 dark:text-gray-200 hover:text-indigo-600 transition-colors">
                        Terms
                    </a>
                </div>
            </div>
        </footer>
    );
}
