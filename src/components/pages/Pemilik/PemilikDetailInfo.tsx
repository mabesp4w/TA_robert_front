/** @format */
// components/pages/Pemilik/PemilikDetailInfo.tsx

"use client";

import { Pemilik } from "@/types";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";

interface PemilikDetailInfoProps {
  pemilik: Pemilik;
}

const PemilikDetailInfo = ({ pemilik }: PemilikDetailInfoProps) => {
  // Extract actual pemilik data if it's wrapped in response object
  // This is a safety check in case the store didn't extract properly
  // If pemilik has 'results' property, extract it; otherwise use pemilik directly
  const actualPemilik: Pemilik =
    (pemilik as any)?.results &&
    typeof (pemilik as any).results === "object" &&
    (pemilik as any).results.id
      ? (pemilik as any).results
      : pemilik;

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
    actualPemilik.persentase_kapasitas !== undefined
      ? actualPemilik.persentase_kapasitas
      : actualPemilik.max_sapi > 0
      ? ((actualPemilik.total_sapi || 0) / actualPemilik.max_sapi) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="card-title text-2xl">
                {actualPemilik.nm_pemilik || "Tanpa Nama"}
              </h2>
              {actualPemilik.id && (
                <p className="text-base-content/70 font-mono text-xs">
                  ID: {actualPemilik.id.slice(0, 8)}...
                </p>
              )}
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div
                className={`badge ${getJenisPemilikColor(
                  actualPemilik.jenis_pemilik
                )} badge-lg`}
              >
                {getJenisPemilikText(actualPemilik.jenis_pemilik)}
              </div>
              <div
                className={`badge ${
                  actualPemilik.status_aktif ? "badge-success" : "badge-error"
                }`}
              >
                {actualPemilik.status_aktif ? "Aktif" : "Non-Aktif"}
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
                  <p className="font-semibold">{actualPemilik.email || "-"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">No. HP</p>
                  <p className="font-semibold">{actualPemilik.no_hp || "-"}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mt-1">
                  <MapPinIcon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-base-content/70">Alamat</p>
                  <div className="bg-base-200 p-3 rounded-lg mt-1">
                    <p className="text-sm">{actualPemilik.alamat || "-"}</p>
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
                  <p className="font-semibold">{actualPemilik.max_sapi} sapi</p>
                </div>
              </div>

              {/* Capacity Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Kapasitas Terpakai</span>
                  <span className="font-semibold">
                    {actualPemilik.total_sapi ?? 0}/{actualPemilik.max_sapi} (
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
              <div className="grid grid-cols-2 gap-2">
                <div className="stat bg-success/10 rounded-lg">
                  <div className="stat-title text-xs">Sapi Sehat</div>
                  <div className="stat-value text-lg text-success">
                    {actualPemilik.sapi_sehat ?? 0}
                  </div>
                </div>
                <div className="stat bg-error/10 rounded-lg">
                  <div className="stat-title text-xs">Sapi Sakit</div>
                  <div className="stat-value text-lg text-error">
                    {actualPemilik.sapi_sakit ?? 0}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    Tanggal Registrasi
                  </p>
                  <p className="font-semibold">
                    {moment(actualPemilik.tgl_registrasi).format(
                      "DD MMMM YYYY"
                    )}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {moment(actualPemilik.tgl_registrasi).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan */}
          {actualPemilik.catatan && (
            <div className="mt-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-neutral/10 rounded-lg flex items-center justify-center mt-1">
                  <DocumentTextIcon className="h-5 w-5 text-neutral" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-base-content/70">Catatan</p>
                  <div className="bg-base-200 p-3 rounded-lg mt-1">
                    <p className="text-sm">{actualPemilik.catatan}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Tab Content - Info Dasar */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Informasi Dasar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Statistik Sapi */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg border-b pb-2">
                Statistik Sapi
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="stat bg-primary/10 rounded-lg">
                  <div className="stat-title text-xs">Total Sapi</div>
                  <div className="stat-value text-lg text-primary">
                    {actualPemilik.total_sapi ?? 0}
                  </div>
                </div>
                <div className="stat bg-success/10 rounded-lg">
                  <div className="stat-title text-xs">Sapi Sehat</div>
                  <div className="stat-value text-lg text-success">
                    {actualPemilik.sapi_sehat ?? 0}
                  </div>
                </div>
                <div className="stat bg-error/10 rounded-lg">
                  <div className="stat-title text-xs">Sapi Sakit</div>
                  <div className="stat-value text-lg text-error">
                    {actualPemilik.sapi_sakit ?? 0}
                  </div>
                </div>
                <div className="stat bg-info/10 rounded-lg">
                  <div className="stat-title text-xs">Kapasitas</div>
                  <div className="stat-value text-lg text-info">
                    {actualPemilik.persentase_kapasitas
                      ? actualPemilik.persentase_kapasitas.toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Distribusi Status */}
            {actualPemilik.distribusi_sapi &&
            Object.keys(actualPemilik.distribusi_sapi).length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">
                  Distribusi Status Kesehatan
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(actualPemilik.distribusi_sapi).map(
                    ([status, jumlah]) => (
                      <div key={status} className="stat bg-base-200 rounded-lg">
                        <div className="stat-title capitalize text-xs">
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
            ) : (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">
                  Distribusi Status Kesehatan
                </h4>
                <div className="alert alert-warning">
                  <span>Belum ada data distribusi status</span>
                </div>
              </div>
            )}
          </div>

          {/* Daftar Sapi (Preview) */}
          {actualPemilik.daftar_sapi && actualPemilik.daftar_sapi.length > 0 ? (
            <div className="mt-6">
              <h4 className="font-semibold text-lg border-b pb-2 mb-4">
                Daftar Sapi ({actualPemilik.daftar_sapi.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="table table-zebra table-sm">
                  <thead>
                    <tr>
                      <th>No Sapi</th>
                      <th>Nama</th>
                      <th>Jenis Kelamin</th>
                      <th>Umur</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actualPemilik.daftar_sapi.slice(0, 5).map((sapi: any) => (
                      <tr key={sapi.id}>
                        <td className="font-mono text-xs">
                          {sapi.no_sapi || "-"}
                        </td>
                        <td className="font-semibold">
                          {sapi.nm_sapi || `Sapi ${sapi.id?.slice(0, 8)}`}
                        </td>
                        <td>
                          <span
                            className={`badge badge-sm ${
                              sapi.jenkel === "jantan"
                                ? "badge-info"
                                : "badge-secondary"
                            }`}
                          >
                            {sapi.jenkel === "jantan" ? "Jantan" : "Betina"}
                          </span>
                        </td>
                        <td>
                          {sapi.umur_display || `${sapi.umur_bulan || 0} bl`}
                        </td>
                        <td>
                          <span
                            className={`badge badge-sm ${
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
                      </tr>
                    ))}
                  </tbody>
                </table>
                {actualPemilik.daftar_sapi.length > 5 && (
                  <p className="text-sm text-base-content/60 mt-2 text-center">
                    Dan {actualPemilik.daftar_sapi.length - 5} sapi lainnya.
                    Lihat tab &quot;Daftar Sapi&quot; untuk melihat semua.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="alert alert-info">
                <span>Belum ada sapi terdaftar untuk pemilik ini</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PemilikDetailInfo;
