/** @format */

// src/app/(user)/galeri/page.tsx
"use client";

import React from "react";
import { Camera, Search, Image as ImageIcon, Video } from "lucide-react";
import useDokumentasi from "@/stores/crud/useDokumentasi";
import GalleryCard from "@/components/user/GalleryCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBox } from "@/components/ui/SearchBox";
import { EmptyState } from "@/components/ui/EmptyState";
import VideoPlayerModal from "@/components/ui/VideoPlayerModal";
import { Dokumentasi } from "@/types";

const GaleriPage: React.FC = () => {
    const { dtDokumentasi, setDokumentasi, loading } = useDokumentasi();
    const [search, setSearch] = React.useState("");
    const [selectedJenis, setSelectedJenis] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedItem, setSelectedItem] = React.useState<Dokumentasi | null>(null);
    const [showModal, setShowModal] = React.useState(false);

    const jenisOptions = [
        { value: "foto", label: "Foto", icon: ImageIcon },
        { value: "video", label: "Video", icon: Video },
    ];

    const loadData = React.useCallback(async () => {
        await setDokumentasi({
            page: currentPage,
            limit: 12,
            search: search || undefined,
            jenis: selectedJenis || undefined,
            sortby: "created_at",
            order: "desc",
        });
    }, [currentPage, search, selectedJenis, setDokumentasi]);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleJenisFilter = (jenis: string) => {
        setSelectedJenis(jenis === selectedJenis ? "" : jenis);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleItemClick = (item: Dokumentasi) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => setSelectedItem(null), 300);
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-accent to-info py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <Camera size={64} className="mx-auto mb-4 text-white" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Galeri Dokumentasi
                        </h1>
                        <p className="text-xl text-white/90">
                            Lihat koleksi foto dan video dari berbagai kegiatan kami
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
                                    placeholder="Cari judul dokumentasi atau lokasi..."
                                />
                            </div>

                            {/* Jenis Filter */}
                            <div className="flex gap-2">
                                {jenisOptions.map((jenis) => {
                                    const IconComponent = jenis.icon;
                                    return (
                                        <button
                                            key={jenis.value}
                                            onClick={() => handleJenisFilter(jenis.value)}
                                            className={`btn gap-2 ${selectedJenis === jenis.value
                                                ? "btn-primary"
                                                : "btn-outline"
                                                }`}
                                        >
                                            <IconComponent size={20} />
                                            {jenis.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(search || selectedJenis) && (
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
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Info */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-base-content/70">
                        Menampilkan {dtDokumentasi.data.length} dari {dtDokumentasi.total} dokumentasi
                    </p>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : dtDokumentasi.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {dtDokumentasi.data.map((item) => (
                                <GalleryCard key={item.id} item={item} onClick={handleItemClick} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {dtDokumentasi.last_page > 1 && (
                            <div className="flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={dtDokumentasi.last_page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        icon={Camera}
                        title="Tidak ada dokumentasi ditemukan"
                        description={
                            search || selectedJenis
                                ? "Coba ubah filter atau kata kunci pencarian Anda"
                                : "Belum ada dokumentasi yang tersedia saat ini"
                        }
                    />
                )}
            </div>

            {/* Video/Image Player Modal */}
            <VideoPlayerModal
                isOpen={showModal}
                onClose={handleCloseModal}
                item={selectedItem}
            />
        </div>
    );
};

export default GaleriPage;

