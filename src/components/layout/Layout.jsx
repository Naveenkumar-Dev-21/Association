import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
    // Sidebar states: 'hidden' (mobile only), 'collapsed' (icons only), 'expanded' (full)
    const [sidebarState, setSidebarState] = useState('collapsed'); // Desktop starts collapsed

    const toggleSidebar = () => {
        if (window.innerWidth >= 768) {
            // Desktop: toggle between collapsed and expanded
            setSidebarState(prev => prev === 'expanded' ? 'collapsed' : 'expanded');
        } else {
            // Mobile: toggle between hidden and expanded
            setSidebarState(prev => prev === 'expanded' ? 'hidden' : 'expanded');
        }
    };

    const closeSidebar = () => {
        if (window.innerWidth >= 768) {
            setSidebarState('collapsed');
        } else {
            setSidebarState('hidden');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Fixed Header at Top - Full Width */}
            <Navbar toggleSidebar={toggleSidebar} sidebarState={sidebarState} />

            {/* Content Area Below Header */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar - Positioned relative to this container */}
                <Sidebar
                    sidebarState={sidebarState}
                    closeSidebar={closeSidebar}
                />

                {/* Main Content Area - Shifts when sidebar expands */}
                <main className={`flex-1 overflow-y-auto overflow-x-hidden p-0 transition-all duration-300 ease-in-out
                    ${sidebarState === 'expanded' ? 'md:ml-72' : sidebarState === 'collapsed' ? 'md:ml-20' : 'ml-0'}`}>
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default Layout;
