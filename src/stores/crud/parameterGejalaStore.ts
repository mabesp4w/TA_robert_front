/** @format */
// stores/crud/parameterGejalaStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { ParameterGejala } from "@/types";
import { parameterGejalaCRUD } from "@/services/crudService";

interface ParameterGejalaState {
  parameterGejalas: ParameterGejala[];
  currentParameterGejala: ParameterGejala | null;
  loading: boolean;
  error: string | null;
  parameterFuzzy: any;
  validasiResult: any;

  // Actions
  fetchParameterGejalas: (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    satuan?: string;
  }) => Promise<void>;
  fetchParameterGejalaById: (id: string) => Promise<void>;
  createParameterGejala: (
    data: ParameterGejala
  ) => Promise<ParameterGejala | null>;
  updateParameterGejala: (
    id: string,
    data: ParameterGejala
  ) => Promise<ParameterGejala | null>;
  deleteParameterGejala: (id: string) => Promise<boolean>;
  fetchParameterFuzzy: () => Promise<void>;
  validasiNilai: (id: string, nilai: number) => Promise<any>;
  clearCurrentParameterGejala: () => void;
  clearError: () => void;
  clearValidasiResult: () => void;
}

export const useParameterGejalaStore = create<ParameterGejalaState>((set) => ({
  parameterGejalas: [],
  currentParameterGejala: null,
  loading: false,
  error: null,
  parameterFuzzy: null,
  validasiResult: null,

  fetchParameterGejalas: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await parameterGejalaCRUD.getAll(params);
      set({
        parameterGejalas: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch parameter gejala";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  fetchParameterGejalaById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await parameterGejalaCRUD.getById(id);
      set({
        currentParameterGejala: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch parameter gejala";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  createParameterGejala: async (data: ParameterGejala) => {
    set({ loading: true, error: null });
    try {
      const response = await parameterGejalaCRUD.create(data);
      const newParameterGejala = response.results as ParameterGejala;

      set((state) => ({
        parameterGejalas: [newParameterGejala, ...state.parameterGejalas],
        loading: false,
      }));

      toast.success("Parameter gejala berhasil ditambahkan");
      return newParameterGejala;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create parameter gejala";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  updateParameterGejala: async (id: string, data: ParameterGejala) => {
    set({ loading: true, error: null });
    try {
      const response = await parameterGejalaCRUD.update(id, data);
      const updatedParameterGejala = response.results as ParameterGejala;

      set((state) => ({
        parameterGejalas: state.parameterGejalas.map((param) =>
          param.id === id ? updatedParameterGejala : param
        ),
        currentParameterGejala:
          state.currentParameterGejala?.id === id
            ? updatedParameterGejala
            : state.currentParameterGejala,
        loading: false,
      }));

      toast.success("Parameter gejala berhasil diperbarui");
      return updatedParameterGejala;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update parameter gejala";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  deleteParameterGejala: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await parameterGejalaCRUD.delete(id);

      set((state) => ({
        parameterGejalas: state.parameterGejalas.filter(
          (param) => param.id !== id
        ),
        currentParameterGejala:
          state.currentParameterGejala?.id === id
            ? null
            : state.currentParameterGejala,
        loading: false,
      }));

      toast.success("Parameter gejala berhasil dihapus");
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete parameter gejala";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return false;
    }
  },

  fetchParameterFuzzy: async () => {
    set({ loading: true, error: null });
    try {
      const response = await parameterGejalaCRUD.getParameterFuzzy();
      set({
        parameterFuzzy: response.results,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch parameter fuzzy";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  validasiNilai: async (id: string, nilai: number) => {
    set({ loading: true, error: null });
    try {
      const response = await parameterGejalaCRUD.validasiNilai(id, nilai);
      set({
        validasiResult: response.results,
        loading: false,
      });

      const message = response.results.valid
        ? `Nilai ${nilai} valid untuk parameter ${response.results.parameter.nm_parameter}`
        : `Nilai ${nilai} tidak valid untuk parameter ${response.results.parameter.nm_parameter}`;

      if (response.results.valid) {
        toast.success(message);
      } else {
        toast.error(message);
      }

      return response.results;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to validate nilai";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return null;
    }
  },

  clearCurrentParameterGejala: () => {
    set({ currentParameterGejala: null });
  },

  clearError: () => {
    set({ error: null });
  },

  clearValidasiResult: () => {
    set({ validasiResult: null });
  },
}));
