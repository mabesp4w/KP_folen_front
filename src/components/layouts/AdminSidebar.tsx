/** @format */

// src/components/layouts/AdminSidebar.tsx
"use client";

import React from "react";
import { Music, Calendar, Camera, Tags, Home, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const adminMenuItems = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/admin",
    },
    {
      label: "Karya Musik",
      icon: Music,
      href: "/admin/karya-musik",
    },
    {
      label: "Jadwal Kegiatan",
      icon: Calendar,
      href: "/admin/jadwal-kegiatan",
    },
    {
      label: "Dokumentasi",
      icon: Camera,
      href: "/admin/dokumentasi",
    },
    {
      label: "Kategori",
      icon: Tags,
      href: "/admin/kategori",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="drawer-side z-30">
        <label
          htmlFor="drawer-toggle"
          aria-label="close sidebar"
          className="drawer-overlay lg:hidden"
          onClick={onClose}
        ></label>

        <aside className="min-h-full w-64 bg-base-200 text-base-content">
          {/* Sidebar Header - Only show on mobile */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h2 className="text-lg font-semibold">Menu Admin</h2>
            <button
              onClick={onClose}
              className="btn btn-square btn-ghost btn-sm"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
            {/* logo */}
            <div className="relative h-36 border-b mb-4">
              <Image
                src="/images/logo.jpeg"
                alt="Logo"
                fill
                className="object-contain"
              />
              {/* <span className="font-medium">Admin</span> */}
            </div>
            <nav className="space-y-2">
              {adminMenuItems.map((item) => {
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
        </aside>
      </div>

      {/* Mobile Sidebar Overlay - Fallback jika drawer tidak bekerja */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute top-0 left-0 h-full w-64 bg-base-200 shadow-lg transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu Admin</h2>
              <button
                onClick={onClose}
                className="btn btn-square btn-ghost btn-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <nav className="space-y-2">
                {adminMenuItems.map((item) => {
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
      )}
    </>
  );
};

export default AdminSidebar;
