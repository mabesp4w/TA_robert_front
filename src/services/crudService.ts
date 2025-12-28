/** @format */
// service/crudService
import { AxiosResponse } from "axios";

import { crud } from "./baseURL";
import {
  JenisPenyakit,
  ListResponse,
  DetailResponse,
  DataSapi,
  Pemilik,
  ParameterGejala,
  PemeriksaanSapi,
} from "@/types";

// Jenis Penyakit CRUD
export const jenisPenyakitCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<ListResponse<JenisPenyakit>> => {
    const response: AxiosResponse<ListResponse<JenisPenyakit>> = await crud.get(
      "/jenis-penyakit/",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<DetailResponse<JenisPenyakit>> => {
    const response: AxiosResponse<DetailResponse<JenisPenyakit>> =
      await crud.get(`/jenis-penyakit/${id}/`);
    return response.data;
  },

  create: async (
    data: JenisPenyakit | FormData
  ): Promise<DetailResponse<JenisPenyakit>> => {
    const isFormData = data instanceof FormData;
    const config = isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {};
    const response: AxiosResponse<DetailResponse<JenisPenyakit>> =
      await crud.post("/jenis-penyakit/", data, config);
    return response.data;
  },

  update: async (
    id: string,
    data: JenisPenyakit | FormData
  ): Promise<DetailResponse<JenisPenyakit>> => {
    const isFormData = data instanceof FormData;
    const config = isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {};
    const response: AxiosResponse<DetailResponse<JenisPenyakit>> =
      await crud.patch(`/jenis-penyakit/${id}/`, data, config);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/jenis-penyakit/${id}/`);
  },
};

// Data Sapi CRUD
export const dataSapiCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    jenkel?: string;
    status_kesehatan?: string;
  }): Promise<ListResponse<DataSapi>> => {
    const response: AxiosResponse<ListResponse<DataSapi>> = await crud.get(
      "/data-sapi/",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<DetailResponse<DataSapi>> => {
    const response: AxiosResponse<DetailResponse<DataSapi>> = await crud.get(
      `/data-sapi/${id}/`
    );
    return response.data;
  },

  create: async (data: DataSapi): Promise<DetailResponse<DataSapi>> => {
    const response: AxiosResponse<DetailResponse<DataSapi>> = await crud.post(
      "/data-sapi/",
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: DataSapi
  ): Promise<DetailResponse<DataSapi>> => {
    const response: AxiosResponse<DetailResponse<DataSapi>> = await crud.patch(
      `/data-sapi/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/data-sapi/${id}/`);
  },

  // Custom actions
  getRiwayatPemeriksaan: async (
    id: string,
    limit?: number
  ): Promise<DetailResponse<any>> => {
    const params = limit ? { limit } : undefined;
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      `/data-sapi/${id}/riwayat_pemeriksaan/`,
      { params }
    );
    return response.data;
  },

  getStatusKesehatanTerkini: async (
    id: string
  ): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      `/data-sapi/${id}/status_kesehatan_terkini/`
    );
    return response.data;
  },

  getStatistikPopulasi: async (): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/data-sapi/statistik_populasi/"
    );
    return response.data;
  },

  getSapiPerluPemeriksaan: async (): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/data-sapi/perlu_pemeriksaan/"
    );
    return response.data;
  },
};

// Pemilik CRUD
export const pemilikCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    jenis_pemilik?: string;
    status_aktif?: boolean;
  }): Promise<ListResponse<Pemilik>> => {
    const response: AxiosResponse<ListResponse<Pemilik>> = await crud.get(
      "/pemilik/",
      { params }
    );
    return response.data;
  },

  getById: async (id: string): Promise<DetailResponse<Pemilik>> => {
    const response: AxiosResponse<DetailResponse<Pemilik>> = await crud.get(
      `/pemilik/${id}/`
    );
    return response.data;
  },

  create: async (data: Pemilik): Promise<DetailResponse<Pemilik>> => {
    const response: AxiosResponse<DetailResponse<Pemilik>> = await crud.post(
      "/pemilik/",
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: Pemilik
  ): Promise<DetailResponse<Pemilik>> => {
    const response: AxiosResponse<DetailResponse<Pemilik>> = await crud.patch(
      `/pemilik/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/pemilik/${id}/`);
  },

  // Custom actions
  getDaftarSapi: async (
    id: string,
    params?: {
      status?: string;
      ordering?: string;
    }
  ): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      `/pemilik/${id}/daftar_sapi/`,
      { params }
    );
    return response.data;
  },

  getStatistikSapi: async (id: string): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      `/pemilik/${id}/statistik_sapi/`
    );
    return response.data;
  },

  nonaktifkan: async (id: string): Promise<DetailResponse<Pemilik>> => {
    const response: AxiosResponse<DetailResponse<Pemilik>> = await crud.post(
      `/pemilik/${id}/nonaktifkan/`
    );
    return response.data;
  },

  aktifkan: async (id: string): Promise<DetailResponse<Pemilik>> => {
    const response: AxiosResponse<DetailResponse<Pemilik>> = await crud.post(
      `/pemilik/${id}/aktifkan/`
    );
    return response.data;
  },

  getStatistikUmum: async (): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/pemilik/statistik_umum/"
    );
    return response.data;
  },

  getPerluPerhatian: async (): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/pemilik/perlu_perhatian/"
    );
    return response.data;
  },

  getMyProfile: async (): Promise<DetailResponse<Pemilik>> => {
    const response: AxiosResponse<DetailResponse<Pemilik>> = await crud.get(
      "/pemilik/my-profile/"
    );
    return response.data;
  },
};

// Parameter Gejala CRUD
export const parameterGejalaCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    satuan?: string;
  }): Promise<ListResponse<ParameterGejala>> => {
    const response: AxiosResponse<ListResponse<ParameterGejala>> =
      await crud.get("/parameter-gejala/", { params });
    return response.data;
  },

  getById: async (id: string): Promise<DetailResponse<ParameterGejala>> => {
    const response: AxiosResponse<DetailResponse<ParameterGejala>> =
      await crud.get(`/parameter-gejala/${id}/`);
    return response.data;
  },

  create: async (
    data: ParameterGejala
  ): Promise<DetailResponse<ParameterGejala>> => {
    const response: AxiosResponse<DetailResponse<ParameterGejala>> =
      await crud.post("/parameter-gejala/", data);
    return response.data;
  },

  update: async (
    id: string,
    data: ParameterGejala
  ): Promise<DetailResponse<ParameterGejala>> => {
    const response: AxiosResponse<DetailResponse<ParameterGejala>> =
      await crud.patch(`/parameter-gejala/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/parameter-gejala/${id}/`);
  },

  // Custom actions
  getParameterFuzzy: async (): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/parameter-gejala/parameter_fuzzy/"
    );
    return response.data;
  },

  validasiNilai: async (
    id: string,
    nilai: number
  ): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.post(
      `/parameter-gejala/${id}/validasi_nilai/`,
      { nilai }
    );
    return response.data;
  },
};

// Pemeriksaan Sapi CRUD
export const pemeriksaanSapiCRUD = {
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
    sapi?: string;
    tanggal?: string;
  }): Promise<ListResponse<PemeriksaanSapi>> => {
    const response: AxiosResponse<ListResponse<PemeriksaanSapi>> =
      await crud.get("/pemeriksaan-sapi/", { params });
    return response.data;
  },

  getById: async (id: string): Promise<DetailResponse<PemeriksaanSapi>> => {
    const response: AxiosResponse<DetailResponse<PemeriksaanSapi>> =
      await crud.get(`/pemeriksaan-sapi/${id}/`);
    return response.data;
  },

  create: async (
    data: PemeriksaanSapi
  ): Promise<DetailResponse<PemeriksaanSapi>> => {
    const response: AxiosResponse<DetailResponse<PemeriksaanSapi>> =
      await crud.post("/pemeriksaan-sapi/", data);
    return response.data;
  },

  update: async (
    id: string,
    data: PemeriksaanSapi
  ): Promise<DetailResponse<PemeriksaanSapi>> => {
    const response: AxiosResponse<DetailResponse<PemeriksaanSapi>> =
      await crud.patch(`/pemeriksaan-sapi/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await crud.delete(`/pemeriksaan-sapi/${id}/`);
  },

  // Custom actions
  getAnalisisParameter: async (id: string): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      `/pemeriksaan-sapi/${id}/analisis_parameter/`
    );
    return response.data;
  },

  getLaporanHarian: async (tanggal?: string): Promise<DetailResponse<any>> => {
    const params = tanggal ? { tanggal } : {};
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/pemeriksaan-sapi/laporan_harian/",
      { params }
    );
    return response.data;
  },

  getTrendMingguan: async (): Promise<DetailResponse<any>> => {
    const response: AxiosResponse<DetailResponse<any>> = await crud.get(
      "/pemeriksaan-sapi/trend_mingguan/"
    );
    return response.data;
  },

  exportPdf: async (id: string): Promise<Blob> => {
    const response: AxiosResponse<Blob> = await crud.get(
      `/pemeriksaan-sapi/${id}/export_pdf/`,
      {
        responseType: 'blob', // Important: set responseType to blob
      }
    );
    return response.data;
  },
};

export default crud;
