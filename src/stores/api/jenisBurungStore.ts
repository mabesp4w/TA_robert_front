/** @format */
// stores/crud/jenisPenyakit.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { JenisPenyakit, ListResponse } from "@/types";
import axios from "axios";
import { BASE_URL } from "@/services/baseURL";

interface JenisPenyakitState {
  jenisPenyakit: ListResponse<JenisPenyakit>[];
  currentJenisPenyakit: JenisPenyakit | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchJenisPenyakit: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }) => Promise<void>;
  clearCurrentJenisPenyakit: () => void;
  clearError: () => void;
}

export const useJenisPenyakitStore = create<JenisPenyakitState>((set) => ({
  jenisPenyakit: [],
  currentJenisPenyakit: null,
  loading: false,
  error: null,

  fetchJenisPenyakit: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${BASE_URL}/static/jenis_penyakit.json`
      );
      set({
        jenisPenyakit: response.data,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch jenis penyakit";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  clearCurrentJenisPenyakit: () => {
    set({ currentJenisPenyakit: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
