/** @format */

// src/components/layouts/Header.tsx
"use client";

import React from "react";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import useTheme from "@/stores/useTheme";
import useAuth from "@/stores/useAuth";
import UserNavigation from "./UserNavigation";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  showMenuButton = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="navbar bg-primary text-primary-content sticky top-0 z-40 shadow-lg">
      <div className="navbar-start">
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className="btn btn-square btn-ghost lg:hidden text-white"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-xl font-bold text-white ml-2">
          Rum Fararur Production
        </h1>
      </div>

      <div className="navbar-center">
        {/* User Navigation - tampil hanya untuk user biasa */}
        {user?.role === "user" && <UserNavigation />}
      </div>

      <div className="navbar-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={theme === "light" ? Moon : Sun}
          onClick={toggleTheme}
          className="text-white hover:bg-primary-focus border-none"
        />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-sm text-white hover:bg-primary-focus"
          >
            {user?.name || "User"}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-error hover:bg-error hover:text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
