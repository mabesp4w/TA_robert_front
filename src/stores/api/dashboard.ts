/** @format */

// stores/api/dashboard.ts
import { create } from "zustand";
import { DashboardState } from "@/types/dashboard";
import { api } from "@/services/baseURL";

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });

    try {
      const response = await api.get("/dashboard");

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;

      set({
        data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.message || "Failed to fetch dashboard data",
      });
    }
  },

  refreshData: async () => {
    const { fetchDashboardData } = get();
    await fetchDashboardData();
  },
}));
