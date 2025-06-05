/** @format */
// stores/crud/dataSapiStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { JenisPenyakit } from "@/types";
import { jenisPenyakitCRUD } from "@/services/crudService";

interface DataSapiState {
  dataSapi: JenisPenyakit[];
  currentDataSapi: JenisPenyakit | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchDataSapis: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    family?: string;
  }) => Promise<void>;
  fetchDataSapiById: (id: string) => Promise<void>;
  createDataSapi: (data: JenisPenyakit) => Promise<JenisPenyakit | null>;
  updateDataSapi: (
    id: string,
    data: JenisPenyakit
  ) => Promise<JenisPenyakit | null>;
  deleteDataSapi: (id: string) => Promise<boolean>;
  clearCurrentDataSapi: () => void;
  clearError: () => void;
}

export const useDataSapiStore = create<DataSapiState>((set) => ({
  dataSapi: [],
  currentDataSapi: null,
  loading: false,
  error: null,

  fetchDataSapis: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await jenisPenyakitCRUD.getAll(params);
      set({
        dataSapi: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchDataSapiById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await jenisPenyakitCRUD.getById(id);
      set({
        currentDataSapi: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch jenis jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createDataSapi: async (data: JenisPenyakit) => {
    set({ loading: true, error: null });
    try {
      const response = await jenisPenyakitCRUD.create(data);
      const newDataSapi = response.results as JenisPenyakit;

      set((state) => ({
        dataSapi: [newDataSapi, ...state.dataSapi],
        loading: false,
      }));

      toast.success("Bird created successfully");
      return newDataSapi;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateDataSapi: async (id: string, data: JenisPenyakit) => {
    set({ loading: true, error: null });
    try {
      const response = await jenisPenyakitCRUD.update(id, data);
      const updatedDataSapi = response.results as JenisPenyakit;

      set((state) => ({
        dataSapi: state.dataSapi.map((dataSapi) =>
          dataSapi.id === id ? updatedDataSapi : dataSapi
        ),
        currentDataSapi:
          state.currentDataSapi?.id === id
            ? updatedDataSapi
            : state.currentDataSapi,
        loading: false,
      }));

      toast.success("Bird updated successfully");
      return updatedDataSapi;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteDataSapi: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await jenisPenyakitCRUD.delete(id);

      set((state) => ({
        dataSapi: state.dataSapi.filter((dataSapi) => dataSapi.id !== id),
        currentDataSapi:
          state.currentDataSapi?.id === id ? null : state.currentDataSapi,
        loading: false,
      }));

      toast.success("Bird deleted successfully");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  clearCurrentDataSapi: () => {
    set({ currentDataSapi: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
