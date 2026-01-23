import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Info, Users, Calendar, FileText,
    CalendarDays, Target, TrendingUp, FileBarChart,
    Bell, Lock, ChevronDown, ChevronRight, Rocket
} from 'lucide-react';

const Sidebar = ({ sidebarState, closeSidebar }) => {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleSubmenu = (menuName) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    const isActive = (path) => location.pathname === path;

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

    const isExpanded = sidebarState === 'expanded';
    const isHidden = sidebarState === 'hidden';

    // 🔁 Recursive renderer for submenu (supports nested levels)
    const renderSubmenu = (submenu, level = 0) => (
        <div className="bg-slate-900/60">
            {submenu.map((item) => {
                if (item.submenu) {
                    return (
                        <div key={item.name}>
                            <div className="pl-28 pr-6 py-3 text-slate-300 font-semibold">
                                {item.name}
                            </div>
                            {renderSubmenu(item.submenu, level + 1)}
                        </div>
                    );
                }

                if (item.isPdf) {
                    return (
                        <a
                            key={item.name}
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block pl-28 pr-6 py-3 text-base text-slate-400 hover:bg-slate-800 hover:text-white transition"
                        >
                            {item.name}
                        </a>
                    );
                }

                return (
                    <Link
                        key={item.name}
                        to={item.path}
                        onClick={closeSidebar}
                        className="block pl-28 pr-6 py-3 text-base text-slate-400 hover:bg-slate-800 hover:text-white transition"
                    >
                        {item.name}
                    </Link>
                );
            })}
        </div>
    );

    return (
        <aside className={`absolute top-0 left-0 z-40 h-full bg-slate-950 text-slate-300 transition-all duration-300 
      border-r border-slate-800 overflow-y-auto shadow-2xl
      ${isHidden ? '-translate-x-full w-80 md:translate-x-0 md:w-24' : ''}
      ${isExpanded ? 'w-80 translate-x-0' : 'w-24'}`}>

            <div className="py-6">
                {menuItems.map(item => (
                    <div key={item.name}>
                        <button
                            onClick={() => isExpanded && item.submenu && toggleSubmenu(item.name)}
                            className={`w-full h-[64px] flex items-center justify-between hover:bg-slate-900 transition px-5`}
                        >
                            <div className="flex items-center w-full">
                                <div className="w-24 flex justify-center">
                                    <item.icon size={26} className="text-blue-400" />
                                </div>
                                {isExpanded && <span className="text-lg font-semibold">{item.name}</span>}
                            </div>

                            {isExpanded && item.submenu && (
                                expandedMenus[item.name] ? <ChevronDown size={18} /> : <ChevronRight size={18} />
                            )}
                        </button>

                        {isExpanded && item.submenu && expandedMenus[item.name] && renderSubmenu(item.submenu)}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
