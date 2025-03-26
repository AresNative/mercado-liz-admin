'use client';
import { navigation } from '@/utils/constants/router';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/functions/local-storage';
import { Menu, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Nav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState("light");
    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
    useEffect(() => {
        const savedTheme = getLocalStorageItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        setLocalStorageItem("theme", newTheme);
    };
    return (
        <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
            <nav className="bg-white dark:bg-zinc-800 backdrop-blur-sm bg-opacity-10">
                <div className="mx-auto px-6 py-4 sm:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <div className="h-8 w-8 rounded-br-lg rounded-tl-lg bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                                    <span className='pl-2 pt-4'>ML</span>
                                </div>
                            </Link>
                            <div className="hidden sm:flex space-x-6 ml-10">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 bg-zinc-100 rounded-lg hover:bg-zinc-200 dark:bg-zinc-600 dark:hover:bg-zinc-700"
                        >
                            {theme === "light" ? <Moon className="h-5 w-5 text-gray-900 dark:text-white" /> : <Sun className="h-5 w-5 text-gray-900 dark:text-white" />}
                        </button>
                        <div className="sm:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                type="button"
                                aria-label="Toggle menu"
                                className="text-gray-900 dark:text-white hover:text-indigo-600 focus:outline-none"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {mobileMenuOpen && (
                <dialog
                    open
                    className="sm:hidden w-screen h-screen fixed inset-0 z-50 backdrop-blur-lg bg-black bg-opacity-20 flex items-center justify-center"
                    aria-labelledby="mobile-menu-title"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <div
                        className="relative bg-white dark:bg-zinc-800 w-full rounded-lg max-w-lg mx-auto p-6 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="mobile-menu-title" className="sr-only">
                            Mobile Menu
                        </h2>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-900 dark:text-white hover:text-indigo-600 focus:outline-none text-xl"
                                aria-label="Close menu"
                            >
                                &times;
                            </button>
                        </div>
                        <ul className="flex flex-col space-y-4">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={toggleTheme}
                            className="p-2 bg-zinc-100 rounded-lg hover:bg-zinc-200 dark:bg-zinc-600 dark:hover:bg-zinc-700"
                        >
                            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>
                    </div>
                </dialog>
            )}
        </header>
    );
}
