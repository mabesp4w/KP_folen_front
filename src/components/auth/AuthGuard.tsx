/** @format */

// src/components/AuthGuard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/stores/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackUrl?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
  fallbackUrl = "/login",
}) => {
  const { isAuthenticated, user, checkToken } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  console.log({ isAuthenticated });

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check if token is valid
        const isValid = await checkToken();
        console.log({ user });

        if (!isValid) {
          router.push(fallbackUrl);
          return;
        }

        // Check role if required
        if (requiredRole && user?.role !== requiredRole) {
          // router.push("/unauthorized");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Auth validation error:", error);
        router.push(fallbackUrl);
      }
    };

    validateAuth();
  }, [isAuthenticated, user, requiredRole, router, fallbackUrl, checkToken]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
