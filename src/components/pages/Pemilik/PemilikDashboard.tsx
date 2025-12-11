/** @format */
// components/pages/Pemilik/PemilikDashboard.tsx

"use client";

import { useEffect, useState } from "react";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import { useAuthStore } from "@/stores/auth/authStore";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import {
  Beef,
  Heart,
  AlertTriangle,
  Activity,
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import moment from "moment";

export default function PemilikDashboard() {
  const { currentPemilik, fetchMyProfile, fetchStatistikSapiPemilik, loading } =
    usePemilikStore();
  const { user } = useAuthStore();
  const [statistik, setStatistik] = useState<any>(null);
  const [loadingStatistik, setLoadingStatistik] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      fetchMyProfile();
    }
  }, [user, fetchMyProfile]);

  useEffect(() => {
    if (currentPemilik?.id) {
      loadStatistik();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPemilik?.id]);

  const loadStatistik = async () => {
    if (!currentPemilik?.id) return;
    setLoadingStatistik(true);
    try {
      const stats = await fetchStatistikSapiPemilik(currentPemilik.id);
      // Handle response structure - bisa berupa object langsung atau dalam results
      const statistikData = stats?.results || stats || null;
      setStatistik(statistikData);
    } catch (error) {
      console.error("Error loading statistik:", error);
      setStatistik(null);
    } finally {
      setLoadingStatistik(false);
    }
  };

  // Tampilkan loading saat fetch data
  if (loading && !currentPemilik) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Tampilkan error jika tidak ada user
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Anda Belum Login</h3>
            <p className="text-sm">
              Silakan login terlebih dahulu untuk mengakses dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tampilkan error jika data pemilik tidak ditemukan (setelah loading selesai)
  if (!loading && !currentPemilik && user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Data Pemilik Tidak Ditemukan</h3>
            <p className="text-sm">
              Data pemilik untuk akun Anda ({user.email}) tidak ditemukan. 
              Silakan hubungi administrator untuk menghubungkan akun Anda dengan data pemilik.
            </p>
            <div className="mt-4">
              <p className="text-xs text-base-content/60">
                Pastikan email akun Anda ({user.email}) sama dengan email yang terdaftar pada data pemilik.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pastikan currentPemilik tidak null sebelum melanjutkan
  if (!currentPemilik) {
    return null;
  }

  const persentaseKapasitas =
    currentPemilik.max_sapi > 0
      ? ((currentPemilik.total_sapi || 0) / currentPemilik.max_sapi) * 100
      : 0;

  const persentaseSehat =
    currentPemilik.total_sapi && currentPemilik.total_sapi > 0
      ? ((currentPemilik.sapi_sehat || 0) / currentPemilik.total_sapi) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Pemilik</h1>
            <p className="text-base-content/70 mt-1">
              Selamat datang, <span className="font-semibold">{currentPemilik.nm_pemilik}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <Calendar className="w-4 h-4" />
            <span>
              {moment().format("DD MMMM YYYY, HH:mm")}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sapi */}
        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-primary">
            <Beef className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Sapi</div>
          <div className="stat-value text-primary">
            {currentPemilik.total_sapi || 0}
          </div>
          <div className="stat-desc">
            dari {currentPemilik.max_sapi} kapasitas maksimal
          </div>
        </div>

        {/* Sapi Sehat */}
        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-success">
            <Heart className="w-8 h-8" />
          </div>
          <div className="stat-title">Sapi Sehat</div>
          <div className="stat-value text-success">
            {currentPemilik.sapi_sehat || 0}
          </div>
          <div className="stat-desc">
            {persentaseSehat.toFixed(1)}% dari total
          </div>
        </div>

        {/* Sapi Sakit */}
        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-error">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="stat-title">Sapi Sakit</div>
          <div className="stat-value text-error">
            {currentPemilik.sapi_sakit || 0}
          </div>
          <div className="stat-desc">Memerlukan perhatian</div>
        </div>

        {/* Kapasitas */}
        <div className="stat bg-base-100 rounded-lg shadow-md">
          <div className="stat-figure text-info">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div className="stat-title">Kapasitas Terpakai</div>
          <div className="stat-value text-info">
            {persentaseKapasitas.toFixed(1)}%
          </div>
          <div className="stat-desc">
            {currentPemilik.total_sapi || 0} / {currentPemilik.max_sapi} sapi
          </div>
        </div>
      </div>

      {/* Progress Bar Kapasitas */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Kapasitas Kandang</h3>
          <span className="text-sm text-base-content/70">
            {currentPemilik.total_sapi || 0} / {currentPemilik.max_sapi} sapi
          </span>
        </div>
        <div className="w-full bg-base-300 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              persentaseKapasitas >= 90
                ? "bg-error"
                : persentaseKapasitas >= 80
                ? "bg-warning"
                : persentaseKapasitas >= 60
                ? "bg-info"
                : "bg-success"
            }`}
            style={{ width: `${Math.min(persentaseKapasitas, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-base-content/60 mt-2">
          {persentaseKapasitas >= 90
            ? "⚠️ Kapasitas hampir penuh"
            : persentaseKapasitas >= 80
            ? "💡 Kapasitas 80% terisi"
            : "✅ Masih ada ruang untuk sapi baru"}
        </p>
      </div>

      {/* Statistik Detail */}
      {loadingStatistik ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : statistik ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribusi Status */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Distribusi Status Kesehatan
            </h3>
            {statistik.distribusi_status &&
            Object.keys(statistik.distribusi_status).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(statistik.distribusi_status).map(
                  ([status, jumlah]: [string, any]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status === "sehat"
                              ? "bg-success"
                              : status === "sakit"
                              ? "bg-error"
                              : status === "dalam_pengobatan"
                              ? "bg-warning"
                              : "bg-info"
                          }`}
                        ></div>
                        <span className="capitalize">
                          {status.replace("_", " ")}
                        </span>
                      </div>
                      <span className="font-semibold">{jumlah}</span>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-base-content/60">Belum ada data</p>
            )}
          </div>

          {/* Statistik Umur & Berat */}
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Statistik Umur & Berat
            </h3>
            {statistik.statistik_umur_berat ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title text-xs">Rata-rata Umur</div>
                  <div className="stat-value text-sm">
                    {statistik.statistik_umur_berat.rata_rata_umur_bulan || 0}
                  </div>
                  <div className="stat-desc text-xs">bulan</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title text-xs">Rata-rata Berat</div>
                  <div className="stat-value text-sm">
                    {statistik.statistik_umur_berat.rata_rata_berat_kg || 0}
                  </div>
                  <div className="stat-desc text-xs">kg</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title text-xs">Umur Tertua</div>
                  <div className="stat-value text-sm">
                    {statistik.statistik_umur_berat.umur_tertua_bulan || 0}
                  </div>
                  <div className="stat-desc text-xs">bulan</div>
                </div>
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title text-xs">Berat Terberat</div>
                  <div className="stat-value text-sm">
                    {statistik.statistik_umur_berat.berat_terberat_kg || 0}
                  </div>
                  <div className="stat-desc text-xs">kg</div>
                </div>
              </div>
            ) : (
              <p className="text-base-content/60">Belum ada data</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-base-100 rounded-lg shadow-md p-6">
          <p className="text-base-content/60 text-center py-4">
            Belum ada statistik yang tersedia
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/pemilik/sapi"
            className="btn btn-outline btn-lg flex items-center gap-2"
          >
            <Beef className="w-5 h-5" />
            Lihat Data Sapi
          </Link>
          <Link
            href="/pemilik/pemeriksaan"
            className="btn btn-outline btn-lg flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            Pemeriksaan Sapi
          </Link>
          <Link
            href="/pemilik/profil"
            className="btn btn-outline btn-lg flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            Profil Saya
          </Link>
        </div>
      </div>

      {/* Info Pemilik */}
      <div className="bg-base-100 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Informasi Pemilik</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-base-content/70">Nama</p>
            <p className="font-semibold">{currentPemilik.nm_pemilik}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70">Jenis Pemilik</p>
            <p className="font-semibold capitalize">
              {currentPemilik.jenis_pemilik}
            </p>
          </div>
          <div>
            <p className="text-sm text-base-content/70">Email</p>
            <p className="font-semibold">{currentPemilik.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70">No. HP</p>
            <p className="font-semibold">{currentPemilik.no_hp || "-"}</p>
          </div>
          {currentPemilik.alamat && (
            <div className="md:col-span-2">
              <p className="text-sm text-base-content/70">Alamat</p>
              <p className="font-semibold">{currentPemilik.alamat}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

