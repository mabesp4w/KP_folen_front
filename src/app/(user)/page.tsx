/** @format */

// src/app/(user)/page.tsx
"use client";

import React from "react";
import {
  Music,
  Calendar,
  Camera,
  ArrowRight,
  Play,
  Facebook,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import useJadwalKegiatan from "@/stores/crud/useJadwalKegiatan";
import useDokumentasi from "@/stores/crud/useDokumentasi";
import MusicCard from "@/components/user/MusicCard";
import EventCard from "@/components/user/EventCard";
import GalleryCard from "@/components/user/GalleryCard";
import ScrollRevealComponent from "@/components/ui/ScrollRevealComponent";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Image from "next/image";

const HomePage: React.FC = () => {
  const {
    dtKaryaMusik,
    setKaryaMusik,
    loading: loadingMusik,
  } = useKaryaMusik();
  const {
    dtJadwalKegiatan,
    setJadwalKegiatan,
    loading: loadingJadwal,
  } = useJadwalKegiatan();
  const {
    dtDokumentasi,
    setDokumentasi,
    loading: loadingDokumentasi,
  } = useDokumentasi();

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load data terbaru untuk ditampilkan di beranda
    await setKaryaMusik({
      page: 1,
      limit: 6,
      sortby: "created_at",
      order: "desc",
    });
    await setJadwalKegiatan({
      page: 1,
      limit: 3,
      sortby: "waktu_mulai",
      order: "asc",
      status: "terjadwal",
    });
    await setDokumentasi({
      page: 1,
      limit: 6,
      sortby: "created_at",
      order: "desc",
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <ScrollRevealComponent animations="fade-down" duration={1200}>
        {/* Profile Overview Card */}
        <div className="card bg-base-100 shadow-xl mb-8 container mx-auto px-6 ">
          <div className="card-body">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Logo and Image Section */}
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative mb-6">
                  <Image
                    src="/images/logo_black.png"
                    alt="Rum Fararur Logo"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="relative mb-6">
                  <Image
                    src="/images/pendiri.jpg"
                    alt="Pendiri Rum Fararur - Epo D'Fenomeno"
                    width={150}
                    height={150}
                    className="rounded-full object-cover shadow-lg border-4 border-primary"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold mb-2">Rum Fararur</h2>
                  <p className="text-lg text-base-content/70 mb-4">
                    Fararur Beba, Wor Beba
                  </p>
                  <div className="badge badge-primary badge-lg">
                    Label Musik Profesional
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-4">
                <p className="text-base-content/80 leading-relaxed">
                  <strong className="text-primary">Rum Fararur</strong> berasal
                  dari bahasa suku Biak, Papua, yang berarti
                  <em className="text-accent">
                    {" "}
                    &ldquo;Rumah (Rum) dan Kerja (Fararur)&rdquo;
                  </em>
                  . Filosofinya adalah
                  <em className="text-accent">
                    {" "}
                    &ldquo;Kerja di rumah adalah salah satu solusi dari inovasi
                    yang bisa kita buat di Papua.&rdquo;
                  </em>
                </p>
                <p className="text-base-content/80 leading-relaxed">
                  Di bawah nama utama Rum Fararur, terdapat sub-label
                  <strong className="text-secondary">
                    {" "}
                    Fararur Beba, Wor Beba
                  </strong>
                  , yang dalam bahasa Indonesia berarti
                  <em className="text-accent">
                    {" "}
                    &ldquo;Pekerjaan Besar untuk Perayaan yang Besar.&rdquo;
                  </em>
                </p>

                {/* Kontak & Saran */}
                <div className="mt-6 p-4 rounded-lg bg-base-200 border border-base-300 space-y-3">
                  <h3 className="text-xl font-semibold text-base-content">
                    Kontak &amp; Saran
                  </h3>
                  <p className="text-base-content/70 text-sm">
                    Untuk kerja sama, pemesanan layanan, atau saran mengenai
                    karya kami, silakan hubungi Rum Fararur Production melalui
                    media sosial berikut:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="https://www.instagram.com/rum.fararur.production?igsh=MXh1cW5lM2Z4MndhMw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline btn-primary gap-2"
                    >
                      <Instagram size={18} />
                      <span className="normal-case">
                        Instagram Rum Fararur Production
                      </span>
                    </Link>
                    <Link
                      href="https://www.facebook.com/share/17e51cVc2L/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline btn-secondary gap-2"
                    >
                      <Facebook size={18} />
                      <span className="normal-case">
                        Facebook Rum Fararur Production
                      </span>
                    </Link>
                  </div>
                </div>
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
            <p className="text-base-content/60">
              Belum ada karya musik tersedia
            </p>
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
              <Calendar
                size={64}
                className="mx-auto text-base-content/30 mb-4"
              />
              <p className="text-base-content/60">
                Belum ada jadwal kegiatan tersedia
              </p>
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
            <p className="text-base-content/60">
              Belum ada dokumentasi tersedia
            </p>
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
            Mari ciptakan karya musik yang menginspirasi bersama Rum Fararur
            Production
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
