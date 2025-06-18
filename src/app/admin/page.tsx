/** @format */

// src/app/dashboard/page.tsx
"use client";

import React from "react";
import { Music, Calendar, Camera, Tags, TrendingUp } from "lucide-react";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import useKategori from "@/stores/crud/useKategori";
import Link from "next/link";

const DashboardPage: React.FC = () => {
  const { dtKaryaMusik, setKaryaMusik } = useKaryaMusik();
  const { dtKategori, setKategori } = useKategori();
  const [stats, setStats] = React.useState({
    totalKaryaMusik: 0,
    totalKategori: 0,
    totalJadwal: 0,
    totalDokumentasi: 0,
  });

  React.useEffect(() => {
    loadStats();
  }, []);

  console.log({ dtKategori });

  const loadStats = async () => {
    // Load Karya Musik
    const karyaResult = await setKaryaMusik({ page: 1, limit: 1 });

    // Load Kategori
    const kategoriResult = await setKategori({ page: 1, limit: 1 });

    if (karyaResult.status === "berhasil") {
      setStats((prev) => ({
        ...prev,
        totalKaryaMusik: karyaResult.data?.data?.total || 0,
      }));
    }

    if (kategoriResult.status === "berhasil") {
      setStats((prev) => ({
        ...prev,
        totalKategori: kategoriResult.data?.data?.total || 0,
      }));
    }
  };

  const statCards = [
    {
      title: "Total Karya Musik",
      value: stats.totalKaryaMusik,
      icon: Music,
      color: "bg-primary",
      textColor: "text-primary-content",
    },
    {
      title: "Total Jadwal Kegiatan",
      value: stats.totalJadwal,
      icon: Calendar,
      color: "bg-secondary",
      textColor: "text-secondary-content",
    },
    {
      title: "Total Dokumentasi",
      value: stats.totalDokumentasi,
      icon: Camera,
      color: "bg-accent",
      textColor: "text-accent-content",
    },
    {
      title: "Total Kategori",
      value: stats.totalKategori,
      icon: Tags,
      color: "bg-info",
      textColor: "text-info-content",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Selamat datang di Rum Fararur Production Management System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`card ${stat.color} ${stat.textColor} shadow-lg`}
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="card-title text-lg">{stat.value}</h2>
                    <p className="opacity-80">{stat.title}</p>
                  </div>
                  <IconComponent size={48} className="opacity-80" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <TrendingUp size={20} />
              Ringkasan Aktivitas
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Karya Musik Terbaru</span>
                <span className="badge badge-primary">
                  {stats.totalKaryaMusik} total
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kategori Aktif</span>
                <span className="badge badge-secondary">
                  {stats.totalKategori} total
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Jadwal Mendatang</span>
                <span className="badge badge-accent">
                  {stats.totalJadwal} total
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Akses Cepat</h2>
            <div className="space-y-2">
              <Link
                href="/admin/karya-musik"
                className="btn btn-outline w-full justify-start"
              >
                <Music size={16} />
                Kelola Karya Musik
              </Link>
              <Link
                href="/admin/jadwal-kegiatan"
                className="btn btn-outline w-full justify-start"
              >
                <Calendar size={16} />
                Kelola Jadwal Kegiatan
              </Link>
              <Link
                href="/admin/dokumentasi"
                className="btn btn-outline w-full justify-start"
              >
                <Camera size={16} />
                Kelola Dokumentasi
              </Link>
              <Link
                href="/admin/kategori"
                className="btn btn-outline w-full justify-start"
              >
                <Tags size={16} />
                Kelola Kategori
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Karya Musik Terbaru</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Artis</th>
                  <th>Genre</th>
                  <th>Tanggal Rilis</th>
                </tr>
              </thead>
              <tbody>
                {dtKaryaMusik.data.slice(0, 5).map((karya) => (
                  <tr key={karya.id}>
                    <td className="font-medium">{karya.judul}</td>
                    <td>{karya.nm_artis}</td>
                    <td>
                      <span className="badge badge-outline">
                        {karya.genre || "-"}
                      </span>
                    </td>
                    <td>
                      {karya.tgl_rilis
                        ? new Date(karya.tgl_rilis).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                  </tr>
                ))}
                {dtKaryaMusik.data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500">
                      Belum ada data karya musik
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
