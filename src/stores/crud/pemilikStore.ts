/** @format */
// stores/crud/pemilikStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { Pemilik } from "@/types";
import { pemilikCRUD } from "@/services/crudService";

interface PemilikState {
  pemiliks: Pemilik[];
  currentPemilik: Pemilik | null;
  loading: boolean;
  error: string | null;
  statistikUmum: any;
  pemilikPerluPerhatian: any[];
  daftarSapiPemilik: any[];

  // Actions
  fetchPemiliks: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    jenis_pemilik?: string;
    status_aktif?: boolean;
  }) => Promise<void>;
  fetchPemilikById: (id: string) => Promise<void>;
  createPemilik: (data: Pemilik) => Promise<Pemilik | null>;
  updatePemilik: (id: string, data: Pemilik) => Promise<Pemilik | null>;
  deletePemilik: (id: string) => Promise<boolean>;
  nonaktifkanPemilik: (id: string) => Promise<boolean>;
  aktifkanPemilik: (id: string) => Promise<boolean>;
  fetchDaftarSapiPemilik: (
    id: string,
    params?: {
      status?: string;
      ordering?: string;
    }
  ) => Promise<any>;
  fetchStatistikSapiPemilik: (id: string) => Promise<any>;
  fetchStatistikUmum: () => Promise<void>;
  fetchPemilikPerluPerhatian: () => Promise<void>;
  clearCurrentPemilik: () => void;
  clearError: () => void;
}

export const usePemilikStore = create<PemilikState>((set) => ({
  pemiliks: [],
  currentPemilik: null,
  loading: false,
  error: null,
  statistikUmum: null,
  pemilikPerluPerhatian: [],
  daftarSapiPemilik: [],

  fetchPemiliks: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.getAll(params);
      set({
        pemiliks: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch pemilik";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchPemilikById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.getById(id);
      set({
        currentPemilik: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch pemilik";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createPemilik: async (data: Pemilik) => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.create(data);
      const newPemilik = response.results as Pemilik;

      set((state) => ({
        pemiliks: [newPemilik, ...state.pemiliks],
        loading: false,
      }));

      toast.success("Pemilik berhasil ditambahkan");
      return newPemilik;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create pemilik";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updatePemilik: async (id: string, data: Pemilik) => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.update(id, data);
      const updatedPemilik = response.results as Pemilik;

      set((state) => ({
        pemiliks: state.pemiliks.map((pemilik) =>
          pemilik.id === id ? updatedPemilik : pemilik
        ),
        currentPemilik:
          state.currentPemilik?.id === id
            ? updatedPemilik
            : state.currentPemilik,
        loading: false,
      }));

      toast.success("Pemilik berhasil diperbarui");
      return updatedPemilik;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update pemilik";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deletePemilik: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await pemilikCRUD.delete(id);

      set((state) => ({
        pemiliks: state.pemiliks.filter((pemilik) => pemilik.id !== id),
        currentPemilik:
          state.currentPemilik?.id === id ? null : state.currentPemilik,
        loading: false,
      }));

      toast.success("Pemilik berhasil dihapus");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete pemilik";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  nonaktifkanPemilik: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.nonaktifkan(id);
      const updatedPemilik = response.results as Pemilik;

      set((state) => ({
        pemiliks: state.pemiliks.map((pemilik) =>
          pemilik.id === id ? updatedPemilik : pemilik
        ),
        currentPemilik:
          state.currentPemilik?.id === id
            ? updatedPemilik
            : state.currentPemilik,
        loading: false,
      }));

      toast.success("Pemilik berhasil dinonaktifkan");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to nonaktifkan pemilik";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  aktifkanPemilik: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.aktifkan(id);
      const updatedPemilik = response.results as Pemilik;

      set((state) => ({
        pemiliks: state.pemiliks.map((pemilik) =>
          pemilik.id === id ? updatedPemilik : pemilik
        ),
        currentPemilik:
          state.currentPemilik?.id === id
            ? updatedPemilik
            : state.currentPemilik,
        loading: false,
      }));

      toast.success("Pemilik berhasil diaktifkan");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to aktifkan pemilik";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchDaftarSapiPemilik: async (id: string, params) => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.getDaftarSapi(id, params);
      set({
        daftarSapiPemilik: response.results.daftar_sapi,
        loading: false,
      });
      return response.results;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch daftar sapi";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  fetchStatistikSapiPemilik: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.getStatistikSapi(id);
      set({ loading: false });
      return response.results;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch statistik sapi";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  fetchStatistikUmum: async () => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.getStatistikUmum();
      set({
        statistikUmum: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch statistik umum";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchPemilikPerluPerhatian: async () => {
    set({ loading: true, error: null });
    try {
      const response = await pemilikCRUD.getPerluPerhatian();
      set({
        pemilikPerluPerhatian: response.results.daftar_pemilik,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch pemilik perlu perhatian";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearCurrentPemilik: () => {
    set({ currentPemilik: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
