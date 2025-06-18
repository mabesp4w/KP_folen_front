/** @format */

// src/components/forms/JadwalKegiatanForm.tsx
"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { JadwalKegiatan, Kategori } from "@/types";
import useJadwalKegiatan from "@/stores/crud/useJadwalKegiatan";
import useKategori from "@/stores/crud/useKategori";
import toast from "react-hot-toast";
import moment from "moment";

interface JadwalKegiatanFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: JadwalKegiatan | null;
}

const JadwalKegiatanForm: React.FC<JadwalKegiatanFormProps> = ({
  isOpen,
  onClose,
  editData,
}) => {
  const { addData, updateData } = useJadwalKegiatan();
  const { getByJenis } = useKategori();
  const [loading, setLoading] = React.useState(false);
  const [kategoriOptions, setKategoriOptions] = React.useState<Kategori[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<JadwalKegiatan>({
    defaultValues: editData || {
      peserta_saat_ini: 0,
      status: "terjadwal",
    },
  });

  // Load kategori acara
  React.useEffect(() => {
    const loadKategori = async () => {
      const result = await getByJenis("acara");
      if (result.status === "berhasil" && result.data) {
        setKategoriOptions(result.data);
      }
    };
    if (isOpen) {
      loadKategori();
    }
  }, [isOpen, getByJenis]);

  // Reset form when editData changes
  React.useEffect(() => {
    if (editData) {
      reset({
        ...editData,
        waktu_mulai: moment(editData.waktu_mulai).format("YYYY-MM-DDTHH:mm"),
        waktu_selesai: moment(editData.waktu_selesai).format(
          "YYYY-MM-DDTHH:mm"
        ),
      });
    } else {
      reset({
        peserta_saat_ini: 0,
        status: "terjadwal",
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = {
        ...data,
        kategori_ids: data.kategori_ids?.map((item: any) => item.value) || [],
      };

      let result;
      if (editData) {
        result = await updateData(editData.id, formData);
      } else {
        result = await addData(formData);
      }

      if (result.status.includes("berhasil")) {
        toast.success(
          editData ? "Data berhasil diubah" : "Data berhasil ditambahkan"
        );
        onClose();
        reset();
      } else {
        toast.error(result.error?.message || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const kategoriSelectOptions = kategoriOptions.map((item) => ({
    value: item.id,
    label: item.nm_kategori,
  }));

  const jenisOptions = [
    { value: "acara", label: "Acara" },
    { value: "sesi_studio", label: "Sesi Studio" },
    { value: "konser", label: "Konser" },
    { value: "rekaman", label: "Rekaman" },
  ];

  const statusOptions = [
    { value: "terjadwal", label: "Terjadwal" },
    { value: "berlangsung", label: "Berlangsung" },
    { value: "selesai", label: "Selesai" },
    { value: "dibatalkan", label: "Dibatalkan" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Jadwal Kegiatan" : "Tambah Jadwal Kegiatan"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Judul *"
            {...register("judul", { required: "Judul harus diisi" })}
            error={errors.judul?.message}
          />

          <Select
            label="Jenis *"
            options={jenisOptions}
            native
            {...register("jenis", { required: "Jenis harus dipilih" })}
            error={errors.jenis?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Waktu Mulai *"
            type="datetime-local"
            {...register("waktu_mulai", {
              required: "Waktu mulai harus diisi",
            })}
            error={errors.waktu_mulai?.message}
          />

          <Input
            label="Waktu Selesai *"
            type="datetime-local"
            {...register("waktu_selesai", {
              required: "Waktu selesai harus diisi",
            })}
            error={errors.waktu_selesai?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Lokasi"
            {...register("lokasi")}
            error={errors.lokasi?.message}
          />

          <Input
            label="Harga"
            type="number"
            min="0"
            step="0.01"
            {...register("harga", {
              min: { value: 0, message: "Harga tidak boleh negatif" },
            })}
            error={errors.harga?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Maksimal Peserta"
            type="number"
            min="1"
            {...register("maksimal_peserta", {
              min: { value: 1, message: "Minimal 1 peserta" },
            })}
            error={errors.maksimal_peserta?.message}
          />

          <Input
            label="Peserta Saat Ini"
            type="number"
            min="0"
            {...register("peserta_saat_ini", {
              min: { value: 0, message: "Tidak boleh negatif" },
            })}
            error={errors.peserta_saat_ini?.message}
          />

          <Select
            label="Status"
            options={statusOptions}
            native
            {...register("status")}
            error={errors.status?.message}
          />
        </div>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Deskripsi</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={3}
              {...register("deskripsi")}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Catatan</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              rows={2}
              {...register("catatan")}
            />
          </div>

          <Controller
            name="kategori"
            control={control}
            render={({ field }) => (
              <Select
                label="Kategori"
                options={kategoriSelectOptions}
                isMulti
                {...field}
                placeholder="Pilih kategori..."
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            {editData ? "Simpan" : "Tambah"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JadwalKegiatanForm;
