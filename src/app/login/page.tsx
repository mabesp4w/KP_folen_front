/** @format */

// src/app/login/page.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import useAuth from "@/stores/useAuth";
import useTheme from "@/stores/useTheme";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data);

      // Redirect berdasarkan role atau ke dashboard
      const user = useAuth.getState().user;
      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      // Error handling sudah ditangani di store
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "dark" : ""}`}
      data-theme={theme}
    >
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Image
                src="/images/logo.jpeg"
                alt="Logo"
                width={200}
                height={200}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Silakan login untuk melanjutkan
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email harus diisi",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Format email tidak valid",
                    },
                  })}
                  error={errors.email?.message}
                />

                <Input
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  showPasswordToggle={true}
                  {...register("password", {
                    required: "Password harus diisi",
                    minLength: {
                      value: 6,
                      message: "Password minimal 6 karakter",
                    },
                  })}
                  error={errors.password?.message}
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  size="lg"
                >
                  Masuk
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
