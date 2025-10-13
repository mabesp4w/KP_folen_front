/** @format */

// src/components/layouts/BottomNavigation.tsx
"use client";

import React from "react";
import { Home, Music, Calendar, Camera, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavigationProps {
    isOpen: boolean;
    onClose: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();

    const menuItems = [
        {
            label: "Beranda",
            icon: Home,
            href: "/",
        },
        {
            label: "Musik",
            icon: Music,
            href: "/musik",
        },
        {
            label: "Jadwal",
            icon: Calendar,
            href: "/jadwal",
        },
        {
            label: "Galeri",
            icon: Camera,
            href: "/galeri",
        },
    ];

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`
                    lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100 
                    rounded-t-2xl shadow-2xl
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? "translate-y-0" : "translate-y-full"}
                `}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1 bg-base-300 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-base-300">
                    <h3 className="text-lg font-bold">Menu</h3>
                    <button
                        onClick={onClose}
                        className="btn btn-circle btn-sm btn-ghost"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <div className="grid grid-cols-4 gap-4">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const IconComponent = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`
                                        flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200
                                        ${isActive
                                            ? "bg-primary text-primary-content shadow-lg"
                                            : "bg-base-200 hover:bg-base-300 text-base-content"
                                        }
                                    `}
                                >
                                    <IconComponent
                                        size={28}
                                        className={isActive ? "stroke-[2.5]" : "stroke-[2]"}
                                    />
                                    <span className={`text-xs font-medium text-center ${isActive ? "font-semibold" : ""}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Safe Area for Mobile */}
                <div className="h-6"></div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </>
    );
};

export default BottomNavigation;

