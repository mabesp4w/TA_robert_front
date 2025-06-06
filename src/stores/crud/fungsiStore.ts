/** @format */

// app/fuzzy/fungsi-keanggotaan/store/fungsiStore.ts
import { create } from "zustand";
import { toast } from "react-hot-toast";
import {
  FungsiKeanggotaan,
  ParameterFuzzyChoice,
  FuzzyStatistik,
} from "@/types/fuzzy";
import {
  fungsiKeanggotaanCRUD,
  parameterFuzzyCRUD,
} from "@/services/fuzzyService";

interface FungsiState {
  // Data
  fungsiList: FungsiKeanggotaan[];
  fungsi: FungsiKeanggotaan | null;
  parameterChoices: ParameterFuzzyChoice[];
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
    parameter: string;
    tipe_fungsi: string;
    aktif: boolean | null;
    ordering: string;
  };
}

interface FungsiActions {
  // CRUD Actions
  fetchFungsiList: () => Promise<void>;
  fetchFungsiById: (id: string) => Promise<void>;
  createFungsi: (data: FungsiKeanggotaan) => Promise<boolean>;
  updateFungsi: (id: string, data: FungsiKeanggotaan) => Promise<boolean>;
  deleteFungsi: (id: string) => Promise<boolean>;

  // Utility Actions
  fetchParameterChoices: (tipe?: string) => Promise<void>;
  fetchStatistik: () => Promise<void>;

  // UI Actions
  openModal: (editMode?: boolean, fungsi?: FungsiKeanggotaan) => void;
  closeModal: () => void;

  // Filter Actions
  setFilters: (filters: Partial<FungsiState["filters"]>) => void;
  resetFilters: () => void;

  // Reset Actions
  resetState: () => void;
}

const initialFilters = {
  page: 1,
  search: "",
  parameter: "",
  tipe_fungsi: "",
  aktif: null,
  ordering: "parameter__nama_parameter",
};

const initialState: FungsiState = {
  fungsiList: [],
  fungsi: null,
  parameterChoices: [],
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

export const useFungsiStore = create<FungsiState & FungsiActions>(
  (set, get) => ({
    ...initialState,

    fetchFungsiList: async () => {
      set({ loading: true });
      try {
        const { filters } = get();
        const params = {
          page: filters.page,
          search: filters.search || undefined,
          parameter: filters.parameter || undefined,
          tipe_fungsi: filters.tipe_fungsi || undefined,
          aktif: filters.aktif !== null ? filters.aktif : undefined,
          ordering: filters.ordering || undefined,
        };

        const response = await fungsiKeanggotaanCRUD.getAll(params);
        set({
          fungsiList: response.data,
          pagination: response.pagination || null,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching fungsi keanggotaan:", error);
        toast.error("Gagal mengambil data fungsi keanggotaan");
        set({ loading: false });
      }
    },

    fetchFungsiById: async (id: string) => {
      set({ loadingDetail: true });
      try {
        const response = await fungsiKeanggotaanCRUD.getById(id);
        set({
          fungsi: response.data,
          loadingDetail: false,
        });
      } catch (error) {
        console.error("Error fetching fungsi detail:", error);
        toast.error("Gagal mengambil detail fungsi keanggotaan");
        set({ loadingDetail: false });
      }
    },

    createFungsi: async (data: FungsiKeanggotaan) => {
      try {
        await fungsiKeanggotaanCRUD.create(data);
        toast.success("Fungsi keanggotaan berhasil ditambahkan");

        // Refresh data
        await get().fetchFungsiList();

        return true;
      } catch (error: any) {
        console.error("Error creating fungsi:", error);
        const message =
          error.response?.data?.message ||
          "Gagal menambahkan fungsi keanggotaan";
        toast.error(message);
        return false;
      }
    },

    updateFungsi: async (id: string, data: FungsiKeanggotaan) => {
      try {
        await fungsiKeanggotaanCRUD.update(id, data);
        toast.success("Fungsi keanggotaan berhasil diupdate");

        // Refresh data
        await get().fetchFungsiList();

        return true;
      } catch (error: any) {
        console.error("Error updating fungsi:", error);
        const message =
          error.response?.data?.message ||
          "Gagal mengupdate fungsi keanggotaan";
        toast.error(message);
        return false;
      }
    },

    deleteFungsi: async (id: string) => {
      try {
        await fungsiKeanggotaanCRUD.delete(id);
        toast.success("Fungsi keanggotaan berhasil dihapus");

        // Refresh data
        await get().fetchFungsiList();

        return true;
      } catch (error: any) {
        console.error("Error deleting fungsi:", error);
        const message =
          error.response?.data?.message || "Gagal menghapus fungsi keanggotaan";
        toast.error(message);
        return false;
      }
    },

    fetchParameterChoices: async (tipe?: string) => {
      set({ loadingChoices: true });
      try {
        const response = await parameterFuzzyCRUD.getChoices(tipe);
        set({
          parameterChoices: response.data,
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
        const response = await fungsiKeanggotaanCRUD.getStatistik();
        set({
          statistik: response.data,
          loadingStatistik: false,
        });
      } catch (error) {
        console.error("Error fetching fungsi statistik:", error);
        toast.error("Gagal mengambil statistik fungsi keanggotaan");
        set({ loadingStatistik: false });
      }
    },

    openModal: (editMode = false, fungsi = undefined) => {
      set({
        isModalOpen: true,
        isEditMode: editMode,
        fungsi: fungsi,
      });
    },

    closeModal: () => {
      set({
        isModalOpen: false,
        isEditMode: false,
        fungsi: null,
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
