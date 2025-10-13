/** @format */

// src/app/karya-musik/page.tsx
"use client";

import React from "react";
import { Plus, Edit, Trash2, ExternalLink, Music, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import KaryaMusikForm from "@/components/forms/KaryaMusikForm";
import MusicPlayerModal from "@/components/ui/MusicPlayerModal";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import { KaryaMusik } from "@/types";
import toast from "react-hot-toast";
import moment from "moment";
import { url_storage } from "@/services/baseURL";

const KaryaMusikPage: React.FC = () => {
  const { dtKaryaMusik, loading, setKaryaMusik, removeData, getGenres } = useKaryaMusik();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<KaryaMusik | null>(null);
  const [genres, setGenres] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState({
    search: "",
    sortby: "",
    order: "desc",
    genre: "",
  });
  const [selectedMusic, setSelectedMusic] = React.useState<KaryaMusik | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [playerType, setPlayerType] = React.useState<'audio' | 'video'>('audio');

  // Load data
  React.useEffect(() => {
    loadData();
    loadGenres();
  }, []);

  const loadGenres = async () => {
    const result = await getGenres();
    if (result.status === "berhasil" && result.data) {
      setGenres(result.data);
    }
  };

  React.useEffect(() => {
    const debounce = setTimeout(() => {
      loadData();
    }, 500);
    return () => clearTimeout(debounce);
  }, [filters]);

  const loadData = async () => {
    await setKaryaMusik({
      page: dtKaryaMusik.current_page,
      limit: 10,
      ...filters,
    });
  };

  const handleEdit = (data: KaryaMusik) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
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
    setKaryaMusik({
      page,
      limit: 10,
      ...filters,
    });
  };

  const columns = [
    {
      key: "thumbnail" as keyof KaryaMusik,
      title: "Thumbnail",
      render: (value: string) => (
        <div className="avatar">
          <div className="w-16 h-16 rounded">
            {value ? (
              <img
                src={`${url_storage}/${value}`}
                alt="Thumbnail"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="bg-gray-200 flex items-center justify-center w-full h-full">
                <Music className="text-gray-400" size={24} />
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "judul" as keyof KaryaMusik,
      title: "Judul",
      sortable: true,
      render: (value: string, record: KaryaMusik) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">oleh {record.nm_artis}</div>
        </div>
      ),
    },
    {
      key: "genre" as keyof KaryaMusik,
      title: "Genre",
      render: (value: string) => (
        <span className="badge badge-outline">{value || "-"}</span>
      ),
    },
    {
      key: "tgl_rilis" as keyof KaryaMusik,
      title: "Tanggal Rilis",
      sortable: true,
      render: (value: string) =>
        value ? moment(value).format("DD/MM/YYYY") : "-",
    },
    {
      key: "kategori" as keyof KaryaMusik,
      title: "Kategori",
      render: (value: any) => (
        <div className="flex flex-wrap gap-1">
          {value?.map((kategori: any) => (
            <span key={kategori.id} className="badge badge-primary badge-sm">
              {kategori.nm_kategori}
            </span>
          )) || "-"}
        </div>
      ),
    },
    {
      key: "url_video" as keyof KaryaMusik,
      title: "Media",
      render: (value: string, record: KaryaMusik) => (
        <div className="flex flex-wrap gap-1">
          {record.url_video && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={() => handlePlayMusic(record, 'video')}
                className="btn-xs"
                title="Play Video"
              >
                Video
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={ExternalLink}
                onClick={() => handleViewFile(record.url_video || "")}
                className="btn-xs"
                title="Open in new tab"
              />
            </>
          )}
          {record.url_audio && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={() => handlePlayMusic(record, 'audio')}
                className="btn-xs"
                title="Play Audio"
              >
                Audio
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={ExternalLink}
                onClick={() => handleViewFile(record.url_audio || "")}
                className="btn-xs"
                title="Open in new tab"
              />
            </>
          )}
          {!record.url_video && !record.url_audio && (
            <span className="text-gray-400 text-xs">No media</span>
          )}
        </div>
      ),
    },
    {
      key: "id" as keyof KaryaMusik,
      title: "Aksi",
      render: (value: number, record: KaryaMusik) => (
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

  const handleViewFile = (filePath: string) => {
    const fileUrl = `${url_storage}/${filePath}`;
    window.open(fileUrl, "_blank");
  };

  const handlePlayMusic = (music: KaryaMusik, type: 'audio' | 'video') => {
    setSelectedMusic(music);
    setPlayerType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedMusic(null), 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Karya Musik</h1>
        <Button icon={Plus} onClick={() => setShowForm(true)}>
          Tambah Karya Musik
        </Button>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <SearchBox
              placeholder="Cari judul, artis, atau genre..."
              onSearch={(value) => setFilters({ ...filters, search: value })}
            />
            <div className="form-control">
              <label className="label">
                <span className="label-text">Filter Genre</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
              >
                <option value="">Semua Genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <Table data={dtKaryaMusik.data} columns={columns} loading={loading} />
          <Pagination
            currentPage={dtKaryaMusik.current_page}
            totalPages={dtKaryaMusik.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Form Modal */}
      <KaryaMusikForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editData={editData}
      />

      {/* Music Player Modal */}
      <MusicPlayerModal
        isOpen={showModal}
        onClose={handleCloseModal}
        music={selectedMusic}
        type={playerType}
      />
    </div>
  );
};

export default KaryaMusikPage;
