/** @format */

// src/components/user/GalleryCard.tsx
"use client";

import React from "react";
import { Camera, Video, MapPin, Calendar } from "lucide-react";
import { Dokumentasi } from "@/types";
import { url_storage } from "@/services/baseURL";
import moment from "moment";

interface GalleryCardProps {
    item: Dokumentasi;
    onClick?: (item: Dokumentasi) => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
    const getThumbnail = () => {
        if (item.thumbnail) {
            return `${url_storage}/${item.thumbnail}`;
        }
        if (item.jenis === "foto") {
            return `${url_storage}/${item.file_dokumentasi}`;
        }
        return null;
    };

    return (
        <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            onClick={() => onClick && onClick(item)}
        >
            <figure className="relative h-64 overflow-hidden">
                {getThumbnail() ? (
                    <img
                        src={getThumbnail()!}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent to-info flex items-center justify-center">
                        {item.jenis === "foto" ? (
                            <Camera size={64} className="text-white opacity-50" />
                        ) : (
                            <Video size={64} className="text-white opacity-50" />
                        )}
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.jenis === "foto" ? (
                            <Camera size={48} className="text-white" />
                        ) : (
                            <Video size={48} className="text-white" />
                        )}
                    </div>
                </div>

                {/* Badge Jenis */}
                <div className="absolute top-2 right-2">
                    <span
                        className={`badge ${item.jenis === "foto" ? "badge-primary" : "badge-secondary"
                            } badge-sm`}
                    >
                        {item.jenis === "foto" ? "Foto" : "Video"}
                    </span>
                </div>
            </figure>

            <div className="card-body p-4">
                <h3 className="card-title text-base">{item.judul}</h3>

                {item.deskripsi && (
                    <p className="text-sm text-base-content/70 line-clamp-2">
                        {item.deskripsi}
                    </p>
                )}

                <div className="space-y-1 mt-2">
                    {item.tgl_dokumentasi && (
                        <div className="flex items-center gap-2 text-xs text-base-content/60">
                            <Calendar size={12} />
                            <span>
                                {moment(item.tgl_dokumentasi).format("DD MMMM YYYY")}
                            </span>
                        </div>
                    )}

                    {item.lokasi && (
                        <div className="flex items-center gap-2 text-xs text-base-content/60">
                            <MapPin size={12} />
                            <span>{item.lokasi}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryCard;

