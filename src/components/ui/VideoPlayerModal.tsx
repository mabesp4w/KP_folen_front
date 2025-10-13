/** @format */

// src/components/ui/VideoPlayerModal.tsx
"use client";

import React from "react";
import { X, Calendar, MapPin, Play } from "lucide-react";
import { Dokumentasi } from "@/types";
import { url_storage } from "@/services/baseURL";
import moment from "moment";
import dynamic from "next/dynamic";

// Import ReactPlayer dynamically to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player"), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Loading player...</div>
}) as any;

interface VideoPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: Dokumentasi | null;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ isOpen, onClose, item }) => {
    const [playing, setPlaying] = React.useState(false);
    const playerRef = React.useRef<any>(null);

    React.useEffect(() => {
        if (!isOpen) {
            setPlaying(false);
        }
    }, [isOpen]);

    // Handle keyboard events
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.code === "Space") {
                e.preventDefault();
                setPlaying(!playing);
            } else if (e.code === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isOpen, playing, onClose]);

    if (!isOpen || !item) return null;

    const isVideo = item.jenis === "video";

    // Prioritize url_embed (for YouTube, Vimeo, etc), then fall back to file_dokumentasi
    const mediaUrl = isVideo
        ? (item.url_embed || `${url_storage}/${item.file_dokumentasi}`)
        : `${url_storage}/${item.file_dokumentasi}`;

    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/90 z-50 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div
                    className="relative w-full max-w-6xl bg-base-100 rounded-lg shadow-2xl overflow-hidden animate-scaleIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 btn btn-circle btn-sm bg-black/70 text-white hover:bg-black/90 border-none"
                    >
                        <X size={20} />
                    </button>

                    {/* Media Container */}
                    <div className="relative bg-black">
                        {isVideo ? (
                            <div className="relative aspect-video w-full">
                                {/* React Player */}
                                <ReactPlayer
                                    ref={playerRef}
                                    url={mediaUrl}
                                    playing={playing}
                                    volume={0.8}
                                    width="100%"
                                    height="100%"
                                    controls={true}
                                    onPlay={() => setPlaying(true)}
                                    onPause={() => setPlaying(false)}
                                />

                                {/* Play Overlay (shown when paused) */}
                                {!playing && (
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity hover:bg-black/40"
                                        onClick={handlePlayPause}
                                    >
                                        <div className="btn btn-circle btn-lg btn-primary shadow-2xl">
                                            <Play size={32} fill="currentColor" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Image Display
                            <div className="relative">
                                <img
                                    src={mediaUrl}
                                    alt={item.judul}
                                    className="w-full max-h-[70vh] object-contain"
                                />
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="p-6 bg-base-100">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2 text-base-content">{item.judul}</h2>
                                {item.deskripsi && (
                                    <p className="text-base-content/70 leading-relaxed">{item.deskripsi}</p>
                                )}
                            </div>
                            <span
                                className={`badge ${item.jenis === "foto" ? "badge-primary" : "badge-secondary"
                                    } badge-lg gap-2`}
                            >
                                {item.jenis === "foto" ? "📷 Foto" : "🎬 Video"}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            {item.tgl_dokumentasi && (
                                <div className="flex items-center gap-2 text-base-content/60">
                                    <Calendar size={16} className="text-primary" />
                                    <span>{moment(item.tgl_dokumentasi).format("DD MMMM YYYY")}</span>
                                </div>
                            )}
                            {item.lokasi && (
                                <div className="flex items-center gap-2 text-base-content/60">
                                    <MapPin size={16} className="text-secondary" />
                                    <span>{item.lokasi}</span>
                                </div>
                            )}
                        </div>

                        {/* Additional Info for Videos */}
                        {isVideo && item.url_embed && (
                            <div className="mt-4 p-3 bg-base-200 rounded-lg">
                                <p className="text-xs text-base-content/60">
                                    🔗 Video dari: {
                                        item.url_embed.includes('youtube') ? 'YouTube' :
                                            item.url_embed.includes('vimeo') ? 'Vimeo' :
                                                item.url_embed.includes('dailymotion') ? 'Dailymotion' :
                                                    'External Source'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default VideoPlayerModal;

