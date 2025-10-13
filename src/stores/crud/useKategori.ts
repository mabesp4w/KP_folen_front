/** @format */
// src/stores/useKategori.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { Kategori, PaginatedData, StoreParams } from "@/types";

type Store = {
  dtKategori: PaginatedData<Kategori>;
  loading: boolean;

  setKategori: (
    params: StoreParams & { jenis?: string; aktif?: boolean }
  ) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  setShowKategori: (id: number | string) => Promise<{
    status: string;
    data?: Kategori;
    error?: any;
  }>;

  addData: (data: Partial<Kategori>) => Promise<{
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
    data: Partial<Kategori>
  ) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  getByJenis: (jenis: string) => Promise<{
    status: string;
    data?: Kategori[];
    error?: any;
  }>;

  toggleAktif: (id: number | string) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  generateSlug: (nm_kategori: string) => Promise<{
    status: string;
    data?: { slug: string };
    error?: any;
  }>;
};

const useKategori = create<Store>()(
  devtools((set) => ({
    dtKategori: {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
    loading: false,

    setKategori: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      jenis,
      aktif,
    }) => {
      try {
        set({ loading: true });
        const response = await crud({
          method: "get",
          url: "/kategori",
          params: {
            page,
            limit,
            search,
            sortby,
            order,
            jenis,
            aktif,
          },
        });

        set({
          dtKategori: response.data.data,
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

    setShowKategori: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/kategori/${id}`,
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
          url: "/kategori",
          data,
        });

        set((prevState) => ({
          dtKategori: {
            ...prevState.dtKategori,
            data: [response.data.data, ...prevState.dtKategori.data],
            total: prevState.dtKategori.total + 1,
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
          url: `/kategori/${id}`,
        });

        set((prevState) => ({
          dtKategori: {
            ...prevState.dtKategori,
            data: prevState.dtKategori.data.filter((item) => item.id !== id),
            total: prevState.dtKategori.total - 1,
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
          url: `/kategori/${id}`,
          data,
        });

        set((prevState) => ({
          dtKategori: {
            ...prevState.dtKategori,
            data: prevState.dtKategori.data.map((item) =>
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

    getByJenis: async (jenis) => {
      try {
        const response = await crud({
          method: "get",
          url: `/kategori/jenis/${jenis}`,
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

    toggleAktif: async (id) => {
      try {
        const response = await crud({
          method: "patch",
          url: `/kategori/${id}/toggle-aktif`,
        });

        set((prevState) => ({
          dtKategori: {
            ...prevState.dtKategori,
            data: prevState.dtKategori.data.map((item) =>
              item.id === id ? { ...item, ...response.data.data } : item
            ),
          },
        }));

        return {
          status: "berhasil",
          data: response.data,
        };
      } catch (error: any) {
        return {
          status: "error",
          error: error.response?.data,
        };
      }
    },

    generateSlug: async (nm_kategori) => {
      try {
        const response = await crud({
          method: "post",
          url: "/kategori/generate-slug",
          data: { nm_kategori },
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

export default useKategori;
