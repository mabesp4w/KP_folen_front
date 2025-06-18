/** @format */

// src/stores/useKaryaMusik.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { crud } from "@/services/baseURL";
import { KaryaMusik, PaginatedData, StoreParams } from "@/types";

type Store = {
  dtKaryaMusik: PaginatedData<KaryaMusik>;
  loading: boolean;

  setKaryaMusik: (params: StoreParams) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  setShowKaryaMusik: (id: number | string) => Promise<{
    status: string;
    data?: KaryaMusik;
    error?: any;
  }>;

  addData: (data: Partial<KaryaMusik>) => Promise<{
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
    data: Partial<KaryaMusik>
  ) => Promise<{
    status: string;
    data?: any;
    error?: any;
  }>;

  getGenres: () => Promise<{
    status: string;
    data?: string[];
    error?: any;
  }>;
};

const useKaryaMusik = create<Store>()(
  devtools((set) => ({
    dtKaryaMusik: {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
    loading: false,

    setKaryaMusik: async ({
      page = 1,
      limit = 10,
      search,
      sortby,
      order,
      genre,
    }: StoreParams & { genre?: string }) => {
      try {
        set({ loading: true });
        const response = await crud({
          method: "get",
          url: "/karya-musik",
          params: {
            page,
            limit,
            search,
            sortby,
            order,
            genre,
          },
        });

        set({
          dtKaryaMusik: response.data.data,
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

    setShowKaryaMusik: async (id) => {
      try {
        const response = await crud({
          method: "get",
          url: `/karya-musik/${id}`,
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
          url: "/karya-musik",
          data,
        });

        set((prevState) => ({
          dtKaryaMusik: {
            ...prevState.dtKaryaMusik,
            data: [response.data.data, ...prevState.dtKaryaMusik.data],
            total: prevState.dtKaryaMusik.total + 1,
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
          url: `/karya-musik/${id}`,
        });

        set((prevState) => ({
          dtKaryaMusik: {
            ...prevState.dtKaryaMusik,
            data: prevState.dtKaryaMusik.data.filter((item) => item.id !== id),
            total: prevState.dtKaryaMusik.total - 1,
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
          url: `/karya-musik/${id}`,
          data,
        });

        set((prevState) => ({
          dtKaryaMusik: {
            ...prevState.dtKaryaMusik,
            data: prevState.dtKaryaMusik.data.map((item) =>
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

    getGenres: async () => {
      try {
        const response = await crud({
          method: "get",
          url: "/karya-musik/data/genres",
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

export default useKaryaMusik;
