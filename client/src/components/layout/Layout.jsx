import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import ClickSpark from '../ui/ClickSpark';

const Layout = ({ children }) => {
    // Sidebar states: 'hidden' or 'expanded'
    const [sidebarState, setSidebarState] = useState('hidden');

    const toggleSidebar = () => {
        setSidebarState(prev => prev === 'expanded' ? 'hidden' : 'expanded');
    };

    const closeSidebar = () => {
        setSidebarState('hidden');
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans relative">

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
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    {/* ClickSpark Wrapper */}
                    <ClickSpark
                        sparkColor="#fff"
                        sparkSize={10}
                        sparkRadius={15}
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