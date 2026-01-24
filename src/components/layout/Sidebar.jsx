import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Info, Users, Calendar, FileText,
    CalendarDays, Target, TrendingUp, FileBarChart,
    Bell, Lock, ChevronDown, ChevronRight, Rocket,
    X
} from 'lucide-react';

const Sidebar = ({ sidebarState, closeSidebar }) => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState({});

    // Close sidebar on route change
    useEffect(() => {
        closeSidebar();
    }, [location.pathname]);

    const toggleSubmenu = (e, menuName) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
        {
            name: "About", icon: Info,
            submenu: [
                { name: "About IEF", path: "/about#ief" },
                { name: "About IIC", path: "/about#iic" },
                { name: "About EMDC", path: "/about#emdc" },
                { name: "About IT Association", path: "/about#association" },
            ]
        },
        {
            name: "Members", icon: Users,
            submenu: [
                { name: "IIC Members", path: "/members/iic" },
                { name: "EMDC Members", path: "/members/emdc" },
                { name: "Association Members", path: "/members/association" },
            ]
        },
        {
            name: "Events", icon: Calendar,
            submenu: [
                { name: "IIC Events", path: "/events/iic" },
                { name: "EMDC Events", path: "/events/emdc" },
                { name: "IT Events", path: "/events/it" },
            ]
        },
        {
            name: "Policies", icon: FileText,
            submenu: [
                { name: "KISP 2020", path: "/pdfs/kisp2020.pdf", isPdf: true },
                { name: "TN Startup Policy", path: "/pdfs/STARTUP-TN-Policy.pdf", isPdf: true },
                { name: "NISP 2019", path: "/pdfs/nisp2020.pdf", isPdf: true },
            ]
        },
        {
            name: "Year Plan", icon: CalendarDays,
            submenu: [
                { name: "Calendar of Activities", path: "/pdfs/calendar_activities2024-2025.pdf", isPdf: true },
                { name: "Celebrations", path: "/pdfs/celebration_activities.pdf", isPdf: true },
                { name: "KEC Year Plan 24-25", path: "/pdfs/year_plan2024-2025.pdf", isPdf: true },
            ]
        },
        {
            name: "IIC Activities", icon: Rocket,
            submenu: [
                { name: "2024 - 2025", path: "" },
                { name: "2023 - 2024", path: "/pdfs/iicactivities_2023_24.pdf", isPdf: true },
                { name: "2022 - 2023", path: "/pdfs/iic_2022_23.pdf", isPdf: true },
                { name: "2021 - 2022", path: "/pdfs/iic_2021_22.pdf", isPdf: true },
                { name: "2020 - 2021", path: "/pdfs/iic_2020_21.pdf", isPdf: true },
                { name: "2019 - 2020", path: "/pdfs/iic_2019_20.pdf", isPdf: true },
                { name: "2018 - 2019", path: "/pdfs/iic_2018_19.pdf", isPdf: true },
                {
                    name: "Overall Year",
                    submenu: [
                        { name: "2023 - 2024", path: "/pdfs/OverallReprt_Sep2023-Aug2024.pdf", isPdf: true },
                        { name: "2022 - 2023", path: "/pdfs/OverallReprt_Sep2022-Aug2023.pdf", isPdf: true },
                        { name: "2021 - 2022", path: "/pdfs/OverallReprt_Sep2021-Aug2022.pdf", isPdf: true },
                    ]
                },
            ]
        },
        {
            name: "EMDC Activities", icon: TrendingUp,
            submenu: [
                { name: "2024 - 2025", path: "" },
                { name: "2023 - 2024", path: "/pdfs/EMDC_2023_24.pdf", isPdf: true },
                { name: "2022 - 2023", path: "/pdfs/EMDC_2022_23.pdf", isPdf: true },
                { name: "2021 - 2022", path: "/pdfs/EMDC_2021_22.pdf", isPdf: true },
                { name: "2020 - 2021", path: "/pdfs/EMDC_2020_21.pdf", isPdf: true },
                { name: "2019 - 2020", path: "/pdfs/EMDC_2019_20.pdf", isPdf: true },
            ]
        },
        {
            name: "Spark Fund", icon: Target,
            submenu: [
                { name: "Application Form", path: "/pdfs/Sparkfund_Application.pdf", isPdf: true },
                { name: "Guidelines", path: "/pdfs/Spark Fund_Guidelines.pdf", isPdf: true },
                { name: "Sanctioned Projects", path: "/pdfs/Spark Fund_Project consolidated 261023.pdf", isPdf: true },
            ]
        },
        {
            name: "Annual Reports", icon: FileBarChart,
            submenu: [
                { name: "2024 - 2025", path: "" },
                { name: "2023 - 2024", path: "/pdfs/AnnualReport_2023-24.pdf", isPdf: true },
                { name: "2022 - 2023", path: "/pdfs/AnnualReport_2022-23.pdf", isPdf: true },
                { name: "2021 - 2022", path: "/pdfs/AnnualReport_2021-2022.pdf", isPdf: true },
                { name: "2020 - 2021", path: "/pdfs/AnnualReport_2020-21.pdf", isPdf: true },
            ]
        },
        { name: "Notifications", icon: Bell, path: "/notifications" },
        { name: "Admin Login", icon: Lock, path: "/admin/login" },
    ];

    const isOpen = sidebarState === 'expanded';

    const renderSubmenu = (submenu, level = 0) => (
        <div className="bg-blue-900/10 border-l border-blue-800/30 ml-12 my-1 rounded-lg overflow-hidden">
            {submenu.map((item) => (
                <div key={item.name}>
                    {item.submenu ? (
                        <>
                            <div className="px-4 py-2 text-slate-400 text-xs font-bold uppercase tracking-widest opacity-80 mt-2">
                                {item.name}
                            </div>
                            {renderSubmenu(item.submenu, level + 1)}
                        </>
                    ) : (
                        <LinkOrAnchor
                            item={item}
                            className={`block px-4 py-2.5 text-slate-300 hover:bg-blue-600/10 hover:text-white transition-colors text-sm ${location.pathname === item.path ? 'text-blue-400 font-medium bg-blue-600/5' : ''}`}
                            onClick={closeSidebar}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    function LinkOrAnchor({ item, className, onClick }) {
        if (item.isPdf) {
            return (
                <a href={item.path} target="_blank" rel="noopener noreferrer" className={className}>
                    <div className="flex items-center gap-4">
                        {item.icon && <item.icon size={18} className="text-slate-500" />}
                        <span>{item.name}</span>
                    </div>
                </a>
            );
        }
        return (
            <Link to={item.path} className={className} onClick={onClick}>
                <div className="flex items-center gap-4">
                    {item.icon && <item.icon size={18} className="text-slate-500" />}
                    <span>{item.name}</span>
                </div>
            </Link>
        );
    }

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 pointer-events-none ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
                    }`}
                onClick={closeSidebar}
            />

            {/* Drawer Sidebar - Matte Dark Blue Theme */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-80 bg-[#0b1220]/95 backdrop-blur-sm text-slate-200 transition-transform duration-300 ease-in-out border-r border-blue-800/40 shadow-2xl shadow-blue-900/40 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header with Logo Placeholder */}
                    <div className="flex items-center justify-center px-6 py-5 border-b border-blue-800/30">
                        <img
                            src="/images/image-removebg-preview.png"
                            alt="Logo"
                            className="h-12 w-auto object-contain"
                        />
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 py-6 px-4 space-y-2">
                        {menuItems.map(item => (
                            <div key={item.name} className="space-y-1">
                                {item.submenu ? (
                                    <>
                                        <button
                                            onClick={(e) => toggleSubmenu(e, item.name)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${expandedMenus[item.name] ? 'bg-blue-600/10 text-white border border-blue-800/30' : 'hover:bg-blue-600/5 text-slate-300 hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon size={22} className={expandedMenus[item.name] ? 'text-blue-400' : 'text-blue-500'} />
                                                <span className="font-semibold">{item.name}</span>
                                            </div>
                                            {expandedMenus[item.name] ? <ChevronDown size={18} className="text-blue-400" /> : <ChevronRight size={18} className="opacity-40" />}
                                        </button>
                                        {expandedMenus[item.name] && renderSubmenu(item.submenu)}
                                    </>
                                ) : (
                                    <LinkOrAnchor
                                        item={item}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${location.pathname === item.path ? 'bg-blue-600/15 text-blue-400 border border-blue-800/40' : 'hover:bg-blue-600/5 text-slate-300 hover:text-white'
                                            }`}
                                        onClick={closeSidebar}
                                    />
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
