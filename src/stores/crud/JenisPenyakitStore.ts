/** @format */
// stores/crud/jenisPenyakitStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { JenisPenyakit } from "@/types";
import { jenisPenyakitCRUD } from "@/services/crudService";

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
      const errorMessage =
        error.response?.data?.message || "Failed to fetch jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchJenisPenyakitById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await jenisPenyakitCRUD.getById(id);
      set({
        currentJenisPenyakit: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch jenis jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
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

      toast.success("Bird created successfully");
      return newBird;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
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

      toast.success("Bird updated successfully");
      return updatedBird;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
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

  clearCurrentJenisPenyakit: () => {
    set({ currentJenisPenyakit: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
