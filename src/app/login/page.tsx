/** @format */

// src/app/login/page.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Music } from "lucide-react";
import useAuth from "@/stores/useAuth";
import useTheme from "@/stores/useTheme";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any credentials
      const user = {
        id: "1",
        name: "Admin Rum Fararur",
        email: data.email,
        role: "admin",
      };

      login(user);
      toast.success("Login berhasil!");
      router.push("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login gagal!");
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
              <Music size={64} className="text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold">
              Rum Fararur Production
            </h2>
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

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Demo Credentials:</p>
                <p>Email: admin@rumfararur.com</p>
                <p>Password: password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
