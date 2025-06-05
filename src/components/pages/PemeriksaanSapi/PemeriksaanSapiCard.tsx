/** @format */
// components/pages/PemeriksaanSapi/PemeriksaanSapiCard.tsx

import { PemeriksaanSapi } from "@/types";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  ThermometerIcon,
  ActivityIcon,
  ClockIcon,
} from "lucide-react";
import moment from "moment";

interface PemeriksaanSapiCardProps {
  pemeriksaan: PemeriksaanSapi;
  onView?: (pemeriksaan: PemeriksaanSapi) => void;
  onEdit?: (pemeriksaan: PemeriksaanSapi) => void;
  onDelete?: (pemeriksaan: PemeriksaanSapi) => void;
}

const PemeriksaanSapiCard = ({
  pemeriksaan,
  onView,
  onEdit,
  onDelete,
}: PemeriksaanSapiCardProps) => {
  // Health assessment functions
  const getSuhuStatus = (suhu: number) => {
    if (suhu >= 38.0 && suhu <= 39.5)
      return { status: "normal", color: "badge-success" };
    return { status: "abnormal", color: "badge-error" };
  };

  const getNafsuMakanStatus = (nilai: number) => {
    if (nilai >= 8) return { status: "tinggi", color: "badge-success" };
    if (nilai >= 5) return { status: "sedang", color: "badge-warning" };
    return { status: "rendah", color: "badge-error" };
  };

  const getAktivitasStatus = (nilai: number) => {
    if (nilai >= 8) return { status: "tinggi", color: "badge-success" };
    if (nilai >= 5) return { status: "sedang", color: "badge-warning" };
    return { status: "rendah", color: "badge-error" };
  };

  const suhuStatus = getSuhuStatus(pemeriksaan.suhu_tubuh);
  const nafsuMakanStatus = getNafsuMakanStatus(pemeriksaan.nafsu_makan);
  const aktivitasStatus = getAktivitasStatus(pemeriksaan.aktivitas);

  // Count active symptoms
  const activeSymptoms = [
    pemeriksaan.batuk && "Batuk",
    pemeriksaan.sesak_napas && "Sesak Napas",
    pemeriksaan.diare && "Diare",
    pemeriksaan.muntah && "Muntah",
    pemeriksaan.lemas && "Lemas",
    pemeriksaan.demam && "Demam",
  ].filter(Boolean);

  // Overall health score calculation
  const parameterNormal = [
    suhuStatus.status === "normal",
    pemeriksaan.frekuensi_napas >= 12 && pemeriksaan.frekuensi_napas <= 36,
    pemeriksaan.denyut_jantung >= 60 && pemeriksaan.denyut_jantung <= 84,
    pemeriksaan.nafsu_makan >= 7,
    pemeriksaan.aktivitas >= 7,
  ].filter(Boolean).length;

  const healthScore = Math.round((parameterNormal / 5) * 100);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return "Baik";
    if (score >= 60) return "Perlu Perhatian";
    return "Buruk";
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border-l-4 border-l-primary">
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title text-lg">
              {pemeriksaan.sapi_detail?.nm_sapi ||
                `Sapi ${pemeriksaan.sapi.slice(0, 8)}`}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-base-content/70">
              <ClockIcon className="h-4 w-4" />
              <span>
                {moment(pemeriksaan.tgl_pemeriksaan).format("DD/MM/YYYY HH:mm")}
              </span>
            </div>
          </div>
          <div
            className={`badge badge-lg ${getHealthScoreColor(
              healthScore
            ).replace("text-", "badge-")}`}
          >
            {healthScore}%
          </div>
        </div>

        {/* Sapi Info */}
        {pemeriksaan.sapi_detail && (
          <div className="text-xs text-base-content/60 mb-3">
            {pemeriksaan.sapi_detail.jenkel} •{" "}
            {pemeriksaan.sapi_detail.umur_bulan} bulan •{" "}
            {pemeriksaan.sapi_detail.berat_kg} kg
          </div>
        )}

        {/* Vital Parameters */}
        <div className="space-y-3">
          {/* Temperature */}
          <div className="flex items-center justify-between p-2 bg-base-200 rounded">
            <div className="flex items-center space-x-2">
              <ThermometerIcon className="h-4 w-4 text-error" />
              <span className="text-sm">Suhu Tubuh</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{pemeriksaan.suhu_tubuh}°C</span>
              <span className={`badge badge-xs ${suhuStatus.color}`}>
                {suhuStatus.status}
              </span>
            </div>
          </div>

          {/* Heart & Breathing */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 bg-base-200 rounded text-xs">
              <div className="flex items-center space-x-1">
                <HeartIcon className="h-3 w-3 text-error" />
                <span>Jantung</span>
              </div>
              <span className="font-semibold">
                {pemeriksaan.denyut_jantung} BPM
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-base-200 rounded text-xs">
              <div className="flex items-center space-x-1">
                <ActivityIcon className="h-3 w-3 text-info" />
                <span>Napas</span>
              </div>
              <span className="font-semibold">
                {pemeriksaan.frekuensi_napas}/min
              </span>
            </div>
          </div>

          {/* Behavioral Parameters */}
          <div className="grid grid-cols-2 gap-2">
            <div className="stat bg-base-200 rounded p-2">
              <div className="stat-title text-xs">Nafsu Makan</div>
              <div className="stat-value text-sm">
                {pemeriksaan.nafsu_makan}/10
              </div>
              <div
                className={`stat-desc ${nafsuMakanStatus.color.replace(
                  "badge-",
                  "text-"
                )}`}
              >
                {nafsuMakanStatus.status}
              </div>
            </div>
            <div className="stat bg-base-200 rounded p-2">
              <div className="stat-title text-xs">Aktivitas</div>
              <div className="stat-value text-sm">
                {pemeriksaan.aktivitas}/10
              </div>
              <div
                className={`stat-desc ${aktivitasStatus.color.replace(
                  "badge-",
                  "text-"
                )}`}
              >
                {aktivitasStatus.status}
              </div>
            </div>
          </div>

          {/* Health Status */}
          <div className="flex items-center justify-between p-2 bg-base-200 rounded">
            <span className="text-sm font-medium">Status Kesehatan:</span>
            <span
              className={`font-semibold ${getHealthScoreColor(healthScore)}`}
            >
              {getHealthStatus(healthScore)}
            </span>
          </div>

          {/* Symptoms */}
          {activeSymptoms.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium">
                Gejala Aktif ({activeSymptoms.length}):
              </span>
              <div className="flex flex-wrap gap-1">
                {pemeriksaan.batuk && (
                  <span className="badge badge-error badge-xs">Batuk</span>
                )}
                {pemeriksaan.sesak_napas && (
                  <span className="badge badge-warning badge-xs">
                    Sesak Napas
                  </span>
                )}
                {pemeriksaan.diare && (
                  <span className="badge badge-info badge-xs">Diare</span>
                )}
                {pemeriksaan.muntah && (
                  <span className="badge badge-success badge-xs">Muntah</span>
                )}
                {pemeriksaan.lemas && (
                  <span className="badge badge-secondary badge-xs">Lemas</span>
                )}
                {pemeriksaan.demam && (
                  <span className="badge badge-accent badge-xs">Demam</span>
                )}
              </div>
            </div>
          )}

          {/* Notes Preview */}
          {pemeriksaan.catatan_pemeriksaan && (
            <div className="mt-2">
              <span className="text-xs opacity-70 block">Catatan:</span>
              <span className="text-xs bg-base-200 p-2 rounded block mt-1 line-clamp-2">
                {pemeriksaan.catatan_pemeriksaan}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          {onView && (
            <button
              onClick={() => onView(pemeriksaan)}
              className="btn btn-sm btn-outline btn-primary"
              title="Lihat Detail & Analisis"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(pemeriksaan)}
              className="btn btn-sm btn-outline"
              title="Edit Pemeriksaan"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(pemeriksaan)}
              className="btn btn-sm btn-outline btn-error"
              title="Hapus Pemeriksaan"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-xs text-base-content/50 mt-2">
          Parameter Normal: {parameterNormal}/5 •
          {activeSymptoms.length === 0
            ? " Tidak ada gejala"
            : ` ${activeSymptoms.length} gejala aktif`}
        </div>
      </div>
    </div>
  );
};

export default PemeriksaanSapiCard;
