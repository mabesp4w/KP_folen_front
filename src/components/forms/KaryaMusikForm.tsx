/** @format */

// src/components/forms/KaryaMusikForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { KaryaMusik, Kategori } from "@/types";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import useKategori from "@/stores/crud/useKategori";
import toast from "react-hot-toast";

interface KaryaMusikFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: KaryaMusik | null;
}

const KaryaMusikForm: React.FC<KaryaMusikFormProps> = ({
  isOpen,
  onClose,
  editData,
}) => {
  const { addData, updateData } = useKaryaMusik();
  const { getByJenis } = useKategori();
  const [loading, setLoading] = React.useState(false);
  const [kategoriOptions, setKategoriOptions] = React.useState<Kategori[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KaryaMusik>({
    defaultValues: editData || {},
  });

  // Load kategori musik
  React.useEffect(() => {
    const loadKategori = async () => {
      const result = await getByJenis("musik");
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
      reset(editData);
    } else {
      reset({});
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
      console.error("Error submitting form:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const kategoriSelectOptions = kategoriOptions.map((item) => ({
    value: item.id,
    label: item.nm_kategori,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Karya Musik" : "Tambah Karya Musik"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Judul *"
            {...register("judul", { required: "Judul harus diisi" })}
            error={errors.judul?.message}
          />

          <Input
            label="Nama Artis *"
            {...register("nm_artis", { required: "Nama artis harus diisi" })}
            error={errors.nm_artis?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Genre"
            {...register("genre")}
            error={errors.genre?.message}
          />

          <Input
            label="Tanggal Rilis"
            type="date"
            {...register("tgl_rilis")}
            error={errors.tgl_rilis?.message}
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

          <Input
            label="URL Video"
            type="url"
            {...register("url_video")}
            error={errors.url_video?.message}
            helperText="YouTube, Vimeo, dll"
          />

          <Input
            label="URL Audio"
            type="url"
            {...register("url_audio")}
            error={errors.url_audio?.message}
            helperText="SoundCloud, Spotify, dll"
          />

          <Input
            label="Thumbnail"
            {...register("thumbnail")}
            error={errors.thumbnail?.message}
            helperText="URL gambar thumbnail"
          />

          <Select
            label="Kategori"
            options={kategoriSelectOptions}
            isMulti
            {...register("kategori")}
            placeholder="Pilih kategori..."
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

export default KaryaMusikForm;
