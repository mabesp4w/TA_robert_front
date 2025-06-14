/** @format */

// types/dashboard.ts
export interface RingkasanData {
  total_pemilik_aktif: number;
  total_sapi_hidup: number;
  total_jenis_penyakit: number;
  total_sapi_jantan: number;
  total_sapi_betina: number;
  sapi_sehat: number;
  sapi_sakit: number;
  sapi_dalam_pengobatan: number;
  sapi_sembuh: number;
  sapi_mati: number;
}

export interface DistribusiData {
  status_kesehatan?: string;
  jenkel?: string;
  jenis_pemilik?: string;
  tingkat_bahaya?: string;
  kelompok_umur?: string;
  jumlah: number;
  persentase: number;
}

export interface TopPemilik {
  id: string;
  nm_pemilik: string;
  jenis_pemilik: string;
  total_sapi: number;
  sapi_sehat: number;
  sapi_sakit: number;
  max_sapi: number;
  utilisasi_persen: number;
}

export interface TrendRegistrasi {
  bulan: string;
  tahun: number;
  periode: string;
  total_pemilik_baru: number;
  total_sapi_baru: number;
}

export interface DashboardData {
  ringkasan: RingkasanData;
  distribusi_status_kesehatan: DistribusiData[];
  distribusi_jenis_kelamin: DistribusiData[];
  distribusi_jenis_pemilik: DistribusiData[];
  distribusi_tingkat_bahaya: DistribusiData[];
  distribusi_umur_sapi: DistribusiData[];
  top_pemilik: TopPemilik[];
  trend_registrasi: TrendRegistrasi[];
  last_updated: string;
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  refreshData: () => Promise<void>;
}
