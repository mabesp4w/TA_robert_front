/** @format */
// components/pages/Pemilik/PemilikCard.tsx

import { Pemilik } from "@/types";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  Expand,
  PhoneIcon,
  BuildingIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import moment from "moment";

interface PemilikCardProps {
  pemilik: Pemilik;
  onView?: (pemilik: Pemilik) => void;
  onEdit?: (pemilik: Pemilik) => void;
  onDelete?: (pemilik: Pemilik) => void;
  onToggleStatus?: (pemilik: Pemilik) => void;
}

const PemilikCard = ({
  pemilik,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: PemilikCardProps) => {
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

  const getKapasitasColor = (persentase: number) => {
    if (persentase >= 90) return "text-error";
    if (persentase >= 80) return "text-warning";
    if (persentase >= 60) return "text-info";
    return "text-success";
  };

  const persentaseKapasitas =
    pemilik.persentase_kapasitas ||
    ((pemilik.total_sapi || 0) / pemilik.max_sapi) * 100;

  return (
    <div
      className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow ${
        !pemilik.status_aktif ? "opacity-75" : ""
      }`}
    >
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <h2 className="card-title">{pemilik.nm_pemilik || "Tanpa Nama"}</h2>
            {pemilik.status_aktif ? (
              <CheckCircleIcon className="h-5 w-5 text-success" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-error" />
            )}
          </div>
          <div
            className={`badge ${getJenisPemilikColor(pemilik.jenis_pemilik)}`}
          >
            {getJenisPemilikText(pemilik.jenis_pemilik)}
          </div>
        </div>

        {/* Kode Pemilik */}
        <div className="flex items-center space-x-2 text-sm">
          <UserIcon className="h-4 w-4 opacity-70" />
          <span className="font-mono">{pemilik.id?.slice(0, 8)}...</span>
        </div>

        <div className="space-y-2 text-sm">
          {/* Email */}
          <div className="flex items-center space-x-2">
            <Expand className="h-4 w-4 opacity-70" />
            <span className="truncate">{pemilik.email}</span>
          </div>

          {/* No HP */}
          <div className="flex items-center space-x-2">
            <PhoneIcon className="h-4 w-4 opacity-70" />
            <span>{pemilik.no_hp}</span>
          </div>

          {/* Alamat */}
          <div className="flex items-start space-x-2">
            <BuildingIcon className="h-4 w-4 opacity-70 mt-0.5" />
            <span className="text-xs leading-tight line-clamp-2">
              {pemilik.alamat}
            </span>
          </div>

          {/* Kapasitas Sapi */}
          <div className="flex justify-between items-center p-2 bg-base-200 rounded">
            <span className="text-xs">Kapasitas Sapi:</span>
            <div className="text-right">
              <span className="font-semibold">
                {pemilik.total_sapi || 0}/{pemilik.max_sapi}
              </span>
              <span
                className={`text-xs ml-1 ${getKapasitasColor(
                  persentaseKapasitas
                )}`}
              >
                ({persentaseKapasitas.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Progress Bar Kapasitas */}
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
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

          {/* Status Sapi */}
          {(pemilik.sapi_sehat !== undefined ||
            pemilik.sapi_sakit !== undefined) && (
            <div className="flex justify-between text-xs">
              <span className="text-success">
                ✓ Sehat: {pemilik.sapi_sehat || 0}
              </span>
              <span className="text-error">
                ✗ Sakit: {pemilik.sapi_sakit || 0}
              </span>
            </div>
          )}

          {/* Tanggal Registrasi */}
          <div className="text-xs opacity-70">
            Registrasi: {moment(pemilik.tgl_registrasi).format("DD/MM/YYYY")}
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          {onView && (
            <button
              onClick={() => onView(pemilik)}
              className="btn btn-sm btn-outline btn-primary"
              title="Lihat Detail"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(pemilik)}
              className="btn btn-sm btn-outline"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}

          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(pemilik)}
              className={`btn btn-sm btn-outline ${
                pemilik.status_aktif ? "btn-warning" : "btn-success"
              }`}
              title={pemilik.status_aktif ? "Nonaktifkan" : "Aktifkan"}
            >
              {pemilik.status_aktif ? (
                <XCircleIcon className="h-4 w-4" />
              ) : (
                <CheckCircleIcon className="h-4 w-4" />
              )}
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(pemilik)}
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

export default PemilikCard;
