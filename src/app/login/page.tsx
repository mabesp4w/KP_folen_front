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
import { Home, Music, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";

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
        router.push("/");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 w-full max-w-md px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-50"></div>
                <div className="relative bg-white rounded-full p-4 shadow-2xl">
                  <Image
                    src="/images/logo.jpeg"
                    alt="Logo"
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Music className="animate-pulse" />
              Rum Fararur Production
            </h1>
            <p className="text-white/90 text-lg flex items-center justify-center gap-2">
              <Sparkles size={16} />
              Selamat Datang Kembali!
            </p>
          </div>

          {/* Login Card */}
          <div className="card bg-base-100 shadow-2xl backdrop-blur-sm">
            <div className="card-body p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-base-content mb-2">
                  Login ke Akun Anda
                </h2>
                <p className="text-base-content/70">
                  Masukkan kredensial Anda untuk melanjutkan
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
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
                  placeholder="Masukkan password Anda"
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
                  className="w-full btn-primary"
                  loading={loading}
                  size="lg"
                  icon={LogIn}
                >
                  Masuk Sekarang
                </Button>
              </form>

              {/* Divider */}
              <div className="divider text-base-content/50">ATAU</div>

              {/* Tombol ke Halaman Utama */}
              <Link
                href="/"
                className="btn btn-outline btn-block gap-2 hover:btn-primary transition-all duration-300"
              >
                <Home size={20} />
                Kembali ke Halaman Utama
              </Link>

              {/* Footer Info */}
              <div className="text-center mt-6 pt-6 border-t border-base-300">
                <p className="text-sm text-base-content/60">
                  Belum punya akun? Hubungi administrator
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="text-center mt-6">
            <p className="text-white/80 text-sm">
              © 2025 Rum Fararur Production. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
