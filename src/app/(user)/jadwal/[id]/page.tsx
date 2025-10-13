/** @format */

// src/app/(user)/jadwal/[id]/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Calendar,
    ArrowLeft,
    MapPin,
    Clock,
    Users,
    DollarSign,
} from "lucide-react";
import useJadwalKegiatan from "@/stores/crud/useJadwalKegiatan";
import ScrollRevealComponent from "@/components/ui/ScrollRevealComponent";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import moment from "moment";
import { JadwalKegiatan } from "@/types";

const JadwalDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { setShowJadwalKegiatan } = useJadwalKegiatan();
    const [event, setEvent] = React.useState<JadwalKegiatan | null>(null);
    const [loading, setLoading] = React.useState(true);

    const loadData = React.useCallback(async () => {
        setLoading(true);
        const result = await setShowJadwalKegiatan(params.id as string);
        if (result.status === "berhasil" && result.data) {
            setEvent(result.data);
        }
        setLoading(false);
    }, [params.id, setShowJadwalKegiatan]);

    React.useEffect(() => {
        loadData();
    }, [loadData]);

    const getStatusBadge = (status: string) => {
        const badges = {
            terjadwal: { class: "badge-info", label: "Terjadwal" },
            berlangsung: { class: "badge-success", label: "Berlangsung" },
            selesai: { class: "badge-neutral", label: "Selesai" },
            dibatalkan: { class: "badge-error", label: "Dibatalkan" },
        };
        return badges[status as keyof typeof badges] || { class: "badge-ghost", label: status };
    };

    const getJenisBadge = (jenis: string) => {
        const badges = {
            acara: { class: "badge-primary", label: "Acara" },
            sesi_studio: { class: "badge-secondary", label: "Sesi Studio" },
            konser: { class: "badge-accent", label: "Konser" },
            rekaman: { class: "badge-warning", label: "Rekaman" },
        };
        return badges[jenis as keyof typeof badges] || { class: "badge-ghost", label: jenis };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <Calendar size={64} className="mx-auto text-base-content/30 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Jadwal Tidak Ditemukan</h2>
                    <button onClick={() => router.back()} className="btn btn-primary mt-4">
                        <ArrowLeft size={20} />
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    const statusBadge = getStatusBadge(event.status);
    const jenisBadge = getJenisBadge(event.jenis);

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <ScrollRevealComponent animations="fade-down" duration={1000}>
                <div className="bg-gradient-to-r from-secondary to-accent text-secondary-content py-8">
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
                        {/* Title and Badges */}
                        <ScrollRevealComponent animations="fade-up" delay={100}>
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className={`badge ${jenisBadge.class} badge-lg`}>
                                            {jenisBadge.label}
                                        </span>
                                        <span className={`badge ${statusBadge.class} badge-lg`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>

                                    <h1 className="text-4xl font-bold mb-4">{event.judul}</h1>

                                    {event.deskripsi && (
                                        <div className="prose max-w-none">
                                            <p className="text-base-content/80 text-lg">{event.deskripsi}</p>
                                        </div>
                                    )}

                                    {/* Kategori */}
                                    {event.kategori && event.kategori.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {event.kategori.map((kat) => (
                                                <span key={kat.id} className="badge badge-outline">
                                                    {kat.nm_kategori}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollRevealComponent>

                        {/* Additional Info */}
                        {event.catatan && (
                            <ScrollRevealComponent animations="fade-up" delay={200}>
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <h3 className="card-title">Catatan</h3>
                                        <p className="text-base-content/70">{event.catatan}</p>
                                    </div>
                                </div>
                            </ScrollRevealComponent>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Time & Location */}
                        <ScrollRevealComponent animations="fade-left" delay={150}>
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title text-lg mb-4">Waktu & Lokasi</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-base-content/60 mb-2">Waktu Mulai</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <Calendar size={16} className="text-primary" />
                                                {moment(event.waktu_mulai).format("DD MMMM YYYY")}
                                            </p>
                                            <p className="font-semibold flex items-center gap-2 ml-6">
                                                <Clock size={16} className="text-primary" />
                                                {moment(event.waktu_mulai).format("HH:mm")}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-base-content/60 mb-2">Waktu Selesai</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <Calendar size={16} className="text-secondary" />
                                                {moment(event.waktu_selesai).format("DD MMMM YYYY")}
                                            </p>
                                            <p className="font-semibold flex items-center gap-2 ml-6">
                                                <Clock size={16} className="text-secondary" />
                                                {moment(event.waktu_selesai).format("HH:mm")}
                                            </p>
                                        </div>

                                        {event.lokasi && (
                                            <div>
                                                <p className="text-sm text-base-content/60 mb-2">Lokasi</p>
                                                <p className="font-semibold flex items-center gap-2">
                                                    <MapPin size={16} className="text-accent" />
                                                    {event.lokasi}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollRevealComponent>

                        {/* Participants & Price */}
                        <ScrollRevealComponent animations="fade-left" delay={200}>
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h3 className="card-title text-lg mb-4">Detail Lainnya</h3>

                                    <div className="space-y-4">
                                        {event.maksimal_peserta && (
                                            <div>
                                                <p className="text-sm text-base-content/60 mb-2">Peserta</p>
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} className="text-info" />
                                                    <span className="font-semibold">
                                                        {event.peserta_saat_ini} / {event.maksimal_peserta}
                                                    </span>
                                                </div>
                                                <progress
                                                    className="progress progress-info w-full mt-2"
                                                    value={event.peserta_saat_ini}
                                                    max={event.maksimal_peserta}
                                                ></progress>
                                            </div>
                                        )}

                                        {event.harga !== undefined && event.harga > 0 && (
                                            <div>
                                                <p className="text-sm text-base-content/60 mb-2">Harga</p>
                                                <p className="font-semibold flex items-center gap-2 text-success text-xl">
                                                    <DollarSign size={20} />
                                                    Rp {event.harga.toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollRevealComponent>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JadwalDetailPage;

