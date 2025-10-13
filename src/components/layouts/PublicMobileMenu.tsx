/** @format */

// src/components/layouts/PublicMobileMenu.tsx
"use client";

import React from "react";
import { Home, Music, Calendar, Camera, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PublicMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const PublicMobileMenu: React.FC<PublicMobileMenuProps> = ({ isOpen, onClose }) => {
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

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Mobile Menu */}
            <div
                className={`
          fixed top-0 left-0 h-full w-64 bg-base-100 shadow-xl z-50 
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-base-300">
                        <h2 className="text-lg font-bold">Menu</h2>
                        <button
                            onClick={onClose}
                            className="btn btn-ghost btn-sm btn-square"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="menu gap-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                const IconComponent = item.icon;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${isActive
                                                    ? "bg-primary text-primary-content font-semibold"
                                                    : "hover:bg-base-200"
                                                }
                      `}
                                        >
                                            <IconComponent size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default PublicMobileMenu;

