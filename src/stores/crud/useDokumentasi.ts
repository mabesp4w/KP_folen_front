/** @format */

// src/stores/useDokumentasi.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import {
  Dokumentasi,
  PaginatedData,
  StoreParams,
  UploadResponse,
} from "@/types";

type Store = {
  dtDokumentasi: PaginatedData<Dokumentasi>;
  loading: boolean;

  setDokumentasi: (
    params: StoreParams & {
      jenis?: string;
      terdokumentasi_type?: string;
    }
  ) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  setShowDokumentasi: (id: number | string) => Promise<{
    status: string;
    data?: Dokumentasi;
    error?: any;
  }>;

  addData: (data: Partial<Dokumentasi>) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  removeData: (id: number | string) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  updateData: (
    id: number | string,
    data: Partial<Dokumentasi>
  ) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  uploadFile: (
    file: File,
    jenis: string
  ) => Promise<{
    status: string;
    data?: UploadResponse;
    error?: any;
  }>;

  getByRelated: (
    type: string,
    id: number
  ) => Promise<{
    status: string;
    data?: Dokumentasi[];
    error?: any;
  }>;

  getGallery: (search?: string) => Promise<{
    status: string;
    data?: PaginatedData<Dokumentasi>;
    error?: any;
  }>;
};

const useDokumentasi = create<Store>()(
  devtools((set) => ({
    dtDokumentasi: {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
    loading: false,

    setDokumentasi: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      jenis,
      terdokumentasi_type,
    }) => {
      try {
        set({ loading: true });
        const response = await crud({
          method: "get",
          url: "/dokumentasi",
          params: {
            page,
            limit,
            search,
            sortby,
            order,
            jenis,
            terdokumentasi_type,
          },
        });

        set({
          dtDokumentasi: response.data.data,
          loading: false,
        });

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        set({ loading: false });
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    setShowDokumentasi: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/dokumentasi/${id}`,
        });

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    addData: async (data) => {
      try {
        const response = await crud({
          method: "post",
          url: "/dokumentasi",
          data,
        });

        set((prevState) => ({
          dtDokumentasi: {
            ...prevState.dtDokumentasi,
            data: [response.data.data, ...prevState.dtDokumentasi.data],
            total: prevState.dtDokumentasi.total + 1,
          },
        }));

        return {
          status: "berhasil tambah",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    removeData: async (id) => {
      try {
        const response = await crud({
          method: "delete",
          url: `/dokumentasi/${id}`,
        });

        set((prevState) => ({
          dtDokumentasi: {
            ...prevState.dtDokumentasi,
            data: prevState.dtDokumentasi.data.filter((item) => item.id !== id),
            total: prevState.dtDokumentasi.total - 1,
          },
        }));

        return {
          status: "berhasil hapus",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    updateData: async (id, data) => {
      try {
        const response = await crud({
          method: "put",
          url: `/dokumentasi/${id}`,
          data,
        });

        set((prevState) => ({
          dtDokumentasi: {
            ...prevState.dtDokumentasi,
            data: prevState.dtDokumentasi.data.map((item) =>
              item.id === id ? { ...item, ...response.data.data } : item
            ),
          },
        }));

        return {
          status: "berhasil update",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    uploadFile: async (file, jenis) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("jenis", jenis);

        const response = await crud({
          method: "post",
          url: "/dokumentasi/upload",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    getByRelated: async (type, id) => {
      try {
        const response = await crud({
          method: "get",
          url: "/dokumentasi/data/related",
          params: { type, id },
        });

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    getGallery: async (search) => {
      try {
        const response = await crud({
          method: "get",
          url: "/dokumentasi/data/gallery",
          params: { search },
        });

        return {
          status: "berhasil",
          data: response.data.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },
  }))
);

export default useDokumentasi;
