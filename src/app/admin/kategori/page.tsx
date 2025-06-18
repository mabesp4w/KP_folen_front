/** @format */

// src/app/kategori/page.tsx
"use client";

import React from "react";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import KategoriForm from "@/components/forms/KategoriForm";
import useKategori from "@/stores/crud/useKategori";
import { Kategori } from "@/types";
import toast from "react-hot-toast";

const KategoriPage: React.FC = () => {
  const { dtKategori, loading, setKategori, removeData, toggleAktif } =
    useKategori();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<Kategori | null>(null);
  const [filters, setFilters] = React.useState({
    search: "",
    jenis: "",
    aktif: "",
    sortby: "",
    order: "asc",
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
    await setKategori({
      page: dtKategori.current_page,
      limit: 10,
      ...filters,
      aktif: filters.aktif ? filters.aktif === "true" : undefined,
    });
  };

  const handleEdit = (data: Kategori) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      const result = await removeData(id);
      if (result.status.includes("berhasil")) {
        toast.success("Kategori berhasil dihapus");
      } else {
        toast.error(result.error?.message || "Gagal menghapus kategori");
      }
    }
  };

  const handleToggleAktif = async (id: number) => {
    const result = await toggleAktif(id);
    if (result.status === "berhasil") {
      toast.success("Status kategori berhasil diubah");
    } else {
      toast.error("Gagal mengubah status kategori");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  const handlePageChange = (page: number) => {
    setKategori({
      page,
      limit: 10,
      ...filters,
      aktif: filters.aktif ? filters.aktif === "true" : undefined,
    });
  };

  const columns = [
    {
      key: "nm_kategori" as keyof Kategori,
      title: "Nama Kategori",
      sortable: true,
      render: (value: string, record: Kategori) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">/{record.slug}</div>
        </div>
      ),
    },
    {
      key: "jenis" as keyof Kategori,
      title: "Jenis",
      render: (value: string) => {
        const jenisColors = {
          musik: "badge-primary",
          acara: "badge-secondary",
          dokumentasi: "badge-accent",
        };
        return (
          <span
            className={`badge ${
              jenisColors[value as keyof typeof jenisColors]
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "deskripsi" as keyof Kategori,
      title: "Deskripsi",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || "-"}
        </div>
      ),
    },
    {
      key: "aktif" as keyof Kategori,
      title: "Status",
      render: (value: boolean, record: Kategori) => (
        <Button
          variant="ghost"
          size="sm"
          icon={value ? ToggleRight : ToggleLeft}
          onClick={() => handleToggleAktif(record.id)}
          className={`btn-xs ${value ? "text-success" : "text-error"}`}
        >
          {value ? "Aktif" : "Tidak Aktif"}
        </Button>
      ),
    },
    {
      key: "id" as keyof Kategori,
      title: "Aksi",
      render: (value: number, record: Kategori) => (
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Kategori</h1>
        <Button icon={Plus} onClick={() => setShowForm(true)}>
          Tambah Kategori
        </Button>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SearchBox
              placeholder="Cari nama kategori..."
              onSearch={(value) => setFilters({ ...filters, search: value })}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <Table data={dtKategori.data} columns={columns} loading={loading} />
          <Pagination
            currentPage={dtKategori.current_page}
            totalPages={dtKategori.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Form Modal */}
      <KategoriForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editData={editData}
      />
    </div>
  );
};

export default KategoriPage;
