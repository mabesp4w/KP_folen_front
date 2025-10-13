/** @format */

// src/components/ui/MusicPlayerModal.tsx
"use client";

import React from "react";
import { X, Music as MusicIcon, Calendar } from "lucide-react";
import { KaryaMusik } from "@/types";
import moment from "moment";
import dynamic from "next/dynamic";
import { url_storage } from "@/services/baseURL";

// Import ReactPlayer dynamically to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full min-h-[400px] bg-black">
            <div className="text-center text-white">
                <div className="loading loading-spinner loading-lg mb-4"></div>
                <p>Loading ReactPlayer...</p>
            </div>
        </div>
    )
}) as any;

interface MusicPlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    music: KaryaMusik | null;
    type?: 'audio' | 'video';
}

const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({ isOpen, onClose, music, type = 'audio' }) => {
    const [hasError, setHasError] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);

    // Reset error state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setHasError(false);
            setIsReady(false);
        }
    }, [isOpen]);

    // Handle keyboard events
    React.useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.code === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isOpen, onClose]);

    if (!isOpen || !music) return null;

    // Get raw URL from music data
    const rawUrl = type === 'video' ? music.url_video : music.url_audio;

    // Helper function to check if URL is external
    const isExternalUrl = (url: string | undefined): boolean => {
        if (!url) return false;
        return url.startsWith('http://') ||
            url.startsWith('https://') ||
            url.includes('youtube') ||
            url.includes('youtu.be') ||
            url.includes('vimeo') ||
            url.includes('soundcloud') ||
            url.includes('spotify');
    };

    // Extract YouTube video ID
    const getYouTubeVideoId = (url: string): string | null => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            // For youtube.com
            if (urlObj.hostname.includes('youtube.com')) {
                return urlObj.searchParams.get('v');
            }
            // For youtu.be
            if (urlObj.hostname.includes('youtu.be')) {
                return urlObj.pathname.slice(1).split('?')[0];
            }
        } catch (e) {
            console.error('Error extracting YouTube ID:', e);
        }
        return null;
    };

    // Clean YouTube URL - remove extra parameters that might cause issues
    const cleanYouTubeUrl = (url: string): string => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = getYouTubeVideoId(url);
            if (videoId) {
                return `https://www.youtube.com/watch?v=${videoId}`;
            }
        }
        return url;
    };

    // Build final media URL
    let mediaUrl: string | undefined;
    if (rawUrl) {
        if (isExternalUrl(rawUrl)) {
            mediaUrl = cleanYouTubeUrl(rawUrl);
        } else {
            mediaUrl = `${url_storage}/${rawUrl}`;
        }
    }

    // Get YouTube Video ID if applicable
    const youtubeVideoId = rawUrl && (rawUrl.includes('youtube') || rawUrl.includes('youtu.be'))
        ? getYouTubeVideoId(rawUrl)
        : null;

    // Debug: Log media information
    console.log('=== Music Player Modal Debug ===');
    console.log('Type:', type);
    console.log('Raw URL:', rawUrl);
    console.log('Cleaned URL:', rawUrl && isExternalUrl(rawUrl) ? cleanYouTubeUrl(rawUrl) : rawUrl);
    console.log('Final Media URL:', mediaUrl);
    console.log('YouTube Video ID:', youtubeVideoId);
    console.log('Is External:', isExternalUrl(rawUrl));
    console.log('Storage URL:', url_storage);
    console.log('Music Data:', {
        id: music.id,
        judul: music.judul,
        url_video: music.url_video,
        url_audio: music.url_audio
    });
    console.log('================================');

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
                    className="relative w-full max-w-4xl bg-base-100 rounded-lg shadow-2xl overflow-hidden animate-scaleIn"
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
                        {mediaUrl ? (
                            <div className={`relative ${type === 'video' ? 'aspect-video' : 'aspect-[16/9]'} w-full`}>
                                {/* YouTube Iframe (Primary for YouTube videos) */}
                                {youtubeVideoId ? (
                                    <>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&modestbranding=1&rel=0&controls=1`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            onLoad={() => {
                                                console.log('✅ YouTube iframe loaded!');
                                                setIsReady(true);
                                            }}
                                            onError={() => {
                                                console.error('❌ YouTube iframe error');
                                                setHasError(true);
                                            }}
                                        />
                                        {!isReady && !hasError && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 pointer-events-none">
                                                <div className="text-center text-white">
                                                    <div className="loading loading-spinner loading-lg mb-4"></div>
                                                    <p>Loading YouTube video...</p>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Loading Overlay */}
                                        {!isReady && !hasError && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                                                <div className="text-center text-white">
                                                    <div className="loading loading-spinner loading-lg mb-4"></div>
                                                    <p>Loading {type === 'video' ? 'video' : 'audio'}...</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Error Overlay */}
                                        {hasError && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-error/20 to-error/40 z-10">
                                                <div className="text-center text-white p-6">
                                                    <div className="text-6xl mb-4">⚠️</div>
                                                    <p className="text-xl font-bold mb-2">Tidak dapat memutar media</p>
                                                    <p className="text-sm opacity-80 mb-4">
                                                        File mungkin rusak atau format tidak didukung
                                                    </p>
                                                    <div className="text-xs opacity-60 max-w-md break-all">
                                                        URL: {mediaUrl}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* React Player for non-YouTube content */}
                                        <ReactPlayer
                                            url={mediaUrl}
                                            playing={true}
                                            volume={0.8}
                                            width="100%"
                                            height="100%"
                                            controls={true}
                                            onReady={() => {
                                                console.log('✅ Player ready!');
                                                setIsReady(true);
                                            }}
                                            onError={(error: unknown) => {
                                                console.error('❌ Player error:', error);
                                                setHasError(true);
                                            }}
                                            onBuffer={() => console.log('⏳ Buffering...')}
                                            onBufferEnd={() => console.log('✅ Buffer end')}
                                            config={{
                                                vimeo: {
                                                    playerOptions: {
                                                        autoplay: true,
                                                        controls: true
                                                    }
                                                },
                                                file: {
                                                    attributes: {
                                                        controlsList: 'nodownload',
                                                        preload: 'metadata'
                                                    }
                                                }
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        ) : (
                            // No Media Available
                            <div className="aspect-video w-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <div className="text-center text-white">
                                    <MusicIcon size={64} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-xl">Media tidak tersedia</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="p-6 bg-base-100">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2 text-base-content">{music.judul}</h2>
                                <p className="text-lg text-base-content/70 mb-2">
                                    <MusicIcon size={16} className="inline mr-2" />
                                    {music.nm_artis}
                                </p>
                                {music.deskripsi && (
                                    <p className="text-base-content/70 leading-relaxed">{music.deskripsi}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className={`badge ${type === 'audio' ? 'badge-primary' : 'badge-secondary'} badge-lg gap-2`}>
                                    {type === 'audio' ? '🎵 Audio' : '🎬 Video'}
                                </span>
                                {music.genre && (
                                    <span className="badge badge-outline badge-lg">
                                        {music.genre}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            {music.tgl_rilis && (
                                <div className="flex items-center gap-2 text-base-content/60">
                                    <Calendar size={16} className="text-primary" />
                                    <span>Rilis: {moment(music.tgl_rilis).format("DD MMMM YYYY")}</span>
                                </div>
                            )}
                            {music.kategori && music.kategori.length > 0 && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    {music.kategori.map((kat) => (
                                        <span key={kat.id} className="badge badge-outline badge-sm">
                                            {kat.nm_kategori}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 space-y-2">
                            {/* Media Source Info */}
                            {mediaUrl && isExternalUrl(rawUrl) && (
                                <div className="p-3 bg-base-200 rounded-lg">
                                    <p className="text-xs text-base-content/60">
                                        🔗 Media dari: {
                                            mediaUrl.includes('youtube') || mediaUrl.includes('youtu.be') ? 'YouTube' :
                                                mediaUrl.includes('vimeo') ? 'Vimeo' :
                                                    mediaUrl.includes('soundcloud') ? 'SoundCloud' :
                                                        mediaUrl.includes('spotify') ? 'Spotify' :
                                                            'External Source'
                                        }
                                    </p>
                                </div>
                            )}

                            {/* Dummy File Warning */}
                            {mediaUrl && !isExternalUrl(rawUrl) && (
                                <div className="alert alert-warning shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-bold">File Dummy</h3>
                                        <div className="text-xs">File ini adalah file dummy dari seeder. Untuk testing yang sebenarnya, ubah URL di database menjadi URL YouTube/Vimeo atau upload file video/audio yang valid.</div>
                                    </div>
                                </div>
                            )}
                        </div>
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

export default MusicPlayerModal;

