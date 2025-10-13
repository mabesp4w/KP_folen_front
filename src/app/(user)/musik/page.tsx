/** @format */

// src/app/(user)/musik/page.tsx
"use client";

import React from "react";
import { Music, Search, Filter } from "lucide-react";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import MusicCard from "@/components/user/MusicCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Pagination } from "@/components/ui/Pagination";
import { SearchBox } from "@/components/ui/SearchBox";
import { EmptyState } from "@/components/ui/EmptyState";
import MusicPlayerModal from "@/components/ui/MusicPlayerModal";
import { KaryaMusik } from "@/types";

const MusikPage: React.FC = () => {
    const { dtKaryaMusik, setKaryaMusik, loading } = useKaryaMusik();
    const [search, setSearch] = React.useState("");
    const [selectedGenre, setSelectedGenre] = React.useState("");
    const [genres, setGenres] = React.useState<string[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedMusic, setSelectedMusic] = React.useState<KaryaMusik | null>(null);
    const [showModal, setShowModal] = React.useState(false);
    const [playerType, setPlayerType] = React.useState<'audio' | 'video'>('audio');

    React.useEffect(() => {
        loadGenres();
    }, []);

    React.useEffect(() => {
        loadData();
    }, [currentPage, search, selectedGenre]);

    const loadGenres = async () => {
        const { setKaryaMusik } = useKaryaMusik.getState();
        const result = await setKaryaMusik({ page: 1, limit: 100 });
        if (result.status === "berhasil" && result.data?.data?.data) {
            const uniqueGenres = Array.from(
                new Set(
                    result.data.data.data
                        .map((item: any) => item.genre)
                        .filter((genre: string) => genre)
                )
            );
            setGenres(uniqueGenres as string[]);
        }
    };

    const loadData = async () => {
        await setKaryaMusik({
            page: currentPage,
            limit: 12,
            search: search || undefined,
            sortby: "created_at",
            order: "desc",
        });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleGenreFilter = (genre: string) => {
        setSelectedGenre(genre === selectedGenre ? "" : genre);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePlayMusic = (music: KaryaMusik) => {
        setSelectedMusic(music);
        // Prioritize video if available, otherwise audio
        setPlayerType(music.url_video ? 'video' : 'audio');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTimeout(() => setSelectedMusic(null), 300);
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary to-secondary py-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <Music size={64} className="mx-auto mb-4 text-white" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Karya Musik
                        </h1>
                        <p className="text-xl text-white/90">
                            Jelajahi koleksi musik kami yang penuh inspirasi
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
                                    placeholder="Cari judul musik atau artis..."
                                />
                            </div>

                            {/* Genre Filter */}
                            {genres.length > 0 && (
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-outline gap-2">
                                        <Filter size={20} />
                                        {selectedGenre || "Semua Genre"}
                                    </label>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2"
                                    >
                                        <li>
                                            <a
                                                onClick={() => setSelectedGenre("")}
                                                className={!selectedGenre ? "active" : ""}
                                            >
                                                Semua Genre
                                            </a>
                                        </li>
                                        {genres.map((genre) => (
                                            <li key={genre}>
                                                <a
                                                    onClick={() => handleGenreFilter(genre)}
                                                    className={selectedGenre === genre ? "active" : ""}
                                                >
                                                    {genre}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Active Filters */}
                        {(search || selectedGenre) && (
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
                                {selectedGenre && (
                                    <div className="badge badge-lg badge-primary gap-2">
                                        Genre: {selectedGenre}
                                        <button
                                            onClick={() => setSelectedGenre("")}
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
                        Menampilkan {dtKaryaMusik.data.length} dari {dtKaryaMusik.total} karya musik
                    </p>
                </div>

                {/* Music Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : dtKaryaMusik.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {dtKaryaMusik.data.map((music) => (
                                <MusicCard key={music.id} music={music} onPlay={handlePlayMusic} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {dtKaryaMusik.last_page > 1 && (
                            <div className="flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={dtKaryaMusik.last_page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        icon={Music}
                        title="Tidak ada karya musik ditemukan"
                        description={
                            search || selectedGenre
                                ? "Coba ubah filter atau kata kunci pencarian Anda"
                                : "Belum ada karya musik yang tersedia saat ini"
                        }
                    />
                )}
            </div>

            {/* Music Player Modal */}
            <MusicPlayerModal
                isOpen={showModal}
                onClose={handleCloseModal}
                music={selectedMusic}
                type={playerType}
            />
        </div>
    );
};

export default MusikPage;

