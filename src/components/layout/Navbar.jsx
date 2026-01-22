import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            {/* ================= Institutional Top Strip ================= */}
            <div className="w-full">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2">

                    <div className="flex items-center gap-4">

                        {/* Left: College logo + text */}
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/kongu logo2.png"
                                alt="Kongu Engineering College Logo"
                                className="h-12 md:h-14 w-auto object-contain"
                            />

                            <div className="flex flex-col">
                                <h1 className="text-sm md:text-xl font-bold text-blue-900 uppercase tracking-wide leading-tight">
                                    Kongu Engineering College (Autonomous)
                                </h1>
                                <p className="hidden md:block text-xs text-gray-600 font-medium">
                                    Affiliated to Anna University | Accredited by NAAC with A++ Grade
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Transform Yourself logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/KECL.jpg"
                            alt="Transform Yourself"
                            className="h-10 md:h-12 w-auto object-contain hidden sm:block"
                        />
                    </div>
                </div>

                {/* Department Bar with Integrated Toggle - Compact GitHub Style */}
                <div className="bg-slate-900 text-white py-2.5 px-3 shadow-md">
                    <div className="flex items-center gap-2">
                        {/* Unified Sidebar Toggle - Left aligned, compact */}
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded hover:bg-slate-800 transition-colors focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <Menu className="w-5 h-5 text-white" />
                        </button>

                        <span className="text-sm md:text-base font-bold tracking-wider uppercase">
                            Information Technology
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
