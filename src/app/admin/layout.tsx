/** @format */

// src/app/(dashboard)/layout.tsx
"use client";

import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import useAuth from "@/stores/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    // Simulate auth check - in real app you'd check token validity
    if (!isAuthenticated && !user) {
      // For demo purposes, let's set a default user
      const demoUser = {
        id: "1",
        name: "Admin",
        email: "admin@rumfararur.com",
        role: "admin",
      };
      // You can remove this and implement real auth
      useAuth.getState().login(demoUser);
    }
  }, [isAuthenticated, user]);

  // if (!isAuthenticated) {
  //   redirect("/login");
  // }

  return <MainLayout>{children}</MainLayout>;
}
