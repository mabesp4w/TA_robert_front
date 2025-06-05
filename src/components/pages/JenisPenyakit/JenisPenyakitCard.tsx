/** @format */

import { JenisPenyakit } from "@/types";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";

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
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
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
