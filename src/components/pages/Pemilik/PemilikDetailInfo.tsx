/** @format */
// components/pages/Pemilik/PemilikDetailInfo.tsx

"use client";

import { useState, useEffect } from "react";
import { Pemilik, StatistikSapiPemilik } from "@/types";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import moment from "moment";

interface PemilikDetailInfoProps {
  pemilik: Pemilik;
}

const PemilikDetailInfo = ({ pemilik }: PemilikDetailInfoProps) => {
  const { fetchStatistikSapiPemilik, fetchDaftarSapiPemilik } =
    usePemilikStore();
  const [statistikSapi, setStatistikSapi] =
    useState<StatistikSapiPemilik | null>(null);
  const [daftarSapi, setDaftarSapi] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "statistik") {
      handleFetchStatistik();
    } else if (activeTab === "sapi") {
      handleFetchDaftarSapi();
    }
  }, [activeTab]);

  const handleFetchStatistik = async () => {
    setLoading(true);
    const result = await fetchStatistikSapiPemilik(pemilik.id);
    if (result) {
      setStatistikSapi(result);
    }
    setLoading(false);
  };

  const handleFetchDaftarSapi = async () => {
    setLoading(true);
    const result = await fetchDaftarSapiPemilik(pemilik.id);
    if (result) {
      setDaftarSapi(result.daftar_sapi);
    }
    setLoading(false);
  };

  const getJenisPemilikText = (jenis: string) => {
    switch (jenis) {
      case "perorangan":
        return "Perorangan";
      case "kelompok":
        return "Kelompok";
      case "koperasi":
        return "Koperasi";
      case "perusahaan":
        return "Perusahaan";
      default:
        return jenis;
    }
  };

  const getJenisPemilikColor = (jenis: string) => {
    switch (jenis) {
      case "perorangan":
        return "badge-primary";
      case "kelompok":
        return "badge-secondary";
      case "koperasi":
        return "badge-accent";
      case "perusahaan":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const persentaseKapasitas =
    pemilik.persentase_kapasitas ||
    ((pemilik.total_sapi || 0) / pemilik.max_sapi) * 100;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="card-title text-2xl">
                {pemilik.nm_pemilik || "Tanpa Nama"}
              </h2>
              <p className="text-base-content/70 font-mono text-sm">
                {pemilik.kd_pemilik}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div
                className={`badge ${getJenisPemilikColor(
                  pemilik.jenis_pemilik
                )} badge-lg`}
              >
                {getJenisPemilikText(pemilik.jenis_pemilik)}
              </div>
              <div
                className={`badge ${
                  pemilik.status_aktif ? "badge-success" : "badge-error"
                }`}
              >
                {pemilik.status_aktif ? "Aktif" : "Non-Aktif"}
              </div>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                Informasi Kontak
              </h3>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Email</p>
                  <p className="font-semibold">{pemilik.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">No. HP</p>
                  <p className="font-semibold">{pemilik.no_hp}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mt-1">
                  <MapPinIcon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-base-content/70">Alamat</p>
                  <div className="bg-base-200 p-3 rounded-lg mt-1">
                    <p className="text-sm">{pemilik.alamat}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity & Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                Kapasitas & Statistik
              </h3>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-info" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-base-content/70">
                    Kapasitas Maksimal
                  </p>
                  <p className="font-semibold">{pemilik.max_sapi} sapi</p>
                </div>
              </div>

              {/* Capacity Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Kapasitas Terpakai</span>
                  <span className="font-semibold">
                    {pemilik.total_sapi || 0}/{pemilik.max_sapi} (
                    {persentaseKapasitas.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
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
              </div>

              {/* Health Stats */}
              {(pemilik.sapi_sehat !== undefined ||
                pemilik.sapi_sakit !== undefined) && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="stat bg-success/10 rounded-lg">
                    <div className="stat-title text-xs">Sapi Sehat</div>
                    <div className="stat-value text-lg text-success">
                      {pemilik.sapi_sehat || 0}
                    </div>
                  </div>
                  <div className="stat bg-error/10 rounded-lg">
                    <div className="stat-title text-xs">Sapi Sakit</div>
                    <div className="stat-value text-lg text-error">
                      {pemilik.sapi_sakit || 0}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    Tanggal Registrasi
                  </p>
                  <p className="font-semibold">
                    {moment(pemilik.tgl_registrasi).format("DD MMMM YYYY")}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {moment(pemilik.tgl_registrasi).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan */}
          {pemilik.catatan && (
            <div className="mt-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-neutral/10 rounded-lg flex items-center justify-center mt-1">
                  <DocumentTextIcon className="h-5 w-5 text-neutral" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-base-content/70">Catatan</p>
                  <div className="bg-base-200 p-3 rounded-lg mt-1">
                    <p className="text-sm">{pemilik.catatan}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          <UserIcon className="h-4 w-4 mr-2" />
          Info Dasar
        </button>
        <button
          className={`tab ${activeTab === "statistik" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("statistik")}
        >
          <ChartBarIcon className="h-4 w-4 mr-2" />
          Statistik Sapi
        </button>
        <button
          className={`tab ${activeTab === "sapi" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("sapi")}
        >
          <ListBulletIcon className="h-4 w-4 mr-2" />
          Daftar Sapi
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "statistik" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Statistik Sapi Pemilik</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : statistikSapi ? (
              <div className="space-y-6">
                {/* Ringkasan */}
                <div className="stats shadow w-full">
                  <div className="stat">
                    <div className="stat-title">Total Sapi</div>
                    <div className="stat-value text-primary">
                      {statistikSapi.ringkasan.total_sapi}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Sehat</div>
                    <div className="stat-value text-success">
                      {statistikSapi.ringkasan.sapi_sehat}
                    </div>
                    <div className="stat-desc">
                      {statistikSapi.ringkasan.persentase_sehat}%
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Sakit</div>
                    <div className="stat-value text-error">
                      {statistikSapi.ringkasan.sapi_sakit}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Kapasitas</div>
                    <div className="stat-value text-warning">
                      {statistikSapi.ringkasan.kapasitas_terpakai}%
                    </div>
                  </div>
                </div>

                {/* Distribusi Status */}
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h4 className="card-title">Distribusi Status Kesehatan</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(statistikSapi.distribusi_status).map(
                        ([status, jumlah]) => (
                          <div
                            key={status}
                            className="stat bg-base-200 rounded-lg"
                          >
                            <div className="stat-title capitalize">
                              {status.replace("_", " ")}
                            </div>
                            <div className="stat-value text-sm">
                              {jumlah as number}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Distribusi Kelamin */}
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h4 className="card-title">Distribusi Jenis Kelamin</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(statistikSapi.distribusi_kelamin).map(
                        ([kelamin, jumlah]) => (
                          <div
                            key={kelamin}
                            className="stat bg-base-200 rounded-lg"
                          >
                            <div className="stat-title capitalize">
                              {kelamin}
                            </div>
                            <div className="stat-value text-sm">
                              {jumlah as number}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistik Umur & Berat */}
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h4 className="card-title">Statistik Umur & Berat</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Rata-rata Umur</div>
                        <div className="stat-value text-sm">
                          {
                            statistikSapi.statistik_umur_berat
                              .rata_rata_umur_bulan
                          }
                        </div>
                        <div className="stat-desc">bulan</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Rata-rata Berat</div>
                        <div className="stat-value text-sm">
                          {
                            statistikSapi.statistik_umur_berat
                              .rata_rata_berat_kg
                          }
                        </div>
                        <div className="stat-desc">kg</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Umur Tertua</div>
                        <div className="stat-value text-sm">
                          {statistikSapi.statistik_umur_berat.umur_tertua_bulan}
                        </div>
                        <div className="stat-desc">bulan</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Umur Termuda</div>
                        <div className="stat-value text-sm">
                          {
                            statistikSapi.statistik_umur_berat
                              .umur_termuda_bulan
                          }
                        </div>
                        <div className="stat-desc">bulan</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Berat Terberat</div>
                        <div className="stat-value text-sm">
                          {statistikSapi.statistik_umur_berat.berat_terberat_kg}
                        </div>
                        <div className="stat-desc">kg</div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Berat Teringan</div>
                        <div className="stat-value text-sm">
                          {statistikSapi.statistik_umur_berat.berat_teringan_kg}
                        </div>
                        <div className="stat-desc">kg</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-base-content/60">Belum ada data statistik</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "sapi" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Daftar Sapi</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : daftarSapi.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Nama Sapi</th>
                      <th>Jenis Kelamin</th>
                      <th>Umur</th>
                      <th>Berat</th>
                      <th>Status Kesehatan</th>
                      <th>Registrasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daftarSapi.map((sapi: any, index: number) => (
                      <tr key={index}>
                        <td className="font-semibold">{sapi.nm_sapi}</td>
                        <td>
                          <span
                            className={`badge ${
                              sapi.jenkel === "jantan"
                                ? "badge-info"
                                : "badge-secondary"
                            }`}
                          >
                            {sapi.jenkel === "jantan" ? "Jantan" : "Betina"}
                          </span>
                        </td>
                        <td>{sapi.umur_bulan} bulan</td>
                        <td>{sapi.berat_kg} kg</td>
                        <td>
                          <span
                            className={`badge ${
                              sapi.status_kesehatan === "sehat"
                                ? "badge-success"
                                : sapi.status_kesehatan === "sakit"
                                ? "badge-error"
                                : sapi.status_kesehatan === "dalam_pengobatan"
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {sapi.status_kesehatan === "sehat"
                              ? "Sehat"
                              : sapi.status_kesehatan === "sakit"
                              ? "Sakit"
                              : sapi.status_kesehatan === "dalam_pengobatan"
                              ? "Dalam Pengobatan"
                              : "Sembuh"}
                          </span>
                        </td>
                        <td>
                          {moment(sapi.tgl_registrasi).format("DD/MM/YYYY")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-base-content/60">Belum ada sapi terdaftar</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timestamps */}
      {activeTab === "info" && (pemilik.created_at || pemilik.updated_at) && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Informasi Sistem</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pemilik.created_at && (
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Dibuat</div>
                  <div className="stat-value text-sm">
                    {moment(pemilik.created_at).format("DD/MM/YYYY")}
                  </div>
                  <div className="stat-desc">
                    {moment(pemilik.created_at).format("HH:mm")}
                  </div>
                </div>
              )}
              {pemilik.updated_at && (
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Diperbarui</div>
                  <div className="stat-value text-sm">
                    {moment(pemilik.updated_at).format("DD/MM/YYYY")}
                  </div>
                  <div className="stat-desc">
                    {moment(pemilik.updated_at).format("HH:mm")}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PemilikDetailInfo;
