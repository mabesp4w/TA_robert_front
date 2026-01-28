/** @format */
// stores/crud/jenisPenyakitStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { JenisPenyakit } from "@/types";
import { jenisPenyakitCRUD } from "@/services/crudService";
import { extractErrorMessage, showErrorToast } from "@/utils/errorHandler";

interface JenisPenyakitState {
  jenisPenyakit: JenisPenyakit[];
  currentJenisPenyakit: JenisPenyakit | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchJenisPenyakits: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    family?: string;
  }) => Promise<void>;
  fetchJenisPenyakitById: (id: string) => Promise<void>;
  createJenisPenyakit: (data: JenisPenyakit) => Promise<JenisPenyakit | null>;
  updateJenisPenyakit: (
    id: string,
    data: JenisPenyakit
  ) => Promise<JenisPenyakit | null>;
  deleteJenisPenyakit: (id: string) => Promise<boolean>;
  clearCurrentJenisPenyakit: () => void;
  clearError: () => void;
}

export const useJenisPenyakitStore = create<JenisPenyakitState>((set) => ({
  jenisPenyakit: [],
  currentJenisPenyakit: null,
  loading: false,
  error: null,

  fetchJenisPenyakits: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await jenisPenyakitCRUD.getAll(params);
      set({
        jenisPenyakit: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Gagal mengambil data jenis penyakit");
      set({ error: errorMessage, loading: false });
      showErrorToast(error, "Gagal mengambil data jenis penyakit");
    }
  },

  fetchJenisPenyakitById: async (id: string) => {
    set({ loading: true, error: null, currentJenisPenyakit: null });
    try {
      const response = await jenisPenyakitCRUD.getById(id);
      console.log("Response from API:", response);
      
      // Handle different response structures
      let data = null;
      if (response.results) {
        data = response.results;
      } else if (response && typeof response === 'object' && 'id' in response) {
        // Fallback: if response itself is the data object
        data = response as any;
      }
      
      if (data && data.id) {
        console.log("Setting currentJenisPenyakit:", data);
        set({
          currentJenisPenyakit: data,
          loading: false,
        });
      } else {
        console.error("Invalid data structure:", response);
      set({
          error: "Data tidak ditemukan atau format tidak valid",
        loading: false,
      });
        toast.error("Data jenis penyakit tidak ditemukan");
      }
    } catch (error: any) {
      console.error("Error fetching jenis penyakit:", error);
      const errorMessage = extractErrorMessage(error, "Gagal mengambil data jenis penyakit");
      set({ 
        error: errorMessage, 
        loading: false,
        currentJenisPenyakit: null 
      });
      showErrorToast(error, "Gagal mengambil data jenis penyakit");
    }
  },

  createJenisPenyakit: async (data: JenisPenyakit) => {
    set({ loading: true, error: null });
    try {
      const response = await jenisPenyakitCRUD.create(data);
      const newBird = response.results as JenisPenyakit;

      set((state) => ({
        jenisPenyakit: [newBird, ...state.jenisPenyakit],
        loading: false,
      }));

      toast.success("Data berhasil ditambahkan");
      return newBird;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Gagal membuat jenis penyakit");
      set({ error: errorMessage, loading: false });
      showErrorToast(error, "Gagal membuat jenis penyakit");
      return null;
    }
  },

  updateJenisPenyakit: async (id: string, data: JenisPenyakit) => {
    set({ loading: true, error: null });
    try {
      const response = await jenisPenyakitCRUD.update(id, data);
      const updatedBird = response.results as JenisPenyakit;

      set((state) => ({
        jenisPenyakit: state.jenisPenyakit.map((jenisPenyakit) =>
          jenisPenyakit.id === id ? updatedBird : jenisPenyakit
        ),
        currentJenisPenyakit:
          state.currentJenisPenyakit?.id === id
            ? updatedBird
            : state.currentJenisPenyakit,
        loading: false,
      }));

      toast.success("Data berhasil diperbarui");
      return updatedBird;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Gagal memperbarui jenis penyakit");
      set({ error: errorMessage, loading: false });
      showErrorToast(error, "Gagal memperbarui jenis penyakit");
      return null;
    }
  },

  deleteJenisPenyakit: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await jenisPenyakitCRUD.delete(id);

      set((state) => ({
        jenisPenyakit: state.jenisPenyakit.filter(
          (jenisPenyakit) => jenisPenyakit.id !== id
        ),
        currentJenisPenyakit:
          state.currentJenisPenyakit?.id === id
            ? null
            : state.currentJenisPenyakit,
        loading: false,
      }));

      toast.success("Data berhasil dihapus");
      return true;
    } catch (error: any) {
      const errorMessage = extractErrorMessage(error, "Gagal menghapus jenis penyakit");
      set({ error: errorMessage, loading: false });
      showErrorToast(error, "Gagal menghapus jenis penyakit");
      return false;
    }
  },

  clearCurrentJenisPenyakit: () => {
    set({ currentJenisPenyakit: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
