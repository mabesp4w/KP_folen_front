/** @format */

// src/app/(dashboard)/dokumentasi/page.tsx
"use client";

import React from "react";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Eye,
  Grid,
  List,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { Modal } from "@/components/ui/Modal";
import DokumentasiForm from "@/components/forms/DokumentasiForm";
import useDokumentasi from "@/stores/crud/useDokumentasi";
import { Dokumentasi } from "@/types";
import toast from "react-hot-toast";
import moment from "moment";
import { url_storage } from "@/services/baseURL";
import Image from "next/image";

const DokumentasiPage: React.FC = () => {
  const { dtDokumentasi, loading, setDokumentasi, removeData } =
    useDokumentasi();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<Dokumentasi | null>(null);
  const [viewMode, setViewMode] = React.useState<"list" | "gallery">("gallery");
  const [selectedImage, setSelectedImage] = React.useState<Dokumentasi | null>(
    null
  );
  const [filters, setFilters] = React.useState({
    search: "",
    jenis: "",
    terdokumentasi_type: "",
    sortby: "",
    order: "desc",
  });

  // Load data
  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      loadData();
    }, 500);
    return () => clearTimeout(debounce);
  }, [filters]);

  const loadData = async () => {
    await setDokumentasi({
      page: dtDokumentasi.current_page,
      limit: viewMode === "gallery" ? 20 : 10,
      ...filters,
    });
  };

  const handleEdit = (data: Dokumentasi) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) {
      const result = await removeData(id);
      if (result.status.includes("berhasil")) {
        toast.success("Data berhasil dihapus");
      } else {
        toast.error("Gagal menghapus data");
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  const handlePageChange = (page: number) => {
    setDokumentasi({
      page,
      limit: viewMode === "gallery" ? 20 : 10,
      ...filters,
    });
  };

  const handleViewFile = (filePath: string) => {
    const fileUrl = `${url_storage}/${filePath}`;
    window.open(fileUrl, "_blank");
  };

  const handleViewModeChange = (mode: "list" | "gallery") => {
    setViewMode(mode);
    // Reload data with different pagination limit
    setTimeout(() => {
      setDokumentasi({
        page: 1,
        limit: mode === "gallery" ? 20 : 10,
        ...filters,
      });
    }, 100);
  };

  // const jenisOptions = [
  //   { value: "", label: "Semua Jenis" },
  //   { value: "foto", label: "Foto" },
  //   { value: "video", label: "Video" },
  // ];

  // const terdokumentasiOptions = [
  //   { value: "", label: "Semua Relasi" },
  //   { value: "App\\Models\\KaryaMusik", label: "Karya Musik" },
  //   { value: "App\\Models\\JadwalKegiatan", label: "Jadwal Kegiatan" },
  // ];

  const getRelatedText = (record: Dokumentasi) => {
    if (!record.terdokumentasi) return "-";

    if (record.terdokumentasi_type === "App\\Models\\KaryaMusik") {
      const karya = record.terdokumentasi as any;
      return `${karya.judul} - ${karya.nm_artis}`;
    } else if (record.terdokumentasi_type === "App\\Models\\JadwalKegiatan") {
      const jadwal = record.terdokumentasi as any;
      return jadwal.judul;
    }

    return "-";
  };

  const columns = [
    {
      key: "judul" as keyof Dokumentasi,
      title: "Dokumentasi",
      sortable: true,
      render: (value: string, record: Dokumentasi) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded">
              {record.jenis === "foto" ? (
                record.thumbnail || record.file_dokumentasi ? (
                  <Image
                    src={`${url_storage}/${
                      record.thumbnail || record.file_dokumentasi
                    }`}
                    alt={value}
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <ImageIcon size={20} className="text-gray-400" />
                  </div>
                )
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Video size={20} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              {record.jenis === "foto" ? (
                <ImageIcon size={12} />
              ) : (
                <Video size={12} />
              )}
              {record.jenis}
            </div>
            {record.lokasi && (
              <div className="text-sm text-gray-500">{record.lokasi}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "tgl_dokumentasi" as keyof Dokumentasi,
      title: "Tanggal",
      sortable: true,
      render: (value: string) =>
        value ? moment(value).format("DD/MM/YYYY") : "-",
    },
    {
      key: "terdokumentasi" as keyof Dokumentasi,
      title: "Terkait",
      render: (value: any, record: Dokumentasi) => (
        <div>
          <div className="text-sm">
            {record.terdokumentasi_type === "App\\Models\\KaryaMusik" && (
              <span className="badge badge-primary badge-sm">Karya Musik</span>
            )}
            {record.terdokumentasi_type === "App\\Models\\JadwalKegiatan" && (
              <span className="badge badge-secondary badge-sm">Jadwal</span>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {getRelatedText(record)}
          </div>
        </div>
      ),
    },
    {
      key: "deskripsi" as keyof Dokumentasi,
      title: "Deskripsi",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || "-"}
        </div>
      ),
    },
    {
      key: "file_dokumentasi" as keyof Dokumentasi,
      title: "File",
      render: (value: string, record: Dokumentasi) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => handleViewFile(value)}
            className="btn-xs"
          >
            Lihat
          </Button>
          {record.url_embed && (
            <Button
              variant="ghost"
              size="sm"
              icon={ExternalLink}
              onClick={() => window.open(record.url_embed, "_blank")}
              className="btn-xs"
            >
              Embed
            </Button>
          )}
        </div>
      ),
    },
    {
      key: "id" as keyof Dokumentasi,
      title: "Aksi",
      render: (value: number, record: Dokumentasi) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => handleEdit(record)}
            className="btn-xs"
          />
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => handleDelete(value)}
            className="btn-xs"
          />
        </div>
      ),
    },
  ];

  // Gallery View Component
  const GalleryView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {dtDokumentasi.data.map((item) => (
          <div
            key={item.id}
            className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <figure className="relative aspect-square bg-gray-100 overflow-hidden">
              {item.jenis === "foto" ? (
                <Image
                  src={`${url_storage}/${
                    item.thumbnail || item.file_dokumentasi
                  }`}
                  alt={item.judul}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedImage(item)}
                  width={128}
                  height={128}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"
                  onClick={() => handleViewFile(item.file_dokumentasi)}
                >
                  <div className="text-center">
                    <Video size={32} className="text-gray-500 mx-auto mb-2" />
                    <Play size={24} className="text-primary mx-auto" />
                  </div>
                </div>
              )}

              {/* Overlay dengan actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleViewFile(item.file_dokumentasi)}
                    className="btn-sm text-white hover:bg-white hover:text-black"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    onClick={() => handleEdit(item)}
                    className="btn-sm text-white hover:bg-white hover:text-black"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(item.id)}
                    className="btn-sm text-white hover:bg-red-500"
                  />
                </div>
              </div>

              {/* Badge jenis */}
              <div className="absolute top-2 left-2">
                <span
                  className={`badge badge-sm ${
                    item.jenis === "foto" ? "badge-info" : "badge-warning"
                  }`}
                >
                  {item.jenis}
                </span>
              </div>
            </figure>

            <div className="card-body p-3">
              <h3
                className="card-title text-sm font-medium truncate"
                title={item.judul}
              >
                {item.judul}
              </h3>

              {item.tgl_dokumentasi && (
                <p className="text-xs text-gray-500">
                  {moment(item.tgl_dokumentasi).format("DD MMM YYYY")}
                </p>
              )}

              {item.lokasi && (
                <p
                  className="text-xs text-gray-600 truncate"
                  title={item.lokasi}
                >
                  📍 {item.lokasi}
                </p>
              )}

              {/* Related badge */}
              {item.terdokumentasi_type && (
                <div className="mt-2">
                  <span
                    className={`badge badge-xs ${
                      item.terdokumentasi_type === "App\\Models\\KaryaMusik"
                        ? "badge-primary"
                        : "badge-secondary"
                    }`}
                  >
                    {item.terdokumentasi_type === "App\\Models\\KaryaMusik"
                      ? "Musik"
                      : "Jadwal"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {dtDokumentasi.data.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Belum ada dokumentasi</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dokumentasi</h1>
        <Button icon={Plus} onClick={() => setShowForm(true)}>
          Tambah Dokumentasi
        </Button>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchBox
              placeholder="Cari judul, lokasi..."
              onSearch={(value) => setFilters({ ...filters, search: value })}
            />
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="btn-group">
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            icon={List}
            onClick={() => handleViewModeChange("list")}
          >
            List
          </Button>
          <Button
            variant={viewMode === "gallery" ? "primary" : "outline"}
            size="sm"
            icon={Grid}
            onClick={() => handleViewModeChange("gallery")}
          >
            Gallery
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <Table
              data={dtDokumentasi.data}
              columns={columns}
              loading={loading}
            />
            <Pagination
              currentPage={dtDokumentasi.current_page}
              totalPages={dtDokumentasi.last_page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <GalleryView />
            <Pagination
              currentPage={dtDokumentasi.current_page}
              totalPages={dtDokumentasi.last_page}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.judul || "Preview"}
        size="xl"
      >
        {selectedImage && (
          <div className="space-y-4">
            <div className="text-center">
              <Image
                src={`${url_storage}/${
                  selectedImage.thumbnail || selectedImage.file_dokumentasi
                }`}
                alt={selectedImage.judul}
                className="max-w-full max-h-96 mx-auto rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Judul:</strong> {selectedImage.judul}
              </div>
              <div>
                <strong>Jenis:</strong> {selectedImage.jenis}
              </div>
              {selectedImage.tgl_dokumentasi && (
                <div>
                  <strong>Tanggal:</strong>{" "}
                  {moment(selectedImage.tgl_dokumentasi).format("DD MMMM YYYY")}
                </div>
              )}
              {selectedImage.lokasi && (
                <div>
                  <strong>Lokasi:</strong> {selectedImage.lokasi}
                </div>
              )}
            </div>

            {selectedImage.deskripsi && (
              <div>
                <strong>Deskripsi:</strong>
                <p className="mt-1 text-gray-600">{selectedImage.deskripsi}</p>
              </div>
            )}

            <div className="flex justify-center gap-2">
              <Button
                variant="primary"
                icon={Eye}
                onClick={() => handleViewFile(selectedImage.file_dokumentasi)}
              >
                Lihat Full Size
              </Button>
              <Button
                variant="outline"
                icon={Edit}
                onClick={() => {
                  setSelectedImage(null);
                  handleEdit(selectedImage);
                }}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Form Modal */}
      <DokumentasiForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editData={editData}
      />
    </div>
  );
};

export default DokumentasiPage;
