/** @format */

// src/components/PublicRoute.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/stores/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/admin",
}) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, user, router, redirectTo]);

  // If already authenticated, show loading while redirecting
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PublicRoute;
