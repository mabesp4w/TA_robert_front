/** @format */
// stores/crud/dataSapiStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { DataSapi } from "@/types";
import { dataSapiCRUD } from "@/services/crudService";

interface DataSapiState {
  dataSapi: DataSapi[];
  currentDataSapi: DataSapi | null;
  loading: boolean;
  error: string | null;
  fetchStatistikPopulasi: () => Promise<void>;
  statistik: any;

  // Actions
  fetchDataSapis: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    family?: string;
  }) => Promise<void>;
  fetchDataSapiById: (id: string) => Promise<void>;
  createDataSapi: (data: DataSapi) => Promise<DataSapi | null>;
  updateDataSapi: (id: string, data: DataSapi) => Promise<DataSapi | null>;
  deleteDataSapi: (id: string) => Promise<boolean>;
  clearCurrentDataSapi: () => void;
  clearError: () => void;
}

export const useDataSapiStore = create<DataSapiState>((set) => ({
  dataSapi: [],
  currentDataSapi: null,
  loading: false,
  error: null,
  statistik: null,

  fetchDataSapis: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await dataSapiCRUD.getAll(params);
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
      const response = await dataSapiCRUD.getById(id);
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

  createDataSapi: async (data: DataSapi) => {
    set({ loading: true, error: null });
    try {
      const response = await dataSapiCRUD.create(data);
      const newDataSapi = response.results as DataSapi;

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

  updateDataSapi: async (id: string, data: DataSapi) => {
    set({ loading: true, error: null });
    try {
      const response = await dataSapiCRUD.update(id, data);
      const updatedDataSapi = response.results as DataSapi;

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
      await dataSapiCRUD.delete(id);

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

  fetchStatistikPopulasi: async () => {
    set({ loading: true, error: null });
    try {
      const response = await dataSapiCRUD.getStatistikPopulasi();
      set({
        statistik: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch statistik populasi";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearCurrentDataSapi: () => {
    set({ currentDataSapi: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
