/** @format */

// app/fuzzy/parameter/store/parameterStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
  ParameterFuzzy,
  ParameterFuzzyChoice,
  FuzzyStatistik,
} from "@/types/fuzzy";
import { parameterFuzzyCRUD } from "@/services/fuzzyService";

interface ParameterState {
  // Data
  parameters: ParameterFuzzy[];
  parameter: ParameterFuzzy | null;
  choices: ParameterFuzzyChoice[];
  statistik: FuzzyStatistik | null;

  // UI State
  loading: boolean;
  loadingDetail: boolean;
  loadingChoices: boolean;
  loadingStatistik: boolean;

  // Modal state
  isModalOpen: boolean;
  isEditMode: boolean;

  // Pagination
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  } | null;

  // Filter & Search
  filters: {
    page: number;
    search: string;
    tipe: string;
    aktif: boolean | null;
    ordering: string;
  };
}

interface ParameterActions {
  // CRUD Actions
  fetchParameters: () => Promise<void>;
  fetchParameterById: (id: string) => Promise<void>;
  createParameter: (data: ParameterFuzzy) => Promise<boolean>;
  updateParameter: (id: string, data: ParameterFuzzy) => Promise<boolean>;
  deleteParameter: (id: string) => Promise<boolean>;

  // Utility Actions
  fetchChoices: (tipe?: string) => Promise<void>;
  fetchStatistik: () => Promise<void>;

  // UI Actions
  openModal: (editMode?: boolean, parameter?: ParameterFuzzy) => void;
  closeModal: () => void;

  // Filter Actions
  setFilters: (filters: Partial<ParameterState["filters"]>) => void;
  resetFilters: () => void;

  // Reset Actions
  resetState: () => void;
}

const initialFilters = {
  page: 1,
  search: "",
  tipe: "",
  aktif: null,
  ordering: "nama_parameter",
};

const initialState: ParameterState = {
  parameters: [],
  parameter: null,
  choices: [],
  statistik: null,
  loading: false,
  loadingDetail: false,
  loadingChoices: false,
  loadingStatistik: false,
  isModalOpen: false,
  isEditMode: false,
  pagination: null,
  filters: initialFilters,
};

export const useParameterStore = create<ParameterState & ParameterActions>(
  (set, get) => ({
    ...initialState,

    fetchParameters: async () => {
      set({ loading: true });
      try {
        const { filters } = get();
        const params = {
          page: filters.page,
          search: filters.search || undefined,
          tipe: filters.tipe || undefined,
          aktif: filters.aktif !== null ? filters.aktif : undefined,
          ordering: filters.ordering || undefined,
        };

        const response = await parameterFuzzyCRUD.getAll(params);
        set({
          parameters: response.data,
          pagination: response.pagination || null,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching parameters:", error);
        toast.error("Gagal mengambil data parameter");
        set({ loading: false });
      }
    },

    fetchParameterById: async (id: string) => {
      set({ loadingDetail: true });
      try {
        const response = await parameterFuzzyCRUD.getById(id);
        set({
          parameter: response.data,
          loadingDetail: false,
        });
      } catch (error) {
        console.error("Error fetching parameter detail:", error);
        toast.error("Gagal mengambil detail parameter");
        set({ loadingDetail: false });
      }
    },

    createParameter: async (data: ParameterFuzzy) => {
      try {
        await parameterFuzzyCRUD.create(data);
        toast.success("Parameter berhasil ditambahkan");

        // Refresh data
        await get().fetchParameters();

        return true;
      } catch (error: any) {
        console.error("Error creating parameter:", error);
        const message =
          error.response?.data?.message || "Gagal menambahkan parameter";
        toast.error(message);
        return false;
      }
    },

    updateParameter: async (id: string, data: ParameterFuzzy) => {
      try {
        await parameterFuzzyCRUD.update(id, data);
        toast.success("Parameter berhasil diupdate");

        // Refresh data
        await get().fetchParameters();

        return true;
      } catch (error: any) {
        console.error("Error updating parameter:", error);
        const message =
          error.response?.data?.message || "Gagal mengupdate parameter";
        toast.error(message);
        return false;
      }
    },

    deleteParameter: async (id: string) => {
      try {
        await parameterFuzzyCRUD.delete(id);
        toast.success("Parameter berhasil dihapus");

        // Refresh data
        await get().fetchParameters();

        return true;
      } catch (error: any) {
        console.error("Error deleting parameter:", error);
        const message =
          error.response?.data?.message || "Gagal menghapus parameter";
        toast.error(message);
        return false;
      }
    },

    fetchChoices: async (tipe?: string) => {
      set({ loadingChoices: true });
      try {
        const response = await parameterFuzzyCRUD.getChoices(tipe);
        set({
          choices: response.data,
          loadingChoices: false,
        });
      } catch (error) {
        console.error("Error fetching parameter choices:", error);
        toast.error("Gagal mengambil pilihan parameter");
        set({ loadingChoices: false });
      }
    },

    fetchStatistik: async () => {
      set({ loadingStatistik: true });
      try {
        const response = await parameterFuzzyCRUD.getStatistik();
        set({
          statistik: response.data,
          loadingStatistik: false,
        });
      } catch (error) {
        console.error("Error fetching parameter statistik:", error);
        toast.error("Gagal mengambil statistik parameter");
        set({ loadingStatistik: false });
      }
    },

    openModal: (editMode = false, parameter = undefined) => {
      set({
        isModalOpen: true,
        isEditMode: editMode,
        parameter: parameter,
      });
    },

    closeModal: () => {
      set({
        isModalOpen: false,
        isEditMode: false,
        parameter: null,
      });
    },

    setFilters: (newFilters) => {
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      }));
    },

    resetFilters: () => {
      set({ filters: initialFilters });
    },

    resetState: () => {
      set(initialState);
    },
  })
);
