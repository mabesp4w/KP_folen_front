/** @format */

// src/app/(user)/page.tsx
"use client";

import React from "react";
import { Music, Calendar, Camera, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import useJadwalKegiatan from "@/stores/crud/useJadwalKegiatan";
import useDokumentasi from "@/stores/crud/useDokumentasi";
import MusicCard from "@/components/user/MusicCard";
import EventCard from "@/components/user/EventCard";
import GalleryCard from "@/components/user/GalleryCard";
import ScrollRevealComponent from "@/components/ui/ScrollRevealComponent";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const HomePage: React.FC = () => {
    const { dtKaryaMusik, setKaryaMusik, loading: loadingMusik } = useKaryaMusik();
    const { dtJadwalKegiatan, setJadwalKegiatan, loading: loadingJadwal } = useJadwalKegiatan();
    const { dtDokumentasi, setDokumentasi, loading: loadingDokumentasi } = useDokumentasi();

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Load data terbaru untuk ditampilkan di beranda
        await setKaryaMusik({ page: 1, limit: 6, sortby: "created_at", order: "desc" });
        await setJadwalKegiatan({ page: 1, limit: 3, sortby: "waktu_mulai", order: "asc", status: "terjadwal" });
        await setDokumentasi({ page: 1, limit: 6, sortby: "created_at", order: "desc" });
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero Section */}
            <ScrollRevealComponent animations="fade-down" duration={1200}>
                <div className="relative bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>

                    <div className="container mx-auto px-6 py-24 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg text-white">
                                Rum Fararur Production
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-white/90">
                                Menciptakan Karya Musik Berkualitas dengan Sentuhan Profesional
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/musik" className="btn btn-lg btn-neutral gap-2">
                                    <Music size={24} />
                                    Jelajahi Musik
                                </Link>
                                <Link href="/jadwal" className="btn btn-lg btn-outline btn-neutral gap-2">
                                    <Calendar size={24} />
                                    Lihat Jadwal
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollRevealComponent>

            {/* Karya Musik Terbaru */}
            <section className="container mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Music className="text-primary" size={32} />
                            Karya Musik Terbaru
                        </h2>
                        <p className="text-base-content/70 mt-2">
                            Dengarkan koleksi musik terbaru kami
                        </p>
                    </div>
                    <Link href="/musik" className="btn btn-primary gap-2">
                        Lihat Semua
                        <ArrowRight size={20} />
                    </Link>
                </div>

                {loadingMusik ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dtKaryaMusik.data.slice(0, 6).map((music) => (
                            <MusicCard key={music.id} music={music} />
                        ))}
                    </div>
                )}

                {!loadingMusik && dtKaryaMusik.data.length === 0 && (
                    <div className="text-center py-12">
                        <Music size={64} className="mx-auto text-base-content/30 mb-4" />
                        <p className="text-base-content/60">Belum ada karya musik tersedia</p>
                    </div>
                )}
            </section>

            {/* Jadwal Kegiatan Mendatang */}
            <section className="bg-base-100 py-16">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                <Calendar className="text-secondary" size={32} />
                                Jadwal Kegiatan Mendatang
                            </h2>
                            <p className="text-base-content/70 mt-2">
                                Jangan lewatkan acara dan kegiatan menarik kami
                            </p>
                        </div>
                        <Link href="/jadwal" className="btn btn-secondary gap-2">
                            Lihat Semua
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    {loadingJadwal ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dtJadwalKegiatan.data.slice(0, 3).map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}

                    {!loadingJadwal && dtJadwalKegiatan.data.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar size={64} className="mx-auto text-base-content/30 mb-4" />
                            <p className="text-base-content/60">Belum ada jadwal kegiatan tersedia</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Galeri Dokumentasi */}
            <section className="container mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Camera className="text-accent" size={32} />
                            Galeri Dokumentasi
                        </h2>
                        <p className="text-base-content/70 mt-2">
                            Lihat momen-momen berharga kami
                        </p>
                    </div>
                    <Link href="/galeri" className="btn btn-accent gap-2">
                        Lihat Semua
                        <ArrowRight size={20} />
                    </Link>
                </div>

                {loadingDokumentasi ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dtDokumentasi.data.slice(0, 6).map((item) => (
                            <GalleryCard key={item.id} item={item} />
                        ))}
                    </div>
                )}

                {!loadingDokumentasi && dtDokumentasi.data.length === 0 && (
                    <div className="text-center py-12">
                        <Camera size={64} className="mx-auto text-base-content/30 mb-4" />
                        <p className="text-base-content/60">Belum ada dokumentasi tersedia</p>
                    </div>
                )}
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-primary to-secondary py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-4 text-white">
                        Bergabunglah dengan Kami
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        Mari ciptakan karya musik yang menginspirasi bersama Rum Fararur Production
                    </p>
                    <Link href="/jadwal" className="btn btn-lg btn-neutral gap-2">
                        <Play size={24} />
                        Mulai Sekarang
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;

