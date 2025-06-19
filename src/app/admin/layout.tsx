/** @format */

import AuthGuard from "@/components/auth/AuthGuard";
import MainLayout from "@/components/layouts/MainLayout";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <AuthGuard requiredRole="admin">
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
};

export default layout;
