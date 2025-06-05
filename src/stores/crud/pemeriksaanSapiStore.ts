/** @format */
// stores/crud/pemeriksaanSapiStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { PemeriksaanSapi } from "@/types";
import { pemeriksaanSapiCRUD } from "@/services/crudService";

interface PemeriksaanSapiState {
  pemeriksaanSapis: PemeriksaanSapi[];
  currentPemeriksaanSapi: PemeriksaanSapi | null;
  loading: boolean;
  error: string | null;
  analisisParameter: any;
  laporanHarian: any;
  trendMingguan: any;

  // Actions
  fetchPemeriksaanSapis: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    sapi?: string;
    tanggal?: string;
  }) => Promise<void>;
  fetchPemeriksaanSapiById: (id: string) => Promise<void>;
  createPemeriksaanSapi: (
    data: PemeriksaanSapi
  ) => Promise<PemeriksaanSapi | null>;
  updatePemeriksaanSapi: (
    id: string,
    data: PemeriksaanSapi
  ) => Promise<PemeriksaanSapi | null>;
  deletePemeriksaanSapi: (id: string) => Promise<boolean>;
  fetchAnalisisParameter: (id: string) => Promise<any>;
  fetchLaporanHarian: (tanggal?: string) => Promise<void>;
  fetchTrendMingguan: () => Promise<void>;
  clearCurrentPemeriksaanSapi: () => void;
  clearError: () => void;
  clearAnalisis: () => void;
}

export const usePemeriksaanSapiStore = create<PemeriksaanSapiState>((set) => ({
  pemeriksaanSapis: [],
  currentPemeriksaanSapi: null,
  loading: false,
  error: null,
  analisisParameter: null,
  laporanHarian: null,
  trendMingguan: null,

  fetchPemeriksaanSapis: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await pemeriksaanSapiCRUD.getAll(params);
      set({
        pemeriksaanSapis: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch pemeriksaan sapi";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchPemeriksaanSapiById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await pemeriksaanSapiCRUD.getById(id);
      set({
        currentPemeriksaanSapi: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch pemeriksaan sapi";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createPemeriksaanSapi: async (data: PemeriksaanSapi) => {
    set({ loading: true, error: null });
    try {
      const response = await pemeriksaanSapiCRUD.create(data);
      const newPemeriksaanSapi = response.results as PemeriksaanSapi;

      set((state) => ({
        pemeriksaanSapis: [newPemeriksaanSapi, ...state.pemeriksaanSapis],
        loading: false,
      }));

      toast.success("Data pemeriksaan berhasil ditambahkan");
      return newPemeriksaanSapi;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create pemeriksaan sapi";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updatePemeriksaanSapi: async (id: string, data: PemeriksaanSapi) => {
    set({ loading: true, error: null });
    try {
      const response = await pemeriksaanSapiCRUD.update(id, data);
      const updatedPemeriksaanSapi = response.results as PemeriksaanSapi;

      set((state) => ({
        pemeriksaanSapis: state.pemeriksaanSapis.map((pemeriksaan) =>
          pemeriksaan.id === id ? updatedPemeriksaanSapi : pemeriksaan
        ),
        currentPemeriksaanSapi:
          state.currentPemeriksaanSapi?.id === id
            ? updatedPemeriksaanSapi
            : state.currentPemeriksaanSapi,
        loading: false,
      }));

      toast.success("Data pemeriksaan berhasil diperbarui");
      return updatedPemeriksaanSapi;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update pemeriksaan sapi";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deletePemeriksaanSapi: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await pemeriksaanSapiCRUD.delete(id);

      set((state) => ({
        pemeriksaanSapis: state.pemeriksaanSapis.filter(
          (pemeriksaan) => pemeriksaan.id !== id
        ),
        currentPemeriksaanSapi:
          state.currentPemeriksaanSapi?.id === id
            ? null
            : state.currentPemeriksaanSapi,
        loading: false,
      }));

      toast.success("Data pemeriksaan berhasil dihapus");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete pemeriksaan sapi";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchAnalisisParameter: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await pemeriksaanSapiCRUD.getAnalisisParameter(id);
      set({
        analisisParameter: response.results,
        loading: false,
      });
      return response.results;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch analisis parameter";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  fetchLaporanHarian: async (tanggal) => {
    set({ loading: true, error: null });
    try {
      const response = await pemeriksaanSapiCRUD.getLaporanHarian(tanggal);
      set({
        laporanHarian: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch laporan harian";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchTrendMingguan: async () => {
    set({ loading: true, error: null });
    try {
      const response = await pemeriksaanSapiCRUD.getTrendMingguan();
      set({
        trendMingguan: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch trend mingguan";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearCurrentPemeriksaanSapi: () => {
    set({ currentPemeriksaanSapi: null });
  },

  clearError: () => {
    set({ error: null });
  },

  clearAnalisis: () => {
    set({ analisisParameter: null });
  },
}));
