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

    // Toggle submenu
    const toggleSubmenu = (menuName) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    // Helper to check if a link is active
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
                { name: "KISP 2020", path: "/policies/kisp" },
                { name: "TN Startup Policy", path: "/policies/tn-startup" },
                { name: "NISP 2019", path: "/policies/nisp" },
            ]
        },
        {
            name: "Year Plan", icon: CalendarDays,
            submenu: [
                { name: "Calendar of Activities", path: "/year-plan/activities" },
                { name: "Celebrations", path: "/year-plan/celebrations" },
                { name: "KEC Year Plan 24-25", path: "/year-plan/kec" },
            ]
        },
        {
            name: "IIC Activities", icon: Rocket,
            submenu: [
                { name: "2024 - 2025", path: "/iic/24-25" },
                { name: "2023 - 2024", path: "/iic/23-24" },
                { name: "2022 - 2023", path: "/iic/22-23" },
                { name: "2021 - 2022", path: "/iic/21-22" },
                { name: "2020 - 2021", path: "/iic/20-21" },
                { name: "2019 - 2020", path: "/iic/19-20" },
                { name: "2018 - 2019", path: "/iic/18-19" },
            ]
        },
        {
            name: "EMDC Activities", icon: TrendingUp,
            submenu: [
                { name: "2024 - 2025", path: "/emdc/24-25" },
                { name: "2023 - 2024", path: "/emdc/23-24" },
                { name: "2022 - 2023", path: "/emdc/22-23" },
                { name: "2021 - 2022", path: "/emdc/21-22" },
            ]
        },
        {
            name: "Spark Fund", icon: Target,
            submenu: [
                { name: "Application Form", path: "/spark-fund/apply" },
                { name: "Guidelines", path: "/spark-fund/guidelines" },
                { name: "Sanctioned Projects", path: "/spark-fund/projects" },
            ]
        },
        {
            name: "Annual Reports", icon: FileBarChart,
            submenu: [
                { name: "2024 - 2025", path: "/reports/24-25" },
                { name: "2023 - 2024", path: "/reports/23-24" },
                { name: "2022 - 2023", path: "/reports/22-23" },
            ]
        },
        { name: "Notifications", icon: Bell, path: "/notifications" },
        { name: "Admin Login", icon: Lock, path: "/admin/login" },
    ];

    const isExpanded = sidebarState === 'expanded';
    const isCollapsed = sidebarState === 'collapsed';
    const isHidden = sidebarState === 'hidden';

    return (
        <>
            {/* Backdrop Overlay - Only on mobile when expanded */}
            {isExpanded && window.innerWidth < 768 && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm transition-opacity md:hidden"
                />
            )}

            {/* Sidebar Container - Full height */}
            <aside
                className={`absolute top-0 left-0 z-40 h-full bg-slate-950 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 shadow-xl
                ${isHidden ? '-translate-x-full w-72 md:translate-x-0 md:w-20' : ''}
                ${isCollapsed ? 'w-20' : ''}
                ${isExpanded ? 'w-72 translate-x-0' : ''}`}
            >
                {/* Navigation Links - Start directly without header */}
                <div className="py-3">
                    {menuItems.map((item) => (
                        <div key={item.name}>
                            {item.submenu ? (
                                // Render Item with Submenu
                                <div>
                                    <button
                                        onClick={() => isExpanded && toggleSubmenu(item.name)}
                                        className={`w-full flex items-center justify-between hover:bg-slate-900 hover:text-white transition-colors group
                                        ${expandedMenus[item.name] ? 'text-white bg-slate-900' : ''}
                                        ${isExpanded ? 'px-5 py-3.5' : 'px-4 py-3.5 justify-center'}`}
                                        title={!isExpanded ? item.name : ''}
                                    >
                                        <div className={`flex items-center ${isExpanded ? 'gap-4' : 'justify-center'}`}>
                                            <item.icon size={20} className="shrink-0 group-hover:text-blue-400 transition-colors" />
                                            {isExpanded && (
                                                <span className="text-base font-medium">
                                                    {item.name}
                                                </span>
                                            )}
                                        </div>
                                        {isExpanded && (
                                            expandedMenus[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                        )}
                                    </button>

                                    {/* Submenu Items - Only show when expanded */}
                                    {isExpanded && expandedMenus[item.name] && (
                                        <div className="bg-slate-900/50">
                                            {item.submenu.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    to={subItem.path}
                                                    onClick={closeSidebar}
                                                    className={`block pl-14 pr-5 py-2.5 text-sm hover:text-white hover:bg-slate-800 transition-colors
                                                    ${isActive(subItem.path) ? 'text-blue-400 font-medium' : 'text-slate-400'}`}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Render Simple Link
                                <Link
                                    to={item.path}
                                    onClick={closeSidebar}
                                    className={`flex items-center hover:bg-slate-900 hover:text-white transition-colors group
                                    ${isActive(item.path) ? 'bg-blue-900/20 text-blue-400 border-r-4 border-blue-500' : ''}
                                    ${isExpanded ? 'gap-4 px-5 py-3.5' : 'px-4 py-3.5 justify-center'}`}
                                    title={!isExpanded ? item.name : ''}
                                >
                                    <item.icon size={20} className={`shrink-0 ${isActive(item.path) ? 'text-blue-400' : 'group-hover:text-blue-400'} transition-colors`} />
                                    {isExpanded && (
                                        <span className="text-base font-medium">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
