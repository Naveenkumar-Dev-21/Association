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
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            IT Innovation
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group">
                                {link.dropdown ? (
                                    <button
                                        className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                                        onMouseEnter={() => setActiveDropdown(link.name)}
                                    >
                                        {link.name}
                                        <ChevronDown className="ml-1 w-4 h-4" />
                                    </button>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                )}

                                {/* Dropdown Menu */}
                                {link.dropdown && (
                                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                                        <div className="py-1">
                                            {link.dropdown.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.path}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Link to="/notifications" className="text-gray-600 hover:text-blue-600">
                            <Bell className="w-5 h-5" />
                        </Link>

                        <Link
                            to="/admin/login"
                            className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                        >
                            Admin Login
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <div key={link.name}>
                                {link.dropdown ? (
                                    <div className="space-y-1">
                                        <div className="px-3 py-2 text-base font-medium text-gray-700 font-bold">
                                            {link.name}
                                        </div>
                                        {link.dropdown.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 pl-6"
                                                onClick={closeMenu}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={closeMenu}
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <Link
                            to="/notifications"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            onClick={closeMenu}
                        >
                            Notifications
                        </Link>
                        <Link
                            to="/admin/login"
                            className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                            onClick={closeMenu}
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
