/** @format */

// src/components/layouts/PublicNavbar.tsx
"use client";

import React from "react";
import { Home, Music, Calendar, Camera } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PublicNavbar: React.FC = () => {
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
        <div className="hidden lg:block bg-base-100 border-b border-base-300 sticky top-16 z-30 shadow-sm">
            <div className="container mx-auto px-6">
                <nav className="flex items-center justify-center">
                    <ul className="menu menu-horizontal gap-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const IconComponent = item.icon;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`
                      flex items-center gap-2 px-6 py-4 transition-all duration-200 font-medium
                      ${isActive
                                                ? "text-primary border-b-2 border-primary bg-primary/5"
                                                : "text-base-content/70 hover:text-primary hover:bg-base-200"
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
    );
};

export default PublicNavbar;

