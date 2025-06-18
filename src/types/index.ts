/** @format */

// src/types/index.ts

export interface KaryaMusik {
  id: number;
  judul: string;
  deskripsi?: string;
  nm_artis: string;
  genre?: string;
  tgl_rilis?: string;
  url_video?: string;
  url_audio?: string;
  thumbnail?: string;
  kategori?: Kategori[];
  dokumentasi?: Dokumentasi[];
  created_at: string;
  updated_at: string;
}

export interface JadwalKegiatan {
  id: number;
  judul: string;
  deskripsi?: string;
  jenis: "acara" | "sesi_studio" | "konser" | "rekaman";
  waktu_mulai: string;
  waktu_selesai: string;
  lokasi?: string;
  harga?: number;
  maksimal_peserta?: number;
  peserta_saat_ini: number;
  status: "terjadwal" | "berlangsung" | "selesai" | "dibatalkan";
  catatan?: string;
  kategori?: Kategori[];
  dokumentasi?: Dokumentasi[];
  created_at: string;
  updated_at: string;
}

export interface Dokumentasi {
  id: number;
  judul: string;
  deskripsi?: string;
  jenis: "foto" | "video";
  file_dokumentasi: string;
  url_embed?: string;
  thumbnail?: string;
  tgl_dokumentasi?: string;
  lokasi?: string;
  terdokumentasi_type?: string;
  terdokumentasi_id?: number;
  terdokumentasi?: KaryaMusik | JadwalKegiatan;
  created_at: string;
  updated_at: string;
}

export interface Kategori {
  id: number;
  nm_kategori: string;
  slug: string;
  deskripsi?: string;
  jenis: "musik" | "acara" | "dokumentasi";
  aktif: boolean;
  karya_musik?: KaryaMusik[];
  jadwal_kegiatan?: JadwalKegiatan[];
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface StoreParams {
  page?: number;
  limit?: number;
  search?: string;
  sortby?: string;
  order?: string;
}

export interface UploadResponse {
  path: string;
  url: string;
  filename: string;
}
