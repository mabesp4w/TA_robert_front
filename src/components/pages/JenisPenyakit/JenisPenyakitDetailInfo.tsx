/** @format */

"use client";

import { JenisPenyakit } from "@/types";
import { CakeIcon, ScaleIcon, HeartIcon } from "@heroicons/react/24/outline";

interface JenisPenyakitDetailInfoProps {
  jenisPenyakit: JenisPenyakit;
}

const JenisPenyakitDetailInfo = ({
  jenisPenyakit,
}: JenisPenyakitDetailInfoProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sehat":
        return "badge-success";
      case "sakit":
        return "badge-error";
      case "dalam_pengobatan":
        return "badge-warning";
      case "sembuh":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sehat":
        return "Sehat";
      case "sakit":
        return "Sakit";
      case "dalam_pengobatan":
        return "Dalam Pengobatan";
      case "sembuh":
        return "Sembuh";
      default:
        return status;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
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

          {/* Gejala Umum */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <HeartIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Gejala Umum</p>
              <p className="font-semibold capitalize">
                {jenisPenyakit.gejala_umum}
              </p>
            </div>
          </div>

          {/* Pencegahan */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <CakeIcon className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Pencegahan</p>
              <p className="font-semibold">{jenisPenyakit.pencegahan}</p>
            </div>
          </div>

          {/* Pengobatan */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <ScaleIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-base-content/70">Pengobatan</p>
              <p className="font-semibold">{jenisPenyakit.pengobatan}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JenisPenyakitDetailInfo;
