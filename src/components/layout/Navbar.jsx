import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        {
            name: 'Members',
            dropdown: [
                { name: 'IIC Members', path: '/members/iic' },
                { name: 'EMDC Members', path: '/members/emdc' },
                { name: 'Association Members', path: '/members/association' },
            ]
        },
        {
            name: 'Events',
            dropdown: [
                { name: 'IIC Events', path: '/events/iic' },
                { name: 'EMDC Events', path: '/events/emdc' },
                { name: 'IT Events', path: '/events/it' },
            ]
        },
    ];

    return (
        <header className="sticky top-0 z-50">

            {/* ================= Institutional Top Strip ================= */}
            <div className="bg-white border-b border-gray-200 py-2 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

                    {/* Left: College logo + text */}
                    <div className="flex items-center gap-4">
                        <img
                            src="public/images/kongu logo2.png"
                            alt="Kongu Engineering College Logo"
                            className="h-14 w-auto object-contain"
                        />

                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-blue-900 uppercase tracking-wide leading-tight">
                                Kongu Engineering College (Autonomous)
                            </h1>
                            <p className="text-xs text-gray-600 font-medium">
                                Affiliated to Anna University | Accredited by NAAC with A++ Grade
                            </p>
                            <p className="text-xs text-gray-500">
                                Perundurai, Erode - 638060, Tamilnadu, India
                            </p>
                        </div>
                    </div>

                    {/* Right: Transform Yourself logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="public/images/KECL.jpg"
                            alt="Transform Yourself"
                            className="h-12 w-auto object-contain hidden lg:block"
                        />
                    </div>
                </div>
            </div>

            {/* ================= Main Navigation ================= */}
            <nav className="bg-slate-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14 items-center">

                        {/* Department Name */}
                        <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                            <span className="text-lg font-bold text-white tracking-wide uppercase">
                                Information Technology
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <div key={link.name} className="relative group">
                                    {link.dropdown ? (
                                        <button
                                            className="px-4 py-2 flex items-center text-gray-300 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors uppercase tracking-wider"
                                            onMouseEnter={() => setActiveDropdown(link.name)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            {link.name}
                                            <ChevronDown className="ml-1 w-3 h-3" />
                                        </button>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-md text-sm font-medium transition-colors uppercase tracking-wider"
                                        >
                                            {link.name}
                                        </Link>
                                    )}

                                    {/* Dropdown */}
                                    {link.dropdown && activeDropdown === link.name && (
                                        <div className="absolute left-0 w-56 shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 border-t-2 border-blue-900">
                                            <div className="py-1">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.path}
                                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-blue-900 border-b border-gray-50 last:border-0"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <Link to="/notifications" className="p-2 text-gray-300 hover:text-white hover:bg-slate-800 rounded-md">
                                <Bell className="w-5 h-5" />
                            </Link>

                            <Link
                                to="/admin/login"
                                className="ml-4 px-4 py-1.5 rounded bg-blue-700 text-white text-xs font-bold uppercase hover:bg-blue-600 transition-colors tracking-wide"
                            >
                                Login
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={toggleMenu}
                                className="text-gray-300 hover:text-white focus:outline-none"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ================= Mobile Menu ================= */}
                {isOpen && (
                    <div className="md:hidden bg-slate-800 border-t border-slate-700">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    {link.dropdown ? (
                                        <div className="space-y-1">
                                            <div className="px-3 py-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                                {link.name}
                                            </div>
                                            {link.dropdown.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700 pl-6"
                                                    onClick={closeMenu}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <Link
                                            to={link.path}
                                            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700 uppercase tracking-wider"
                                            onClick={closeMenu}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            <Link
                                to="/notifications"
                                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700 uppercase tracking-wider"
                                onClick={closeMenu}
                            >
                                Notifications
                            </Link>

                            <Link
                                to="/admin/login"
                                className="block px-3 py-2 rounded-md text-sm font-medium text-blue-400 hover:text-blue-300 uppercase tracking-wider"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
