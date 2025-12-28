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
  Download,
} from "lucide-react";
import moment from "moment";

interface PemeriksaanSapiCardProps {
  pemeriksaan: PemeriksaanSapi;
  onView?: (pemeriksaan: PemeriksaanSapi) => void;
  onEdit?: (pemeriksaan: PemeriksaanSapi) => void;
  onDelete?: (pemeriksaan: PemeriksaanSapi) => void;
  onExport?: () => void;
  isExporting?: boolean;
}

const PemeriksaanSapiCard = ({
  pemeriksaan,
  onView,
  onEdit,
  onDelete,
  onExport,
  isExporting = false,
}: PemeriksaanSapiCardProps) => {
  // Helper function untuk kondisi fisik (number values)
  const getKondisiFisikLabel = (value: number, type: string): string => {
    if (value === undefined || value === null || typeof value !== "number")
      return "-";

    const mataMappings: { [key: number]: string } = {
      0: "-",
      1: "Normal",
      2: "Berair",
      3: "Merah/Iritasi",
      4: "Bengkak",
      5: "Ada Kotoran",
      6: "Keruh",
    };

    const hidungMappings: { [key: number]: string } = {
      0: "-",
      1: "Normal",
      2: "Kering",
      3: "Berlendir Bening",
      4: "Berlendir Kental",
      5: "Bernanah",
      6: "Berdarah",
      7: "Ada Kerak",
    };

    const fesesMappings: { [key: number]: string } = {
      0: "-",
      1: "Normal",
      2: "Lunak",
      3: "Encer",
      4: "Berlendir",
      5: "Berdarah",
      6: "Keras",
      7: "Berbusa",
    };

    if (type === "mata") return mataMappings[value] || "-";
    if (type === "hidung") return hidungMappings[value] || "-";
    if (type === "feses") return fesesMappings[value] || "-";
    return "-";
  };

  const getKondisiFisikColor = (kondisi: number, type: string): string => {
    if (kondisi === 1) return "badge-success"; // Normal

    // Kondisi Mata: 2,3=warning | 4,5,6=error
    if (type === "mata") {
      if ([2, 3].includes(kondisi)) return "badge-warning";
      if ([4, 5, 6].includes(kondisi)) return "badge-error";
    }

    // Kondisi Hidung: 2,3=warning | 4,5,6,7=error
    if (type === "hidung") {
      if ([2, 3].includes(kondisi)) return "badge-warning";
      if ([4, 5, 6, 7].includes(kondisi)) return "badge-error";
    }

    // Konsistensi Feses: 2=warning | 3,4,5,6,7=error
    if (type === "feses") {
      if ([2].includes(kondisi)) return "badge-warning";
      if ([3, 4, 5, 6, 7].includes(kondisi)) return "badge-error";
    }

    return "badge-ghost";
  };

  // Health assessment functions
  const getSuhuStatus = (suhu: number) => {
    if (isNaN(suhu)) return { status: "unknown", color: "badge-ghost" };
    if (suhu >= 38.0 && suhu <= 39.5)
      return { status: "normal", color: "badge-success" };
    return { status: "abnormal", color: "badge-error" };
  };

  const getNafsuMakanStatus = (nilai: number) => {
    if (isNaN(nilai)) return { status: "unknown", color: "badge-ghost" };
    if (nilai >= 8) return { status: "tinggi", color: "badge-success" };
    if (nilai >= 5) return { status: "sedang", color: "badge-warning" };
    return { status: "rendah", color: "badge-error" };
  };

  const getAktivitasStatus = (nilai: number) => {
    if (isNaN(nilai)) return { status: "unknown", color: "badge-ghost" };
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
    !isNaN(pemeriksaan.frekuensi_napas) &&
      pemeriksaan.frekuensi_napas >= 12 &&
      pemeriksaan.frekuensi_napas <= 36,
    !isNaN(pemeriksaan.denyut_jantung) &&
      pemeriksaan.denyut_jantung >= 60 &&
      pemeriksaan.denyut_jantung <= 84,
    !isNaN(pemeriksaan.nafsu_makan) && pemeriksaan.nafsu_makan >= 7,
    !isNaN(pemeriksaan.aktivitas) && pemeriksaan.aktivitas >= 7,
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
              <span className="font-semibold">
                {isNaN(pemeriksaan.suhu_tubuh) ? "0" : pemeriksaan.suhu_tubuh}°C
              </span>
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
                {isNaN(pemeriksaan.denyut_jantung)
                  ? "0"
                  : pemeriksaan.denyut_jantung}{" "}
                BPM
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-base-200 rounded text-xs">
              <div className="flex items-center space-x-1">
                <ActivityIcon className="h-3 w-3 text-info" />
                <span>Napas</span>
              </div>
              <span className="font-semibold">
                {isNaN(pemeriksaan.frekuensi_napas)
                  ? "0"
                  : pemeriksaan.frekuensi_napas}
                /min
              </span>
            </div>
          </div>

          {/* Behavioral Parameters */}
          <div className="grid grid-cols-2 gap-2">
            <div className="stat bg-base-200 rounded p-2">
              <div className="stat-title text-xs">Nafsu Makan</div>
              <div className="stat-value text-sm">
                {isNaN(pemeriksaan.nafsu_makan) ? "0" : pemeriksaan.nafsu_makan}
                /10
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
                {isNaN(pemeriksaan.aktivitas) ? "0" : pemeriksaan.aktivitas}/10
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

          {/* Physical Condition */}
          {(pemeriksaan.kondisi_mata ||
            pemeriksaan.kondisi_hidung ||
            pemeriksaan.konsistensi_feses) && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Kondisi Fisik:</span>
              <div className="grid grid-cols-1 gap-2">
                {pemeriksaan.kondisi_mata &&
                  typeof pemeriksaan.kondisi_mata === "number" &&
                  pemeriksaan.kondisi_mata > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-70">👁️ Mata:</span>
                      <span
                        className={`badge badge-xs ${getKondisiFisikColor(
                          pemeriksaan.kondisi_mata,
                          "mata"
                        )}`}
                      >
                        {getKondisiFisikLabel(pemeriksaan.kondisi_mata, "mata")}
                      </span>
                    </div>
                  )}
                {pemeriksaan.kondisi_hidung &&
                  typeof pemeriksaan.kondisi_hidung === "number" &&
                  pemeriksaan.kondisi_hidung > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-70">👃 Hidung:</span>
                      <span
                        className={`badge badge-xs ${getKondisiFisikColor(
                          pemeriksaan.kondisi_hidung,
                          "hidung"
                        )}`}
                      >
                        {getKondisiFisikLabel(
                          pemeriksaan.kondisi_hidung,
                          "hidung"
                        )}
                      </span>
                    </div>
                  )}
                {pemeriksaan.konsistensi_feses &&
                  typeof pemeriksaan.konsistensi_feses === "number" &&
                  pemeriksaan.konsistensi_feses > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-70">💩 Feses:</span>
                      <span
                        className={`badge badge-xs ${getKondisiFisikColor(
                          pemeriksaan.konsistensi_feses,
                          "feses"
                        )}`}
                      >
                        {getKondisiFisikLabel(
                          pemeriksaan.konsistensi_feses,
                          "feses"
                        )}
                      </span>
                    </div>
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
          {onExport && (
            <button
              onClick={onExport}
              disabled={isExporting}
              className="btn btn-sm btn-outline btn-success"
              title="Unduh PDF"
            >
              {isExporting ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          )}

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
