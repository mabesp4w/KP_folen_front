/** @format */

// src/app/(user)/musik/[id]/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Music, Calendar, ArrowLeft, Play, Tag } from "lucide-react";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import ScrollRevealComponent from "@/components/ui/ScrollRevealComponent";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { url_storage } from "@/services/baseURL";
import moment from "moment";
import { KaryaMusik } from "@/types";
import MusicPlayerModal from "@/components/ui/MusicPlayerModal";

const MusicDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { setShowKaryaMusik } = useKaryaMusik();
    const [music, setMusic] = React.useState<KaryaMusik | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [playerType, setPlayerType] = React.useState<'audio' | 'video'>('audio');

    React.useEffect(() => {
        loadData();
    }, [params.id]);

    const loadData = async () => {
        setLoading(true);
        const result = await setShowKaryaMusik(params.id as string);
        if (result.status === "berhasil" && result.data) {
            setMusic(result.data);
        }
        setLoading(false);
    };

    const handlePlayAudio = () => {
        if (music) {
            setPlayerType('audio');
            setShowModal(true);
        }
    };

    const handlePlayVideo = () => {
        if (music) {
            setPlayerType('video');
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!music) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <Music size={64} className="mx-auto text-base-content/30 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Karya Musik Tidak Ditemukan</h2>
                    <button onClick={() => router.back()} className="btn btn-primary mt-4">
                        <ArrowLeft size={20} />
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <ScrollRevealComponent animations="fade-down" duration={1000}>
                <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-8">
                    <div className="container mx-auto px-6">
                        <button
                            onClick={() => router.back()}
                            className="btn btn-ghost btn-sm gap-2 mb-4"
                        >
                            <ArrowLeft size={20} />
                            Kembali
                        </button>
                    </div>
                </div>
            </ScrollRevealComponent>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Thumbnail */}
                        <ScrollRevealComponent animations="fade-up" delay={100}>
                            <div className="card bg-base-100 shadow-xl overflow-hidden">
                                <figure className="relative h-96">
                                    {music.thumbnail ? (
                                        <img
                                            src={`${url_storage}/${music.thumbnail}`}
                                            alt={music.judul}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                            <Music size={128} className="text-white opacity-50" />
                                        </div>
                                    )}
                                </figure>
                            </div>
                        </ScrollRevealComponent>

                        {/* Description */}
                        <ScrollRevealComponent animations="fade-up" delay={200}>
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-4">{music.judul}</h2>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {music.genre && (
                                            <span className="badge badge-primary badge-lg">
                                                {music.genre}
                                            </span>
                                        )}
                                        {music.kategori && music.kategori.length > 0 && (
                                            music.kategori.map((kat) => (
                                                <span key={kat.id} className="badge badge-outline">
                                                    {kat.nm_kategori}
                                                </span>
                                            ))
                                        )}
                                    </div>

                                    {music.deskripsi && (
                                        <div className="prose max-w-none">
                                            <p className="text-base-content/80">{music.deskripsi}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollRevealComponent>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Info Card */}
                        <ScrollRevealComponent animations="fade-left" delay={150}>
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title text-lg mb-4">Informasi</h3>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-base-content/60 mb-1">Artis</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <Music size={16} className="text-primary" />
                                                {music.nm_artis}
                                            </p>
                                        </div>

                                        {music.tgl_rilis && (
                                            <div>
                                                <p className="text-sm text-base-content/60 mb-1">Tanggal Rilis</p>
                                                <p className="font-semibold flex items-center gap-2">
                                                    <Calendar size={16} className="text-secondary" />
                                                    {moment(music.tgl_rilis).format("DD MMMM YYYY")}
                                                </p>
                                            </div>
                                        )}

                                        {music.genre && (
                                            <div>
                                                <p className="text-sm text-base-content/60 mb-1">Genre</p>
                                                <p className="font-semibold flex items-center gap-2">
                                                    <Tag size={16} className="text-accent" />
                                                    {music.genre}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollRevealComponent>

                        {/* Actions */}
                        <ScrollRevealComponent animations="fade-left" delay={200}>
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title text-lg mb-4">Dengarkan</h3>

                                    <div className="space-y-2">
                                        {music.url_audio && (
                                            <button
                                                onClick={handlePlayAudio}
                                                className="btn btn-primary w-full gap-2"
                                            >
                                                <Play size={20} />
                                                Putar Audio
                                            </button>
                                        )}

                                        {music.url_video && (
                                            <button
                                                onClick={handlePlayVideo}
                                                className="btn btn-secondary w-full gap-2"
                                            >
                                                <Play size={20} />
                                                Tonton Video
                                            </button>
                                        )}

                                        {!music.url_audio && !music.url_video && (
                                            <p className="text-center text-base-content/60 py-4">
                                                Belum ada media tersedia
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollRevealComponent>
                    </div>
                </div>
            </div>

            {/* Music Player Modal */}
            <MusicPlayerModal
                isOpen={showModal}
                onClose={handleCloseModal}
                music={music}
                type={playerType}
            />
        </div>
    );
};

export default MusicDetailPage;

