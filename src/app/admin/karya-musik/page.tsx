/** @format */

// src/app/karya-musik/page.tsx
"use client";

import React from "react";
import { Plus, Edit, Trash2, ExternalLink, Music } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import KaryaMusikForm from "@/components/forms/KaryaMusikForm";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import { KaryaMusik } from "@/types";
import toast from "react-hot-toast";
import moment from "moment";
import { url_storage } from "@/services/baseURL";

const KaryaMusikPage: React.FC = () => {
  const { dtKaryaMusik, loading, setKaryaMusik, removeData } = useKaryaMusik();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<KaryaMusik | null>(null);
  const [filters, setFilters] = React.useState({
    search: "",
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
        <div className="flex gap-1">
          {record.url_video && (
            <Button
              variant="ghost"
              size="sm"
              icon={ExternalLink}
              onClick={() => handleViewFile(record.url_video || "")}
              className="btn-xs"
            >
              Video
            </Button>
          )}
          {record.url_audio && (
            <Button
              variant="ghost"
              size="sm"
              icon={Music}
              onClick={() => handleViewFile(record.url_audio || "")}
              className="btn-xs"
            >
              Audio
            </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchBox
              placeholder="Cari judul, artis, atau genre..."
              onSearch={(value) => setFilters({ ...filters, search: value })}
            />
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
    </div>
  );
};

export default KaryaMusikPage;
