import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary-900 text-primary-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <span className="text-2xl font-bold text-white mb-4 block">IT Innovation</span>
                        <p className="text-sm text-primary-200 mb-4">
                            Empowering students through innovation, technology, and leadership. The official portal for IT Department events and activities.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-primary-300 transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-primary-300 transition-colors">About Us</Link></li>
                            <li><Link to="/events" className="hover:text-primary-300 transition-colors">All Events</Link></li>
                            <li><Link to="/members" className="hover:text-primary-300 transition-colors">Our Team</Link></li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Departments</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about#iic" className="hover:text-primary-300 transition-colors">IIC</Link></li>
                            <li><Link to="/about#emdc" className="hover:text-primary-300 transition-colors">EMDC</Link></li>
                            <li><Link to="/about#association" className="hover:text-primary-300 transition-colors">IT Association</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm text-primary-200">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-2 flex-shrink-0 text-primary-300" />
                                <span>Department of Information Technology, Some College Name, City, State - 123456</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-2 flex-shrink-0 text-primary-300" />
                                <span>contact@it-innovation.edu</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-2 flex-shrink-0 text-primary-300" />
                                <span>+91 123 456 7890</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-primary-800 mt-8 pt-8 text-center text-sm text-primary-300">
                    <p>&copy; {new Date().getFullYear()} IT Department. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
