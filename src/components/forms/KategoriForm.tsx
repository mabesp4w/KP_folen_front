/** @format */

// src/components/forms/KategoriForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Kategori } from "@/types";
import useKategori from "@/stores/crud/useKategori";
import toast from "react-hot-toast";

interface KategoriFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Kategori | null;
}

const KategoriForm: React.FC<KategoriFormProps> = ({
  isOpen,
  onClose,
  editData,
}) => {
  const { addData, updateData, generateSlug } = useKategori();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Kategori>({
    defaultValues: editData || { aktif: true },
  });

  const watchNmKategori = watch("nm_kategori");

  // Reset form when editData changes
  React.useEffect(() => {
    if (editData) {
      reset(editData);
    } else {
      reset({ aktif: true });
    }
  }, [editData, reset]);

  // Auto generate slug
  React.useEffect(() => {
    if (watchNmKategori && !editData) {
      const generateSlugFromName = async () => {
        const result = await generateSlug(watchNmKategori);
        if (result.status === "berhasil" && result.data) {
          setValue("slug", result.data.slug);
        }
      };
      const debounce = setTimeout(generateSlugFromName, 500);
      return () => clearTimeout(debounce);
    }
  }, [watchNmKategori, editData, generateSlug, setValue]);

  const onSubmit = async (data: Kategori) => {
    setLoading(true);
    try {
      let result;
      if (editData) {
        result = await updateData(editData.id, data);
      } else {
        result = await addData(data);
      }

      if (result.status.includes("berhasil")) {
        toast.success(
          editData ? "Data berhasil diubah" : "Data berhasil ditambahkan"
        );
        onClose();
        reset({ aktif: true });
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

  const jenisOptions = [
    { value: "musik", label: "Musik" },
    { value: "acara", label: "Acara" },
    { value: "dokumentasi", label: "Dokumentasi" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Kategori" : "Tambah Kategori"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nama Kategori *"
          {...register("nm_kategori", {
            required: "Nama kategori harus diisi",
          })}
          error={errors.nm_kategori?.message}
        />

        <Input
          label="Slug *"
          {...register("slug", { required: "Slug harus diisi" })}
          error={errors.slug?.message}
          helperText="URL-friendly name (otomatis dibuat dari nama kategori)"
        />

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

        <Select
          label="Jenis *"
          options={jenisOptions}
          native
          {...register("jenis", { required: "Jenis kategori harus dipilih" })}
          error={errors.jenis?.message}
        />

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              {...register("aktif")}
            />
            <span className="label-text">Aktif</span>
          </label>
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

export default KategoriForm;
