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
        primary: "bg-blue-600 hover:bg-blue-700 text-white rounded-2xl",
        success: "bg-slate-700 hover:bg-slate-600 text-white rounded-2xl",
        danger: "bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/50 rounded-2xl",
        warning: "bg-amber-500/20 hover:bg-amber-500 text-amber-500 hover:text-black border border-amber-500/50 rounded-2xl",
        outline: "bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-2xl"
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