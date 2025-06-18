/** @format */

// src/stores/useJadwalKegiatan.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { JadwalKegiatan, PaginatedData, StoreParams } from "@/types";

type Store = {
  dtJadwalKegiatan: PaginatedData<JadwalKegiatan>;
  loading: boolean;

  setJadwalKegiatan: (
    params: StoreParams & {
      jenis?: string;
      status?: string;
    }
  ) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  setShowJadwalKegiatan: (id: number | string) => Promise<{
    status: string;
    data?: JadwalKegiatan;
    error?: any;
  }>;

  addData: (data: Partial<JadwalKegiatan>) => Promise<{
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
    data: Partial<JadwalKegiatan>
  ) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  getByDateRange: (
    start_date: string,
    end_date: string
  ) => Promise<{
    status: string;
    data?: JadwalKegiatan[];
    error?: any;
  }>;

  updatePeserta: (
    id: number | string,
    peserta_saat_ini: number
  ) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;
};

const useJadwalKegiatan = create<Store>()(
  devtools((set) => ({
    dtJadwalKegiatan: {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
    loading: false,

    setJadwalKegiatan: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      jenis,
      status,
    }) => {
      try {
        set({ loading: true });
        const response = await crud({
          method: "get",
          url: "/jadwal-kegiatan",
          params: {
            page,
            limit,
            search,
            sortby,
            order,
            jenis,
            status,
          },
        });

        set({
          dtJadwalKegiatan: response.data.data,
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

    setShowJadwalKegiatan: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/jadwal-kegiatan/${id}`,
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
          url: "/jadwal-kegiatan",
          data,
        });

        set((prevState) => ({
          dtJadwalKegiatan: {
            ...prevState.dtJadwalKegiatan,
            data: [response.data.data, ...prevState.dtJadwalKegiatan.data],
            total: prevState.dtJadwalKegiatan.total + 1,
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
          url: `/jadwal-kegiatan/${id}`,
        });

        set((prevState) => ({
          dtJadwalKegiatan: {
            ...prevState.dtJadwalKegiatan,
            data: prevState.dtJadwalKegiatan.data.filter(
              (item) => item.id !== id
            ),
            total: prevState.dtJadwalKegiatan.total - 1,
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
          url: `/jadwal-kegiatan/${id}`,
          data,
        });

        set((prevState) => ({
          dtJadwalKegiatan: {
            ...prevState.dtJadwalKegiatan,
            data: prevState.dtJadwalKegiatan.data.map((item) =>
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

    getByDateRange: async (start_date, end_date) => {
      try {
        const response = await crud({
          method: "get",
          url: "/jadwal-kegiatan/data/date-range",
          params: {
            start_date,
            end_date,
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

    updatePeserta: async (id, peserta_saat_ini) => {
      try {
        const response = await crud({
          method: "patch",
          url: `/jadwal-kegiatan/${id}/peserta`,
          data: { peserta_saat_ini },
        });

        set((prevState) => ({
          dtJadwalKegiatan: {
            ...prevState.dtJadwalKegiatan,
            data: prevState.dtJadwalKegiatan.data.map((item) =>
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
  }))
);

export default useJadwalKegiatan;
