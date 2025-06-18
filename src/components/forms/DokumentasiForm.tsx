/** @format */

// src/components/forms/DokumentasiForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Image, Video } from "lucide-react";
import { Dokumentasi } from "@/types";
import useDokumentasi from "@/stores/crud/useDokumentasi";
import useKaryaMusik from "@/stores/crud/useKaryaMusik";
import useJadwalKegiatan from "@/stores/crud/useJadwalKegiatan";
import toast from "react-hot-toast";

interface DokumentasiFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Dokumentasi | null;
}

const DokumentasiForm: React.FC<DokumentasiFormProps> = ({
  isOpen,
  onClose,
  editData,
}) => {
  const { addData, updateData, uploadFile } = useDokumentasi();
  const { dtKaryaMusik, setKaryaMusik } = useKaryaMusik();
  const { dtJadwalKegiatan, setJadwalKegiatan } = useJadwalKegiatan();
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Dokumentasi>({
    defaultValues: editData || {},
  });

  const watchJenis = watch("jenis");
  const watchTerdokumentasiType = watch("terdokumentasi_type");

  // Load related data
  React.useEffect(() => {
    if (isOpen) {
      setKaryaMusik({ page: 1, limit: 100 });
      setJadwalKegiatan({ page: 1, limit: 100 });
    }
  }, [isOpen, setKaryaMusik, setJadwalKegiatan]);

  // Reset form when editData changes
  React.useEffect(() => {
    if (editData) {
      reset(editData);
      setUploadedFile(editData.file_dokumentasi || "");
    } else {
      reset({});
      setUploadedFile("");
    }
  }, [editData, reset]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const jenis = watchJenis;
    if (!jenis) {
      toast.error("Pilih jenis dokumentasi terlebih dahulu");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFile(file, jenis);
      if (result.status === "berhasil" && result.data) {
        setUploadedFile(result.data.path);
        setValue("file_dokumentasi", result.data.path);
        if (!watch("thumbnail") && jenis === "video") {
          setValue("thumbnail", result.data.path);
        }
        toast.success("File berhasil diupload");
      } else {
        toast.error("Gagal upload file");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal upload file");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
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
        reset();
        setUploadedFile("");
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

  const jenisOptions = [
    { value: "foto", label: "Foto" },
    { value: "video", label: "Video" },
  ];

  const terdokumentasiTypeOptions = [
    { value: "", label: "Tidak terkait" },
    { value: "App\\Models\\KaryaMusik", label: "Karya Musik" },
    { value: "App\\Models\\JadwalKegiatan", label: "Jadwal Kegiatan" },
  ];

  const getRelatedOptions = () => {
    if (watchTerdokumentasiType === "App\\Models\\KaryaMusik") {
      return dtKaryaMusik.data.map((item) => ({
        value: item.id,
        label: `${item.judul} - ${item.nm_artis}`,
      }));
    } else if (watchTerdokumentasiType === "App\\Models\\JadwalKegiatan") {
      return dtJadwalKegiatan.data.map((item) => ({
        value: item.id,
        label: item.judul,
      }));
    }
    return [];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? "Edit Dokumentasi" : "Tambah Dokumentasi"}
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
            label="Tanggal Dokumentasi"
            type="date"
            {...register("tgl_dokumentasi")}
            error={errors.tgl_dokumentasi?.message}
          />

          <Input
            label="Lokasi"
            {...register("lokasi")}
            error={errors.lokasi?.message}
          />
        </div>

        {/* File Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">File Dokumentasi *</span>
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept={watchJenis === "foto" ? "image/*" : "video/*"}
              onChange={handleFileUpload}
              className="file-input file-input-bordered flex-1"
              disabled={uploading || !watchJenis}
            />
            {uploading && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            {watchJenis === "foto" ? (
              <Image size={20} className="text-gray-400" />
            ) : (
              <Video size={20} className="text-gray-400" />
            )}
          </div>
          {uploadedFile && (
            <div className="mt-2">
              <span className="text-sm text-success">
                ✓ File terupload: {uploadedFile.split("/").pop()}
              </span>
            </div>
          )}
          <input
            type="hidden"
            {...register("file_dokumentasi", {
              required: "File dokumentasi harus diupload",
            })}
          />
          {errors.file_dokumentasi && (
            <span className="text-error text-sm mt-1">
              {errors.file_dokumentasi.message}
            </span>
          )}
        </div>

        {/* URL Embed for external videos */}
        {watchJenis === "video" && (
          <Input
            label="URL Embed"
            type="url"
            {...register("url_embed")}
            error={errors.url_embed?.message}
            helperText="URL video eksternal (YouTube, Vimeo, dll)"
          />
        )}

        <Input
          label="Thumbnail"
          {...register("thumbnail")}
          error={errors.thumbnail?.message}
          helperText="URL thumbnail (opsional)"
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

        {/* Related Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Terkait Dengan"
            options={terdokumentasiTypeOptions}
            native
            {...register("terdokumentasi_type")}
            error={errors.terdokumentasi_type?.message}
          />

          {watchTerdokumentasiType && (
            <Select
              label="Item Terkait"
              options={getRelatedOptions()}
              native
              {...register("terdokumentasi_id")}
              error={errors.terdokumentasi_id?.message}
            />
          )}
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

export default DokumentasiForm;
