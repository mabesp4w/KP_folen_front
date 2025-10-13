/** @format */

// src/components/user/EventCard.tsx
"use client";

import React from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { JadwalKegiatan } from "@/types";
import moment from "moment";
import Link from "next/link";

interface EventCardProps {
    event: JadwalKegiatan;
    onDetail?: (event: JadwalKegiatan) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onDetail }) => {
    const getStatusBadge = (status: string) => {
        const badges = {
            terjadwal: "badge-info",
            berlangsung: "badge-success",
            selesai: "badge-neutral",
            dibatalkan: "badge-error",
        };
        return badges[status as keyof typeof badges] || "badge-ghost";
    };

    const getJenisBadge = (jenis: string) => {
        const badges = {
            acara: "badge-primary",
            sesi_studio: "badge-secondary",
            konser: "badge-accent",
            rekaman: "badge-warning",
        };
        return badges[jenis as keyof typeof badges] || "badge-ghost";
    };

    const formatJenis = (jenis: string) => {
        const labels = {
            acara: "Acara",
            sesi_studio: "Sesi Studio",
            konser: "Konser",
            rekaman: "Rekaman",
        };
        return labels[jenis as keyof typeof labels] || jenis;
    };

    const formatStatus = (status: string) => {
        const labels = {
            terjadwal: "Terjadwal",
            berlangsung: "Berlangsung",
            selesai: "Selesai",
            dibatalkan: "Dibatalkan",
        };
        return labels[status as keyof typeof labels] || status;
    };

    return (
        <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300"
        >
            <div className="card-body">
                <div className="flex justify-between items-start">
                    <h3 className="card-title text-lg flex-1">{event.judul}</h3>
                    <div className="flex flex-col gap-1">
                        <span className={`badge ${getJenisBadge(event.jenis)} badge-sm`}>
                            {formatJenis(event.jenis)}
                        </span>
                        <span className={`badge ${getStatusBadge(event.status)} badge-sm`}>
                            {formatStatus(event.status)}
                        </span>
                    </div>
                </div>

                {event.deskripsi && (
                    <p className="text-sm text-base-content/70 line-clamp-2">
                        {event.deskripsi}
                    </p>
                )}

                <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-primary" />
                        <span>
                            {moment(event.waktu_mulai).format("DD MMM YYYY, HH:mm")} -{" "}
                            {moment(event.waktu_selesai).format("HH:mm")}
                        </span>
                    </div>

                    {event.lokasi && (
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin size={16} className="text-secondary" />
                            <span>{event.lokasi}</span>
                        </div>
                    )}

                    {event.maksimal_peserta && (
                        <div className="flex items-center gap-2 text-sm">
                            <Users size={16} className="text-accent" />
                            <span>
                                {event.peserta_saat_ini} / {event.maksimal_peserta} peserta
                            </span>
                            <progress
                                className="progress progress-accent w-20"
                                value={event.peserta_saat_ini}
                                max={event.maksimal_peserta}
                            ></progress>
                        </div>
                    )}

                    {event.harga && event.harga > 0 && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-success">
                            <span>Rp {event.harga.toLocaleString("id-ID")}</span>
                        </div>
                    )}
                </div>

                {/* Kategori */}
                {event.kategori && event.kategori.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {event.kategori.map((kat) => (
                            <span key={kat.id} className="badge badge-outline badge-xs">
                                {kat.nm_kategori}
                            </span>
                        ))}
                    </div>
                )}

                <div className="card-actions justify-end mt-4">
                    <Link
                        href={`/jadwal/${event.id}`}
                        className="btn btn-sm btn-primary"
                    >
                        Detail
                    </Link>
                    {onDetail && (
                        <button
                            onClick={() => onDetail(event)}
                            className="btn btn-sm btn-ghost"
                        >
                            Info
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;

