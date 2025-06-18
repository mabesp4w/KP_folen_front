/** @format */

// src/app/(dashboard)/jadwal-kegiatan/page.tsx
"use client";

import React from "react";
import { Plus, Edit, Trash2, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBox } from "@/components/ui/SearchBox";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import JadwalKegiatanForm from "@/components/forms/JadwalKegiatanForm";
import useJadwalKegiatan from "@/stores/crud/useJadwalKegiatan";
import { JadwalKegiatan } from "@/types";
import toast from "react-hot-toast";
import moment from "moment";

const JadwalKegiatanPage: React.FC = () => {
  const { dtJadwalKegiatan, loading, setJadwalKegiatan, removeData } =
    useJadwalKegiatan();
  const [showForm, setShowForm] = React.useState(false);
  const [editData, setEditData] = React.useState<JadwalKegiatan | null>(null);
  const [filters, setFilters] = React.useState({
    search: "",
    jenis: "",
    status: "",
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
    await setJadwalKegiatan({
      page: dtJadwalKegiatan.current_page,
      limit: 10,
      ...filters,
    });
  };

  const handleEdit = (data: JadwalKegiatan) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal kegiatan ini?")) {
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
    setJadwalKegiatan({
      page,
      limit: 10,
      ...filters,
    });
  };

  // const jenisOptions = [
  //   { value: "", label: "Semua Jenis" },
  //   { value: "acara", label: "Acara" },
  //   { value: "sesi_studio", label: "Sesi Studio" },
  //   { value: "konser", label: "Konser" },
  //   { value: "rekaman", label: "Rekaman" },
  // ];

  // const statusOptions = [
  //   { value: "", label: "Semua Status" },
  //   { value: "terjadwal", label: "Terjadwal" },
  //   { value: "berlangsung", label: "Berlangsung" },
  //   { value: "selesai", label: "Selesai" },
  //   { value: "dibatalkan", label: "Dibatalkan" },
  // ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "terjadwal":
        return "badge-info";
      case "berlangsung":
        return "badge-warning";
      case "selesai":
        return "badge-success";
      case "dibatalkan":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const getJenisBadgeClass = (jenis: string) => {
    switch (jenis) {
      case "acara":
        return "badge-primary";
      case "sesi_studio":
        return "badge-secondary";
      case "konser":
        return "badge-accent";
      case "rekaman":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  const columns = [
    {
      key: "judul" as keyof JadwalKegiatan,
      title: "Kegiatan",
      sortable: true,
      render: (value: string, record: JadwalKegiatan) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar size={12} />
            {moment(record.waktu_mulai).format("DD/MM/YYYY HH:mm")}
          </div>
          {record.lokasi && (
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={12} />
              {record.lokasi}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "jenis" as keyof JadwalKegiatan,
      title: "Jenis",
      render: (value: string) => (
        <span className={`badge ${getJenisBadgeClass(value)}`}>
          {value.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "waktu_mulai" as keyof JadwalKegiatan,
      title: "Waktu",
      sortable: true,
      render: (value: string, record: JadwalKegiatan) => (
        <div className="text-sm">
          <div>Mulai: {moment(value).format("DD/MM HH:mm")}</div>
          <div>
            Selesai: {moment(record.waktu_selesai).format("DD/MM HH:mm")}
          </div>
        </div>
      ),
    },
    {
      key: "peserta_saat_ini" as keyof JadwalKegiatan,
      title: "Peserta",
      render: (value: number, record: JadwalKegiatan) => (
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>
            {value}
            {record.maksimal_peserta ? `/${record.maksimal_peserta}` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "harga" as keyof JadwalKegiatan,
      title: "Harga",
      render: (value: number) => (
        <span>
          {value ? `Rp ${Number(value).toLocaleString("id-ID")}` : "Gratis"}
        </span>
      ),
    },
    {
      key: "status" as keyof JadwalKegiatan,
      title: "Status",
      render: (value: string) => (
        <span className={`badge ${getStatusBadgeClass(value)}`}>{value}</span>
      ),
    },
    {
      key: "kategori" as keyof JadwalKegiatan,
      title: "Kategori",
      render: (value: any) => (
        <div className="flex flex-wrap gap-1">
          {value?.map((kategori: any) => (
            <span key={kategori.id} className="badge badge-outline badge-sm">
              {kategori.nm_kategori}
            </span>
          )) || "-"}
        </div>
      ),
    },
    {
      key: "id" as keyof JadwalKegiatan,
      title: "Aksi",
      render: (value: number, record: JadwalKegiatan) => (
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
        <h1 className="text-3xl font-bold">Jadwal Kegiatan</h1>
        <Button icon={Plus} onClick={() => setShowForm(true)}>
          Tambah Jadwal
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

      {/* Table */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <Table
            data={dtJadwalKegiatan.data}
            columns={columns}
            loading={loading}
          />
          <Pagination
            currentPage={dtJadwalKegiatan.current_page}
            totalPages={dtJadwalKegiatan.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Form Modal */}
      <JadwalKegiatanForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editData={editData}
      />
    </div>
  );
};

export default JadwalKegiatanPage;
