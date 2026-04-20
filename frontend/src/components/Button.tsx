import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'outline'
}

export default function Button ({
    children,
    variant = 'primary',
    className = '',
    ...props
}: ButtonProps){

    const baseClasses = "w-full font-bold py-2 px-4 rounded transition-colors duration-200 shadow-sm";

    const colorVariants = {
        primary: "bg-blue-500/70 hover:bg-blue-600/80 text-white rounded-2xl",
        success: "bg-gray-700/70 hover:bg-gray-600/80 text-white rounded-2xl",
        danger: "bg-red-400/20 hover:bg-red-400/40 text-red-400 hover:text-white border border-red-400/30 rounded-2xl",
        warning: "bg-yellow-400/20 hover:bg-yellow-400/40 text-yellow-500 hover:text-gray-900 border border-yellow-400/30 rounded-2xl",
        outline: "bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 rounded-2xl"
    };

    return(
        <button
            className={`${baseClasses} ${colorVariants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}