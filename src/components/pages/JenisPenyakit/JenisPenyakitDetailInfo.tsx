/** @format */

"use client";

import { JenisPenyakit } from "@/types";
import { CakeIcon, ScaleIcon, HeartIcon } from "@heroicons/react/24/outline";
import { BASE_URL } from "@/services/baseURL";

interface JenisPenyakitDetailInfoProps {
  jenisPenyakit: JenisPenyakit;
}

const JenisPenyakitDetailInfo = ({
  jenisPenyakit,
}: JenisPenyakitDetailInfoProps) => {
  // Safety check - harus di awal tapi setelah semua function declarations
  if (!jenisPenyakit) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="text-error">Data tidak tersedia</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (tingkatBahaya: string) => {
    switch (tingkatBahaya) {
      case "ringan":
        return "badge-success";
      case "sedang":
        return "badge-warning";
      case "berat":
        return "badge-error";
      case "sangat_berat":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  const getStatusText = (tingkatBahaya: string) => {
    switch (tingkatBahaya) {
      case "ringan":
        return "Ringan";
      case "sedang":
        return "Sedang";
      case "berat":
        return "Berat";
      case "sangat_berat":
        return "Sangat Berat";
      default:
        return tingkatBahaya;
    }
  };

  // Gunakan gambar_url dari API jika ada, fallback ke gambar lama
  const imageUrl = jenisPenyakit.gambar_url || 
    (jenisPenyakit.gambar ? `${BASE_URL}${jenisPenyakit.gambar}` : null);

  // Debug log
  if (process.env.NODE_ENV === 'development') {
    console.log("JenisPenyakit Detail:", {
      id: jenisPenyakit.id,
      nm_penyakit: jenisPenyakit.nm_penyakit,
      gambar_url: jenisPenyakit.gambar_url,
      gambar: jenisPenyakit.gambar,
      imageUrl: imageUrl
    });
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      {imageUrl && (
        <figure className="h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={jenisPenyakit.nm_penyakit || "Gambar Penyakit"}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Error loading image:", imageUrl);
              e.currentTarget.style.display = 'none';
            }}
          />
        </figure>
      )}
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <h2 className="card-title text-xl">
            {jenisPenyakit.nm_penyakit || "Tanpa Nama"}
          </h2>
          <div
            className={`badge ${getStatusColor(
              jenisPenyakit.tingkat_bahaya
            )} badge-lg`}
          >
            {getStatusText(jenisPenyakit.tingkat_bahaya)}
          </div>
        </div>

        <div className="space-y-4">
          {/* ID */}
          <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
            <span className="text-sm font-medium">ID Jenis Penyakit</span>
            <span className="text-sm font-mono">
              {jenisPenyakit?.id?.slice(0, 8)}...
            </span>
          </div>

          {/* Deskripsi */}
          {jenisPenyakit.deskripsi && (
            <div className="p-4 bg-base-200 rounded-lg">
              <p className="text-sm text-base-content/70 mb-2">Deskripsi</p>
              <p className="text-base">{jenisPenyakit.deskripsi}</p>
            </div>
          )}

          {/* Gejala Umum */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <HeartIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-base-content/70">Gejala Umum</p>
              <p className="font-semibold capitalize">
                {jenisPenyakit.gejala_umum}
              </p>
            </div>
          </div>

          {/* Pencegahan */}
          {jenisPenyakit.pencegahan && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <CakeIcon className="h-5 w-5 text-secondary" />
            </div>
              <div className="flex-1">
              <p className="text-sm text-base-content/70">Pencegahan</p>
              <p className="font-semibold">{jenisPenyakit.pencegahan}</p>
            </div>
          </div>
          )}

          {/* Pengobatan */}
          {jenisPenyakit.pengobatan && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <ScaleIcon className="h-5 w-5 text-accent" />
            </div>
              <div className="flex-1">
              <p className="text-sm text-base-content/70">Pengobatan</p>
              <p className="font-semibold">{jenisPenyakit.pengobatan}</p>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JenisPenyakitDetailInfo;
