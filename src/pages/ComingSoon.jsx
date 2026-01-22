import React from 'react';
import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ComingSoon = () => {
    const location = useLocation();

    // Extract a readable title from the path
    const getTitle = () => {
        const path = location.pathname.split('/').filter(Boolean);
        if (path.length === 0) return 'Page';

        const lastSegment = path[path.length - 1];
        return lastSegment.replace(/-/g, ' ').toUpperCase();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="bg-blue-50 p-6 rounded-full mb-6 animate-pulse">
                <Construction size={64} className="text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 uppercase tracking-wide">
                Coming Soon
            </h1>
            <p className="text-xl text-gray-500 max-w-lg mb-8">
                The content for <span className="font-semibold text-blue-600">"{getTitle()}"</span> is currently under development.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-md w-full">
                <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold mb-2">Development Status</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <p className="text-xs text-right text-gray-500">Pending Content</p>
            </div>
        </div>
    );
};

export default ComingSoon;
