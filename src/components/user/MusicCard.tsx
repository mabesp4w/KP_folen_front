/** @format */

// src/components/user/MusicCard.tsx
"use client";

import React from "react";
import { Music, Play, ExternalLink, Eye } from "lucide-react";
import { KaryaMusik } from "@/types";
import { url_storage } from "@/services/baseURL";
import moment from "moment";
import Link from "next/link";

interface MusicCardProps {
    music: KaryaMusik;
    onPlay?: (music: KaryaMusik) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({ music, onPlay }) => {
    return (
        <div
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
        >
            <figure className="relative h-48 overflow-hidden">
                {music.thumbnail ? (
                    <img
                        src={`${url_storage}/${music.thumbnail}`}
                        alt={music.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Music size={64} className="text-white opacity-50" />
                    </div>
                )}
                {onPlay && (music.url_audio || music.url_video) && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <button
                            onClick={() => onPlay(music)}
                            className="btn btn-circle btn-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <Play size={24} />
                        </button>
                    </div>
                )}
            </figure>

            <div className="card-body">
                <h3 className="card-title text-lg">
                    {music.judul}
                    {music.genre && (
                        <span className="badge badge-secondary badge-sm">{music.genre}</span>
                    )}
                </h3>
                <p className="text-sm text-base-content/70">
                    <Music size={14} className="inline mr-1" />
                    {music.nm_artis}
                </p>
                {music.tgl_rilis && (
                    <p className="text-xs text-base-content/50">
                        Rilis: {moment(music.tgl_rilis).format("DD MMMM YYYY")}
                    </p>
                )}
                {music.deskripsi && (
                    <p className="text-sm text-base-content/70 line-clamp-2 mt-2">
                        {music.deskripsi}
                    </p>
                )}

                {/* Kategori */}
                {music.kategori && music.kategori.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {music.kategori.map((kat) => (
                            <span key={kat.id} className="badge badge-outline badge-xs">
                                {kat.nm_kategori}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="card-actions justify-end mt-4">
                    <Link
                        href={`/musik/${music.id}`}
                        className="btn btn-sm btn-primary gap-1"
                    >
                        <Eye size={14} />
                        Detail
                    </Link>
                    {music.url_video && (
                        <a
                            href={music.url_video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-ghost gap-1"
                        >
                            <ExternalLink size={14} />
                            Video
                        </a>
                    )}
                    {music.url_audio && (
                        <a
                            href={music.url_audio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-ghost gap-1"
                        >
                            <ExternalLink size={14} />
                            Audio
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicCard;

