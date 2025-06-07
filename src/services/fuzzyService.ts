/** @format */

// services/fuzzyService.ts
import { AxiosResponse } from "axios";
import { crud } from "./baseURL";
import {
  ParameterFuzzy,
  FungsiKeanggotaan,
  AturanFuzzy,
  ParameterFuzzyChoice,
  JenisPenyakitChoice,
  FuzzyStatistik,
} from "@/types/fuzzy";
import { DetailResponse, ListResponse } from "@/types";

// Parameter Fuzzy CRUD
export const parameterFuzzyCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    tipe?: string;
    aktif?: boolean;
  }): Promise<ListResponse<ParameterFuzzy>> => {
    const response: AxiosResponse<ListResponse<ParameterFuzzy>> =
      await crud.get("/parameter-fuzzy/", { params });
    return response.data;
  },

  getById: async (id: string): Promise<DetailResponse<ParameterFuzzy>> => {
    const response: AxiosResponse<DetailResponse<ParameterFuzzy>> =
      await crud.get(`/parameter-fuzzy/${id}/`);
    return response.data;
  },

  create: async (
    data: ParameterFuzzy
  ): Promise<DetailResponse<ParameterFuzzy>> => {
    const response: AxiosResponse<DetailResponse<ParameterFuzzy>> =
      await crud.post("/parameter-fuzzy/", data);
    return response.data;
  },

  update: async (
    id: string,
    data: ParameterFuzzy
  ): Promise<DetailResponse<ParameterFuzzy>> => {
    const response: AxiosResponse<DetailResponse<ParameterFuzzy>> =
      await crud.patch(`/parameter-fuzzy/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/parameter-fuzzy/${id}/`);
  },

  getChoices: async (
    tipe?: string
  ): Promise<DetailResponse<ParameterFuzzyChoice[]>> => {
    const params = tipe ? { tipe } : undefined;
    const response: AxiosResponse<DetailResponse<ParameterFuzzyChoice[]>> =
      await crud.get("/parameter-fuzzy/choices/", { params });
    return response.data;
  },

  getFungsiKeanggotaan: async (id: string): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      `/parameter-fuzzy/${id}/fungsi_keanggotaan/`
    );
    return response.data;
  },

  getStatistik: async (): Promise<DetailResponse<FuzzyStatistik>> => {
    const response: AxiosResponse<DetailResponse<FuzzyStatistik>> =
      await crud.get("/parameter-fuzzy/statistik/");
    return response.data;
  },
};

// Fungsi Keanggotaan CRUD
export const fungsiKeanggotaanCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    parameter?: string;
    tipe_fungsi?: string;
    aktif?: boolean;
  }): Promise<ListResponse<FungsiKeanggotaan>> => {
    const response: AxiosResponse<ListResponse<FungsiKeanggotaan>> =
      await crud.get("/fungsi-keanggotaan/", { params });
    return response.data;
  },

  getById: async (id: string): Promise<DetailResponse<FungsiKeanggotaan>> => {
    const response: AxiosResponse<DetailResponse<FungsiKeanggotaan>> =
      await crud.get(`/fungsi-keanggotaan/${id}/`);
    return response.data;
  },

  create: async (
    data: FungsiKeanggotaan
  ): Promise<DetailResponse<FungsiKeanggotaan>> => {
    const response: AxiosResponse<DetailResponse<FungsiKeanggotaan>> =
      await crud.post("/fungsi-keanggotaan/", data);
    return response.data;
  },

  update: async (
    id: string,
    data: FungsiKeanggotaan
  ): Promise<DetailResponse<FungsiKeanggotaan>> => {
    const response: AxiosResponse<DetailResponse<FungsiKeanggotaan>> =
      await crud.patch(`/fungsi-keanggotaan/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/fungsi-keanggotaan/${id}/`);
  },

  getByParameter: async (): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/fungsi-keanggotaan/by_parameter/"
    );
    return response.data;
  },

  getStatistik: async (): Promise<DetailResponse<FuzzyStatistik>> => {
    const response: AxiosResponse<DetailResponse<FuzzyStatistik>> =
      await crud.get("/fungsi-keanggotaan/statistik/");
    return response.data;
  },
};

// Aturan Fuzzy CRUD
export const aturanFuzzyCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    penyakit?: string;
    aktif?: boolean;
  }): Promise<ListResponse<AturanFuzzy>> => {
    const response: AxiosResponse<ListResponse<AturanFuzzy>> = await crud.get(
      "/aturan-fuzzy/",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<DetailResponse<AturanFuzzy>> => {
    const response: AxiosResponse<DetailResponse<AturanFuzzy>> = await crud.get(
      `/aturan-fuzzy/${id}/`
    );
    return response.data;
  },

  create: async (data: AturanFuzzy): Promise<DetailResponse<AturanFuzzy>> => {
    const response: AxiosResponse<DetailResponse<AturanFuzzy>> =
      await crud.post("/aturan-fuzzy/", data);
    return response.data;
  },

  update: async (
    id: string,
    data: AturanFuzzy
  ): Promise<DetailResponse<AturanFuzzy>> => {
    const response: AxiosResponse<DetailResponse<AturanFuzzy>> =
      await crud.patch(`/aturan-fuzzy/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/aturan-fuzzy/${id}/`);
  },

  getByPenyakit: async (): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/aturan-fuzzy/by_penyakit/"
    );
    return response.data;
  },

  getPenyakitChoices: async (): Promise<
    DetailResponse<JenisPenyakitChoice[]>
  > => {
    const response: AxiosResponse<DetailResponse<JenisPenyakitChoice[]>> =
      await crud.get("/aturan-fuzzy/penyakit_choices/");
    return response.data;
  },

  getStatistik: async (): Promise<DetailResponse<FuzzyStatistik>> => {
    const response: AxiosResponse<DetailResponse<FuzzyStatistik>> =
      await crud.get("/aturan-fuzzy/statistik/");
    return response.data;
  },

  testRule: async (
    id: string,
    inputData: Record<string, any>
  ): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.post(
      `/aturan-fuzzy/${id}/test_rule/`,
      { input_data: inputData }
    );
    return response.data;
  },
};
