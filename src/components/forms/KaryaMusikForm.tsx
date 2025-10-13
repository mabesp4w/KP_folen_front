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
import { Image } from "lucide-react";

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
  const { addData, updateData, uploadFile, getGenres } = useKaryaMusik();
  const { getByJenis } = useKategori();
  const [loading, setLoading] = React.useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = React.useState(false);
  const [uploadedThumbnail, setUploadedThumbnail] = React.useState<string>("");
  const [kategoriOptions, setKategoriOptions] = React.useState<Kategori[]>([]);
  const [genreOptions, setGenreOptions] = React.useState<string[]>([]);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KaryaMusik>({
    defaultValues: {
      ...editData,
      kategori: [],
    },
  });

  const watchKategori = watch("kategori") || [];

  // Load kategori musik and genres
  React.useEffect(() => {
    const loadKategori = async () => {
      const result = await getByJenis("musik");
      if (result.status === "berhasil" && result.data) {
        setKategoriOptions(result.data);
      }
    };
    const loadGenres = async () => {
      const result = await getGenres();
      if (result.status === "berhasil" && result.data) {
        setGenreOptions(result.data);
      }
    };
    if (isOpen) {
      loadKategori();
      loadGenres();
    }
  }, [isOpen, getByJenis, getGenres]);

  // Reset form when editData changes or modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (editData) {
        const kategoriFormatted = editData.kategori?.map((item: any) => ({
          value: item.id,
          label: item.nm_kategori,
        })) || [];

        reset({
          ...editData,
          kategori: kategoriFormatted as any,
        });
        setUploadedThumbnail(editData.thumbnail || "");
      } else {
        reset({
          kategori: [],
        });
        setUploadedThumbnail("");
      }
    }
  }, [editData, isOpen, reset]);

  const handleThumbnailUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const result = await uploadFile(file, "thumbnail");
      if (result.status === "berhasil" && result.data) {
        setUploadedThumbnail(result.data.path);
        setValue("thumbnail", result.data.path);
        toast.success("Thumbnail berhasil diupload");
      } else {
        toast.error("Gagal upload thumbnail");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal upload thumbnail");
    } finally {
      setUploadingThumbnail(false);
    }
  };


  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = {
        ...data,
        kategori_ids: data.kategori?.map((item: any) => item?.value || item) || [],
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
        reset({ kategori: [] });
        setUploadedThumbnail("");
        onClose();
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
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Genre</span>
            </label>
            <input
              list="genre-options"
              className="input input-bordered w-full"
              placeholder="Pilih atau ketik genre..."
              {...register("genre")}
            />
            <datalist id="genre-options">
              {genreOptions.map((genre) => (
                <option key={genre} value={genre} />
              ))}
            </datalist>
            {errors.genre && (
              <span className="text-error text-sm mt-1">
                {errors.genre.message}
              </span>
            )}
          </div>

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

          {/* Thumbnail Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Thumbnail</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="file-input file-input-bordered flex-1"
                disabled={uploadingThumbnail}
              />
              {uploadingThumbnail && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              <Image size={20} className="text-gray-400" />
            </div>
            {uploadedThumbnail && (
              <div className="mt-2">
                <span className="text-sm text-success">
                  ✓ Thumbnail terupload: {uploadedThumbnail.split("/").pop()}
                </span>
              </div>
            )}
            <input
              type="hidden"
              {...register("thumbnail")}
            />
            {errors.thumbnail && (
              <span className="text-error text-sm mt-1">
                {errors.thumbnail.message}
              </span>
            )}
          </div>

          <Select
            label="Kategori"
            options={kategoriSelectOptions}
            isMulti
            value={watchKategori}
            onChange={(event: any) => setValue("kategori", event.target.value)}
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
