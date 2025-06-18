/** @format */

// src/app/layout.tsx
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "Rum Fararur Production",
  description: "Music Production Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--fallback-b1,oklch(var(--b1)))",
              color: "var(--fallback-bc,oklch(var(--bc)))",
            },
          }}
        />
      </body>
    </html>
  );
}
