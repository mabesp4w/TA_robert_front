/** @format */
export interface ListResponse<T> {
  message?: string;
  status?: string;
  results?: T[];
}

export interface DetailResponse<T> {
  message?: string;
  status?: string;
  results?: T;
}

export interface JenisPenyakit {
  id: string;
  nm_penyakit: string;
  deskripsi: string;
  tingkat_bahaya: "ringan" | "sedang" | "berat" | "sangat_berat";
  gejala_umum: string;
  pengobatan?: string;
  pencegahan?: string;
  created_at: string;
  updated_at: string;
}

export interface DataSapi {
  id: string;
  pemilik: string;
  pemilik_detail?: Pemilik;
  nm_sapi?: string;
  jenkel: "jantan" | "betina";
  umur_bulan: number;
  berat_kg: number;
  status_kesehatan: "sehat" | "sakit" | "dalam_pengobatan" | "sembuh";
  tgl_lahir?: string;
  tgl_registrasi: string;
  umur_tahun?: number;
  umur_display?: string;
  catatan?: string;
  created_at: string;
  updated_at: string;
}

export interface Pemilik {
  id: string;
  kd_pemilik: string;
  nm_pemilik: string;
  email: string;
  no_hp: string;
  alamat: string;
  jenis_pemilik: "perorangan" | "kelompok" | "koperasi" | "perusahaan";
  max_sapi: number;
  status_aktif: boolean;
  tgl_registrasi: string;
  catatan?: string;
  created_at?: string;
  updated_at?: string;

  // Computed fields from backend
  total_sapi?: number;
  sapi_sehat?: number;
  sapi_sakit?: number;
  persentase_kapasitas?: number;
}

export interface StatistikPemilik {
  total_pemilik: number;
  pemilik_aktif: number;
  pemilik_nonaktif: number;
  distribusi_jenis: {
    [key: string]: number;
  };
  total_sapi_seluruh_pemilik: number;
  rata_rata_max_sapi_per_pemilik: number;
  pemilik_hampir_penuh_kapasitas: Array<{
    pemilik: Pemilik;
    persentase_kapasitas: number;
  }>;
}

export interface PemilikPerluPerhatian {
  pemilik: Pemilik;
  masalah: string[];
  tingkat_prioritas: "rendah" | "sedang" | "tinggi";
  persentase_kapasitas: number;
}

export interface StatistikSapiPemilik {
  pemilik: Pemilik;
  ringkasan: {
    total_sapi: number;
    sapi_sehat: number;
    sapi_sakit: number;
    persentase_sehat: number;
    kapasitas_terpakai: number;
  };
  distribusi_status: {
    [key: string]: number;
  };
  distribusi_kelamin: {
    [key: string]: number;
  };
  statistik_umur_berat: {
    rata_rata_umur_bulan: number;
    rata_rata_berat_kg: number;
    umur_tertua_bulan: number;
    umur_termuda_bulan: number;
    berat_terberat_kg: number;
    berat_teringan_kg: number;
  };
}

export interface PemeriksaanSapi {
  id: string;
  sapi: string; // ID sapi atau object DataSapi untuk display
  tgl_pemeriksaan: string;
  suhu_tubuh: number;
  frekuensi_napas: number;
  denyut_jantung: number;
  nafsu_makan: number; // 1-10 scale
  aktivitas: number; // 1-10 scale

  // Gejala boolean
  batuk: boolean;
  sesak_napas: boolean;
  diare: boolean;
  muntah: boolean;
  lemas: boolean;
  demam: boolean;

  // Kondisi fisik (integer values - required)
  kondisi_mata: number;
  kondisi_hidung: number;
  konsistensi_feses: number;

  catatan_pemeriksaan?: string;
  created_at?: string;
  updated_at?: string;

  // Relasi untuk display
  sapi_detail?: {
    id: string;
    nm_sapi: string;
    jenkel: string;
    umur_bulan: number;
    berat_kg: number;
  };
}

export interface AnalisisParameter {
  pemeriksaan: PemeriksaanSapi;
  analisis_parameter: {
    suhu_tubuh: {
      nilai: number;
      status: "normal" | "abnormal";
      range_normal: [number, number];
    };
    frekuensi_napas: {
      nilai: number;
      status: "normal" | "abnormal";
      range_normal: [number, number];
    };
    denyut_jantung: {
      nilai: number;
      status: "normal" | "abnormal";
      range_normal: [number, number];
    };
    nafsu_makan: {
      nilai: number;
      status: "baik" | "buruk";
      kategori: "tinggi" | "sedang" | "rendah";
    };
    aktivitas: {
      nilai: number;
      status: "aktif" | "lemas";
      kategori: "tinggi" | "sedang" | "rendah";
    };
  };
  skor_kesehatan: number;
  status_keseluruhan: "baik" | "perlu_perhatian" | "buruk";
  gejala_tambahan: string[];
  jumlah_gejala_positif: number;
}

export interface LaporanHarian {
  tanggal: string;
  total_pemeriksaan: number;
  statistik_suhu: {
    rata_rata: number;
    jumlah_demam: number;
  };
  distribusi_gejala: {
    batuk: number;
    sesak_napas: number;
    diare: number;
    muntah: number;
    lemas: number;
    demam: number;
  };
  pemeriksaan: PemeriksaanSapi[];
}

export interface TrendMingguan {
  periode: string;
  trend_harian: Array<{
    tanggal: string;
    total_pemeriksaan: number;
    rata_rata_suhu: number;
    jumlah_gejala_demam: number;
    jumlah_gejala_diare: number;
  }>;
  total_seminggu: number;
  rata_rata_harian: number;
}

export interface ParameterGejala {
  id: string;
  kd_parameter: string;
  nm_parameter: string;
  deskripsi: string;
  satuan: string;
  nilai_minimum: number;
  nilai_maksimum: number;
  created_at?: string;
  updated_at?: string;
}

export interface ParameterFuzzy {
  total_parameter: number;
  parameters: {
    [key: string]: {
      id: string;
      nama: string;
      kode: string;
      satuan: string;
      range: [number, number];
      deskripsi: string;
    };
  };
}

export interface ValidasiNilai {
  parameter: ParameterGejala;
  nilai_input: number;
  valid: boolean;
  status: "dalam_range" | "di_luar_range";
  range_normal: [number, number];
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
