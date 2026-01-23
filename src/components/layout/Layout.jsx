import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ClickSpark from '../ui/ClickSpark';

const Layout = ({ children }) => {
    // Sidebar states: 'hidden' (mobile), 'collapsed' (icons), 'expanded' (full)
    const [sidebarState, setSidebarState] = useState('collapsed');

    const toggleSidebar = () => {
        if (window.innerWidth >= 768) {
            setSidebarState(prev => prev === 'expanded' ? 'collapsed' : 'expanded');
        } else {
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

            {/* Top Navbar */}
            <Navbar toggleSidebar={toggleSidebar} sidebarState={sidebarState} />

            {/* Body */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Sidebar */}
                <Sidebar
                    sidebarState={sidebarState}
                    closeSidebar={closeSidebar}
                />

                {/* Main Content */}
                <main
                    className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out
                    ${sidebarState === 'expanded' ? 'md:ml-72' :
                            sidebarState === 'collapsed' ? 'md:ml-20' : 'ml-0'}`}
                >
                    <ClickSpark
                        sparkColor="#60a5fa"
                        sparkSize={10}
                        sparkRadius={18}
                        sparkCount={8}
                        duration={400}
                    >
                        {children}
                        <Footer />
                    </ClickSpark>
                </main>
            </div>
        </div>
    );
};

export default Layout;
