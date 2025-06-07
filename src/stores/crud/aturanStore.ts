/** @format */

// app/fuzzy/aturan/store/aturanStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
  AturanFuzzy,
  JenisPenyakitChoice,
  FuzzyStatistik,
} from "@/types/fuzzy";
import { aturanFuzzyCRUD } from "@/services/fuzzyService";

interface AturanState {
  // Data
  aturanList: AturanFuzzy[];
  aturan: AturanFuzzy | null;
  penyakitChoices: JenisPenyakitChoice[];
  statistik: FuzzyStatistik | null;

  // UI State
  loading: boolean;
  loadingDetail: boolean;
  loadingChoices: boolean;
  loadingStatistik: boolean;

  // Modal state
  isModalOpen: boolean;
  isEditMode: boolean;

  // Test Rule Modal
  isTestModalOpen: boolean;
  testResult: any;
  loadingTest: boolean;

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
    penyakit: string;
    aktif: boolean | null;
    ordering: string;
  };
}

interface AturanActions {
  // CRUD Actions
  fetchAturanList: () => Promise<void>;
  fetchAturanById: (id: string) => Promise<void>;
  createAturan: (data: AturanFuzzy) => Promise<boolean>;
  updateAturan: (id: string, data: AturanFuzzy) => Promise<boolean>;
  deleteAturan: (id: string) => Promise<boolean>;

  // Utility Actions
  fetchPenyakitChoices: () => Promise<void>;
  fetchStatistik: () => Promise<void>;
  testRule: (id: string, inputData: Record<string, any>) => Promise<void>;

  // UI Actions
  openModal: (editMode?: boolean, aturan?: AturanFuzzy) => void;
  closeModal: () => void;
  openTestModal: (aturan: AturanFuzzy) => void;
  closeTestModal: () => void;

  // Filter Actions
  setFilters: (filters: Partial<AturanState["filters"]>) => void;
  resetFilters: () => void;

  // Reset Actions
  resetState: () => void;
}

const initialFilters = {
  page: 1,
  search: "",
  penyakit: "",
  aktif: null,
  ordering: "penyakit__nm_penyakit",
};

const initialState: AturanState = {
  aturanList: [],
  aturan: null,
  penyakitChoices: [],
  statistik: null,
  loading: false,
  loadingDetail: false,
  loadingChoices: false,
  loadingStatistik: false,
  isModalOpen: false,
  isEditMode: false,
  isTestModalOpen: false,
  testResult: null,
  loadingTest: false,
  pagination: null,
  filters: initialFilters,
};

export const useAturanStore = create<AturanState & AturanActions>(
  (set, get) => ({
    ...initialState,

    fetchAturanList: async () => {
      set({ loading: true });
      try {
        const { filters } = get();
        const params = {
          page: filters.page,
          search: filters.search || undefined,
          penyakit: filters.penyakit || undefined,
          aktif: filters.aktif !== null ? filters.aktif : undefined,
          ordering: filters.ordering || undefined,
        };

        const response = await aturanFuzzyCRUD.getAll(params);
        set({
          aturanList: response.results,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching aturan fuzzy:", error);
        toast.error("Gagal mengambil data aturan fuzzy");
        set({ loading: false });
      }
    },

    fetchAturanById: async (id: string) => {
      set({ loadingDetail: true });
      try {
        const response = await aturanFuzzyCRUD.getById(id);
        set({
          aturan: response.results,
          loadingDetail: false,
        });
      } catch (error) {
        console.error("Error fetching aturan detail:", error);
        toast.error("Gagal mengambil detail aturan fuzzy");
        set({ loadingDetail: false });
      }
    },

    createAturan: async (data: AturanFuzzy) => {
      try {
        await aturanFuzzyCRUD.create(data);
        toast.success("Aturan fuzzy berhasil ditambahkan");

        // Refresh data
        await get().fetchAturanList();

        return true;
      } catch (error: any) {
        console.error("Error creating aturan:", error);
        const message =
          error.response?.data?.message || "Gagal menambahkan aturan fuzzy";
        toast.error(message);
        return false;
      }
    },

    updateAturan: async (id: string, data: AturanFuzzy) => {
      try {
        await aturanFuzzyCRUD.update(id, data);
        toast.success("Aturan fuzzy berhasil diupdate");

        // Refresh data
        await get().fetchAturanList();

        return true;
      } catch (error: any) {
        console.error("Error updating aturan:", error);
        const message =
          error.response?.data?.message || "Gagal mengupdate aturan fuzzy";
        toast.error(message);
        return false;
      }
    },

    deleteAturan: async (id: string) => {
      try {
        await aturanFuzzyCRUD.delete(id);
        toast.success("Aturan fuzzy berhasil dihapus");

        // Refresh data
        await get().fetchAturanList();

        return true;
      } catch (error: any) {
        console.error("Error deleting aturan:", error);
        const message =
          error.response?.data?.message || "Gagal menghapus aturan fuzzy";
        toast.error(message);
        return false;
      }
    },

    fetchPenyakitChoices: async () => {
      set({ loadingChoices: true });
      try {
        const response = await aturanFuzzyCRUD.getPenyakitChoices();
        set({
          penyakitChoices: response.results,
          loadingChoices: false,
        });
      } catch (error) {
        console.error("Error fetching penyakit choices:", error);
        toast.error("Gagal mengambil pilihan penyakit");
        set({ loadingChoices: false });
      }
    },

    fetchStatistik: async () => {
      set({ loadingStatistik: true });
      try {
        const response = await aturanFuzzyCRUD.getStatistik();
        set({
          statistik: response.results,
          loadingStatistik: false,
        });
      } catch (error) {
        console.error("Error fetching aturan statistik:", error);
        toast.error("Gagal mengambil statistik aturan fuzzy");
        set({ loadingStatistik: false });
      }
    },

    testRule: async (id: string, inputData: Record<string, any>) => {
      set({ loadingTest: true });
      try {
        const response = await aturanFuzzyCRUD.testRule(id, inputData);
        set({
          testResult: response.results,
          loadingTest: false,
        });
        toast.success("Test aturan berhasil dilakukan");
      } catch (error: any) {
        console.error("Error testing rule:", error);
        const message =
          error.response?.data?.message || "Gagal melakukan test aturan";
        toast.error(message);
        set({ loadingTest: false });
      }
    },

    openModal: (editMode = false, aturan = undefined) => {
      set({
        isModalOpen: true,
        isEditMode: editMode,
        aturan: aturan,
      });
    },

    closeModal: () => {
      set({
        isModalOpen: false,
        isEditMode: false,
        aturan: null,
      });
    },

    openTestModal: (aturan: AturanFuzzy) => {
      set({
        isTestModalOpen: true,
        aturan: aturan,
        testResult: null,
      });
    },

    closeTestModal: () => {
      set({
        isTestModalOpen: false,
        aturan: null,
        testResult: null,
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
