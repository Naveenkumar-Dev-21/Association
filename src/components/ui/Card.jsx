import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-100 ${className}`}>
        {children}
    </div>
);

// Assign sub-components to Card
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
