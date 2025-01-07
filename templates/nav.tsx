'use client';
import { navigation } from '@/utils/constants/router';
import { Menu } from 'lucide-react';
import { useState } from 'react';



export default function Nav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

    return (
        <header className="absolute inset-x-0 top-0 z-50 bg-transparent">
            <nav className="bg-white backdrop-blur-sm bg-opacity-10">
                <div className="max-w-7xl mx-auto px-6 py-4 sm:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                alt="Logo"
                                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                            <div className="hidden sm:flex space-x-6 ml-10">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="sm:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                type="button"
                                aria-label="Toggle menu"
                                className="text-gray-900 hover:text-indigo-600 focus:outline-none"
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
                        className="relative bg-white w-full rounded-lg max-w-lg mx-auto p-6 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="mobile-menu-title" className="sr-only">
                            Mobile Menu
                        </h2>
                        <div className="flex justify-end mb-4">
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-gray-900 hover:text-indigo-600 focus:outline-none text-xl"
                                aria-label="Close menu"
                            >
                                &times;
                            </button>
                        </div>
                        <ul className="flex flex-col space-y-4">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </dialog>
            )}
        </header>
    );
}
