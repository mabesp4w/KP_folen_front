/** @format */

// src/components/layouts/MobileUserMenu.tsx
"use client";

import React from "react";
import { Home, Music, Calendar, Camera, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileUserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileUserMenu: React.FC<MobileUserMenuProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div className="absolute top-0 left-0 h-full w-64 bg-base-200 shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="btn btn-square btn-ghost btn-sm"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4">
            <nav className="space-y-2">
              {userMenuItems.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <div
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary text-primary-content"
                            : "hover:bg-base-300"
                        }
                      `}
                    >
                      <IconComponent size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileUserMenu;
