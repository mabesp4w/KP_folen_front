/** @format */

// src/components/layouts/UserNavigation.tsx
"use client";

import React from "react";
import { Home, Music, Calendar, Camera } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserNavigation: React.FC = () => {
  const pathname = usePathname();

  const userMenuItems = [
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
    <div className="hidden lg:flex">
      <ul className="menu menu-horizontal px-1 gap-2">
        {userMenuItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-white
                  ${isActive ? "bg-primary-focus" : "hover:bg-primary-focus"}
                `}
              >
                <IconComponent size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserNavigation;
