/** @format */

import { JenisPenyakit } from "@/types";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { BASE_URL } from "@/services/baseURL";

interface JenisPenyakitCardProps {
  jenisPenyakit: JenisPenyakit;
  onView?: (jenisPenyakit: JenisPenyakit) => void;
  onEdit?: (jenisPenyakit: JenisPenyakit) => void;
  onDelete?: (jenisPenyakit: JenisPenyakit) => void;
}

const JenisPenyakitCard = ({
  jenisPenyakit,
  onView,
  onEdit,
  onDelete,
}: JenisPenyakitCardProps) => {
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

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      {imageUrl && (
        <figure className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={jenisPenyakit.nm_penyakit}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">
            {jenisPenyakit.nm_penyakit ||
              `Jenis Penyakit ${jenisPenyakit.id.slice(0, 8)}`}
          </h2>
          <div
            className={`badge ${getStatusColor(jenisPenyakit.tingkat_bahaya)}`}
          >
            {getStatusText(jenisPenyakit.tingkat_bahaya)}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="opacity-70">Deskripsi:</span>
            <span className="capitalize">{jenisPenyakit.deskripsi}</span>
          </div>

          <div className="flex justify-between">
            <span className="opacity-70">Gejala Umum:</span>
            <span>{jenisPenyakit.gejala_umum}</span>
          </div>

          <div className="flex justify-between">
            <span className="opacity-70">Pengobatan:</span>
            <span>{jenisPenyakit.pengobatan}</span>
          </div>

          <div className="flex justify-between">
            <span className="opacity-70">Pencegahan:</span>
            <span>{jenisPenyakit.pencegahan}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          {onView && (
            <button
              onClick={() => onView(jenisPenyakit)}
              className="btn btn-sm btn-outline btn-primary"
              title="Lihat Detail"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(jenisPenyakit)}
              className="btn btn-sm btn-outline"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(jenisPenyakit)}
              className="btn btn-sm btn-outline btn-error"
              title="Hapus"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JenisPenyakitCard;
