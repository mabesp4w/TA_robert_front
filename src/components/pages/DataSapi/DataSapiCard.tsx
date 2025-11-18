/** @format */
// components/pages/DataSapi/DataSapiCard.tsx

import { DataSapi } from "@/types";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import moment from "moment";

interface DataSapiCardProps {
  sapi: DataSapi;
  onView?: (sapi: DataSapi) => void;
  onEdit?: (sapi: DataSapi) => void;
  onDelete?: (sapi: DataSapi) => void;
}

const DataSapiCard = ({
  sapi,
  onView,
  onEdit,
  onDelete,
}: DataSapiCardProps) => {
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

  const getJenkelText = (jenkel: string) => {
    return jenkel === "jantan" ? "Jantan" : "Betina";
  };

  const getJenkelIcon = (jenkel: string) => {
    return jenkel === "jantan" ? "♂" : "♀";
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title">
              {sapi.nm_sapi || `Sapi ${sapi.id.slice(0, 8)}`}
              <span className="text-lg ml-1">{getJenkelIcon(sapi.jenkel)}</span>
            </h2>
            {sapi.no_sapi && (
              <p className="text-xs text-base-content/60 font-mono mt-1">
                No: {sapi.no_sapi}
              </p>
            )}
          </div>
          <div className={`badge ${getStatusColor(sapi.status_kesehatan)}`}>
            {getStatusText(sapi.status_kesehatan)}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          {sapi.pemilik_detail && (
            <div className="flex justify-between">
              <span className="opacity-70">Pemilik:</span>
              <span className="text-right max-w-[60%] truncate" title={sapi.pemilik_detail.nm_pemilik}>
                {sapi.pemilik_detail.nm_pemilik}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="opacity-70">Jenis Kelamin:</span>
            <span className="capitalize">{getJenkelText(sapi.jenkel)}</span>
          </div>

          {sapi.umur_display ? (
            <div className="flex justify-between">
              <span className="opacity-70">Umur:</span>
              <span>{sapi.umur_display}</span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span className="opacity-70">Umur:</span>
              <span>{sapi.umur_bulan} bulan</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="opacity-70">Berat:</span>
            <span>{sapi.berat_kg} kg</span>
          </div>

          {sapi.tgl_registrasi && (
            <div className="flex justify-between">
              <span className="opacity-70">Registrasi:</span>
              <span>{moment(sapi.tgl_registrasi).format("DD/MM/YYYY")}</span>
            </div>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          {onView && (
            <button
              onClick={() => onView(sapi)}
              className="btn btn-sm btn-outline btn-primary"
              title="Lihat Detail"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(sapi)}
              className="btn btn-sm btn-outline"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(sapi)}
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

export default DataSapiCard;
