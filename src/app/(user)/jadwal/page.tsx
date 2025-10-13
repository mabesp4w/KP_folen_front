/** @format */

// src/app/(user)/jadwal/page.tsx
"use client";

import React from "react";
import { Calendar, Search, Filter, Clock } from "lucide-react";
import useJadwalKegiatan from "@/stores/crud/useJadwalKegiatan";
import EventCard from "@/components/user/EventCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBox } from "@/components/ui/SearchBox";
import { EmptyState } from "@/components/ui/EmptyState";

const JadwalPage: React.FC = () => {
    const { dtJadwalKegiatan, setJadwalKegiatan, loading } = useJadwalKegiatan();
    const [search, setSearch] = React.useState("");
    const [selectedJenis, setSelectedJenis] = React.useState("");
    const [selectedStatus, setSelectedStatus] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);

    const jenisOptions = [
        { value: "acara", label: "Acara" },
        { value: "sesi_studio", label: "Sesi Studio" },
        { value: "konser", label: "Konser" },
        { value: "rekaman", label: "Rekaman" },
    ];

    const statusOptions = [
        { value: "terjadwal", label: "Terjadwal" },
        { value: "berlangsung", label: "Berlangsung" },
        { value: "selesai", label: "Selesai" },
        { value: "dibatalkan", label: "Dibatalkan" },
    ];

    React.useEffect(() => {
        loadData();
    }, [currentPage, search, selectedJenis, selectedStatus]);

    const loadData = async () => {
        await setJadwalKegiatan({
            page: currentPage,
            limit: 12,
            search: search || undefined,
            jenis: selectedJenis || undefined,
            status: selectedStatus || undefined,
            sortby: "waktu_mulai",
            order: "asc",
        });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleJenisFilter = (jenis: string) => {
        setSelectedJenis(jenis === selectedJenis ? "" : jenis);
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status === selectedStatus ? "" : status);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-secondary to-accent py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <Calendar size={64} className="mx-auto mb-4 text-white" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Jadwal Kegiatan
                        </h1>
                        <p className="text-xl text-white/90">
                            Ikuti berbagai acara dan kegiatan menarik dari kami
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Search and Filter */}
                <div className="card bg-base-100 shadow-lg mb-8">
                    <div className="card-body">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Box */}
                            <div className="flex-1">
                                <SearchBox
                                    onSearch={handleSearch}
                                    placeholder="Cari judul kegiatan atau lokasi..."
                                />
                            </div>

                            {/* Jenis Filter */}
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-outline gap-2">
                                    <Filter size={20} />
                                    {selectedJenis
                                        ? jenisOptions.find((j) => j.value === selectedJenis)?.label
                                        : "Semua Jenis"}
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2"
                                >
                                    <li>
                                        <a
                                            onClick={() => setSelectedJenis("")}
                                            className={!selectedJenis ? "active" : ""}
                                        >
                                            Semua Jenis
                                        </a>
                                    </li>
                                    {jenisOptions.map((jenis) => (
                                        <li key={jenis.value}>
                                            <a
                                                onClick={() => handleJenisFilter(jenis.value)}
                                                className={selectedJenis === jenis.value ? "active" : ""}
                                            >
                                                {jenis.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Status Filter */}
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-outline gap-2">
                                    <Clock size={20} />
                                    {selectedStatus
                                        ? statusOptions.find((s) => s.value === selectedStatus)?.label
                                        : "Semua Status"}
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2"
                                >
                                    <li>
                                        <a
                                            onClick={() => setSelectedStatus("")}
                                            className={!selectedStatus ? "active" : ""}
                                        >
                                            Semua Status
                                        </a>
                                    </li>
                                    {statusOptions.map((status) => (
                                        <li key={status.value}>
                                            <a
                                                onClick={() => handleStatusFilter(status.value)}
                                                className={selectedStatus === status.value ? "active" : ""}
                                            >
                                                {status.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(search || selectedJenis || selectedStatus) && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {search && (
                                    <div className="badge badge-lg gap-2">
                                        <Search size={14} />
                                        Pencarian: {search}
                                        <button
                                            onClick={() => setSearch("")}
                                            className="btn btn-ghost btn-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                                {selectedJenis && (
                                    <div className="badge badge-lg badge-primary gap-2">
                                        Jenis: {jenisOptions.find((j) => j.value === selectedJenis)?.label}
                                        <button
                                            onClick={() => setSelectedJenis("")}
                                            className="btn btn-ghost btn-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                                {selectedStatus && (
                                    <div className="badge badge-lg badge-secondary gap-2">
                                        Status: {statusOptions.find((s) => s.value === selectedStatus)?.label}
                                        <button
                                            onClick={() => setSelectedStatus("")}
                                            className="btn btn-ghost btn-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Info */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-base-content/70">
                        Menampilkan {dtJadwalKegiatan.data.length} dari {dtJadwalKegiatan.total} jadwal kegiatan
                    </p>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : dtJadwalKegiatan.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {dtJadwalKegiatan.data.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {dtJadwalKegiatan.last_page > 1 && (
                            <div className="flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={dtJadwalKegiatan.last_page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        icon={Calendar}
                        title="Tidak ada jadwal kegiatan ditemukan"
                        description={
                            search || selectedJenis || selectedStatus
                                ? "Coba ubah filter atau kata kunci pencarian Anda"
                                : "Belum ada jadwal kegiatan yang tersedia saat ini"
                        }
                    />
                )}
            </div>
        </div>
    );
};

export default JadwalPage;

