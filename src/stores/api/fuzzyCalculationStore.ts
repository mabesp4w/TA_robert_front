/** @format */

// stores/fuzzyCalculationStore.ts
import { create } from "zustand";
import { fuzzy } from "@/services/baseURL";
import { FuzzyCalculationState } from "@/types/fuzzy";

export const useFuzzyCalculationStore = create<FuzzyCalculationState>(
  (set, get) => ({
    // Initial states
    completeFlowData: null,
    inputData: {},
    pemeriksaanId: null,
    loading: false,
    error: null,
    currentStep: 1,

    // Actions
    setInputData: (data) => set({ inputData: data }),

    setPemeriksaanId: (id) => set({ pemeriksaanId: id }),

    setCurrentStep: (step) => set({ currentStep: step }),

    calculateCompleteFlow: async () => {
      const { inputData, pemeriksaanId } = get();

      set({ loading: true, error: null });

      try {
        const payload: any = {};

        if (pemeriksaanId) {
          payload.pemeriksaan_id = pemeriksaanId;
        } else if (Object.keys(inputData).length > 0) {
          payload.manual_inputs = inputData;
        } else {
          throw new Error("Either pemeriksaan_id or manual_inputs is required");
        }

        const response = await fuzzy.post(
          "/calculation/complete-flow/",
          payload
        );

        console.log(response.data);

        console.log(response.data.results);
        set({
          completeFlowData: response.data.results,
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
        });
      }
    },

    resetCalculation: () =>
      set({
        completeFlowData: null,
        inputData: {},
        pemeriksaanId: null,
        loading: false,
        error: null,
        currentStep: 1,
      }),
  })
);
