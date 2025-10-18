/** @format */

// src/components/layouts/MobileUserMenu.tsx
"use client";

import React from "react";
import {
  Home,
  Music,
  Calendar,
  Camera,
  X,
  User,
  LogOut,
  ChevronRight,
  User2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/stores/useAuth";

interface MobileUserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileUserMenu: React.FC<MobileUserMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const userMenuItems = [
    {
      label: "Beranda",
      icon: Home,
      href: "/",
      description: "Halaman utama",
    },
    {
      label: "Musik",
      icon: Music,
      href: "/musik",
      description: "Karya musik kami",
    },
    {
      label: "Jadwal",
      icon: Calendar,
      href: "/jadwal",
      description: "Jadwal kegiatan",
    },
    {
      label: "Galeri",
      icon: Camera,
      href: "/galeri",
      description: "Foto & video",
    },
    {
      label: "Profil",
      icon: User2,
      href: "/profile",
    },
  ];

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/login");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 bg-base-100 shadow-2xl z-50 
          transform transition-transform duration-300 ease-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header with User Info */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={onClose}
                className="btn btn-circle btn-sm btn-ghost text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="avatar placeholder">
                  <div className="bg-white/20 text-white rounded-full w-12">
                    <User size={24} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-white/80">{user.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {userMenuItems.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-lg transition-all group
                      ${
                        isActive
                          ? "bg-primary text-primary-content shadow-lg"
                          : "hover:bg-base-200 active:bg-base-300"
                      }
                    `}
                  >
                    <div
                      className={`
                      p-2 rounded-lg transition-all
                      ${
                        isActive
                          ? "bg-white/20"
                          : "bg-primary/10 group-hover:bg-primary/20"
                      }
                    `}
                    >
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.label}</p>
                      <p
                        className={`text-xs ${
                          isActive
                            ? "text-primary-content/80"
                            : "text-base-content/60"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform group-hover:translate-x-1 ${
                        isActive ? "opacity-100" : "opacity-40"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="divider my-4"></div>

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 rounded-lg w-full transition-all hover:bg-error/10 active:bg-error/20 text-error group"
              >
                <div className="p-2 rounded-lg bg-error/10 group-hover:bg-error/20 transition-all">
                  <LogOut size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Keluar</p>
                  <p className="text-xs text-error/80">Logout dari akun</p>
                </div>
                <ChevronRight
                  size={16}
                  className="opacity-40 transition-transform group-hover:translate-x-1"
                />
              </button>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-base-300">
            <div className="text-center">
              <p className="text-xs text-base-content/60">
                © 2025 Rum Fararur Production
              </p>
              <p className="text-xs text-base-content/40 mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default MobileUserMenu;
