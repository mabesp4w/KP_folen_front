/** @format */

// src/components/layouts/MainLayout.tsx
"use client";

import React from "react";
import useTheme from "@/stores/useTheme";
import useAuth from "@/stores/useAuth";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";
import MobileUserMenu from "./MobileUserMenu";
import UserNavbar from "./UserNavbar";
import PublicNavbar from "./PublicNavbar";
import PublicMobileMenu from "./PublicMobileMenu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isAdmin = user?.role === "admin";

  const handleMenuToggle = () => {
    if (isAdmin) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Layout untuk Admin dengan Sidebar
  if (isAdmin) {
    return (
      <div
        className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}
        data-theme={theme}
      >
        <div className="drawer lg:drawer-open">
          <input
            id="drawer-toggle"
            type="checkbox"
            className="drawer-toggle"
            checked={sidebarOpen}
            onChange={(e) => setSidebarOpen(e.target.checked)}
          />

          <div className="drawer-content flex flex-col">
            <Header onMenuToggle={handleMenuToggle} showMenuButton={true} />
            <main className="flex-1 p-6">{children}</main>
          </div>

          <AdminSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        </div>
      </div>
    );
  }

  // Layout untuk User dengan Navigation di Navbar
  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}
      data-theme={theme}
    >
      <Header onMenuToggle={handleMenuToggle} showMenuButton={true} />

      {/* Navigation - tampilkan UserNavbar jika login, PublicNavbar jika belum login */}
      {user ? <UserNavbar /> : <PublicNavbar />}

      {/* Mobile Menu - tampilkan berdasarkan status login */}
      {user ? (
        <MobileUserMenu isOpen={mobileMenuOpen} onClose={handleCloseMobileMenu} />
      ) : (
        <PublicMobileMenu isOpen={mobileMenuOpen} onClose={handleCloseMobileMenu} />
      )}

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default MainLayout;
