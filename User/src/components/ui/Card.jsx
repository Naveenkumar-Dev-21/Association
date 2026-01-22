import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <div
            className={`bg-white/80 backdrop-blur-sm rounded-xl border border-primary-100 shadow-sm overflow-hidden group ${hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-primary-100 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-gradient-to-r from-white/60 to-primary-50/40 border-t border-primary-100 ${className}`}>
        {children}
    </div>
);

// Assign sub-components to Card
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
