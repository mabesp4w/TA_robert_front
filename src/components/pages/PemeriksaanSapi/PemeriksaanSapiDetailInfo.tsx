/** @format */
// components/pages/PemeriksaanSapi/PemeriksaanSapiDetailInfo.tsx

import { PemeriksaanSapi } from "@/types";
import {
  ThermometerIcon,
  HeartIcon,
  ActivityIcon,
  ClockIcon,
  CalendarIcon,
  FileText,
} from "lucide-react";
import moment from "moment";
import { DiseaseConclusion } from "@/components/Fuzzy/DiseaseConclusion";

interface PemeriksaanSapiDetailInfoProps {
  pemeriksaan: PemeriksaanSapi;
  showDiagnosis?: boolean;
}

const PemeriksaanSapiDetailInfo = ({
  pemeriksaan,
  showDiagnosis = false,
}: PemeriksaanSapiDetailInfoProps) => {
  // Helper function untuk kondisi fisik
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
      6: "Berbau",
    };

    const fesesMappings: { [key: number]: string } = {
      0: "-",
      1: "Normal",
      2: "Lunak",
      3: "Cair",
      4: "Sangat Cair",
      5: "Keras",
      6: "Sangat Keras",
    };

    if (type === "mata") return mataMappings[value] || "-";
    if (type === "hidung") return hidungMappings[value] || "-";
    if (type === "feses") return fesesMappings[value] || "-";
    return "-";
  };

  // Calculate health score
  const parameterNormal = [
    !isNaN(pemeriksaan.suhu_tubuh) &&
      pemeriksaan.suhu_tubuh >= 38.0 &&
      pemeriksaan.suhu_tubuh <= 39.5,
    !isNaN(pemeriksaan.frekuensi_napas) &&
      pemeriksaan.frekuensi_napas >= 20 &&
      pemeriksaan.frekuensi_napas <= 30,
    !isNaN(pemeriksaan.denyut_jantung) &&
      pemeriksaan.denyut_jantung >= 60 &&
      pemeriksaan.denyut_jantung <= 80,
    !isNaN(pemeriksaan.nafsu_makan) && pemeriksaan.nafsu_makan >= 7,
    !isNaN(pemeriksaan.aktivitas) && pemeriksaan.aktivitas >= 7,
  ].filter(Boolean).length;

  const healthScore = Math.round((parameterNormal / 5) * 100);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "badge-success";
    if (score >= 60) return "badge-warning";
    return "badge-error";
  };

  const gejalaList = [
    pemeriksaan.batuk && "Batuk",
    pemeriksaan.sesak_napas && "Sesak Napas",
    pemeriksaan.diare && "Diare",
    pemeriksaan.muntah && "Muntah",
    pemeriksaan.lemas && "Lemas",
    pemeriksaan.demam && "Demam",
  ].filter(Boolean);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="card-title text-2xl">
              {pemeriksaan.sapi_detail?.nm_sapi ||
                `Sapi ${pemeriksaan.sapi.slice(0, 8)}`}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-base-content/70 mt-1">
              <ClockIcon className="h-4 w-4" />
              <span>
                {moment(pemeriksaan.tgl_pemeriksaan).format(
                  "DD MMMM YYYY HH:mm"
                )}
              </span>
            </div>
          </div>
          <div className={`badge badge-lg ${getHealthScoreColor(healthScore)}`}>
            Skor Kesehatan: {healthScore}%
          </div>
        </div>

        {/* Sapi Info */}
        {pemeriksaan.sapi_detail && (
          <div className="alert alert-info mb-4">
            <div>
              <p className="font-semibold">Informasi Sapi</p>
              <p className="text-sm">
                {pemeriksaan.sapi_detail.jenkel} •{" "}
                {pemeriksaan.sapi_detail.umur_bulan} bulan •{" "}
                {pemeriksaan.sapi_detail.berat_kg} kg
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Vital Parameters */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Parameter Vital</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
                  <ThermometerIcon className="h-5 w-5 text-error" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Suhu Tubuh</p>
                  <p className="font-semibold text-lg">
                    {pemeriksaan.suhu_tubuh}°C
                  </p>
                  {pemeriksaan.suhu_tubuh < 38.0 ||
                  pemeriksaan.suhu_tubuh > 39.5 ? (
                    <span className="badge badge-error badge-sm mt-1">
                      Abnormal
                    </span>
                  ) : (
                    <span className="badge badge-success badge-sm mt-1">
                      Normal
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ActivityIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    Frekuensi Napas
                  </p>
                  <p className="font-semibold text-lg">
                    {pemeriksaan.frekuensi_napas} /menit
                  </p>
                  {pemeriksaan.frekuensi_napas < 20 ||
                  pemeriksaan.frekuensi_napas > 30 ? (
                    <span className="badge badge-error badge-sm mt-1">
                      Abnormal
                    </span>
                  ) : (
                    <span className="badge badge-success badge-sm mt-1">
                      Normal
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <HeartIcon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Denyut Jantung</p>
                  <p className="font-semibold text-lg">
                    {pemeriksaan.denyut_jantung} BPM
                  </p>
                  {pemeriksaan.denyut_jantung < 60 ||
                  pemeriksaan.denyut_jantung > 80 ? (
                    <span className="badge badge-error badge-sm mt-1">
                      Abnormal
                    </span>
                  ) : (
                    <span className="badge badge-success badge-sm mt-1">
                      Normal
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🍽️</span>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Nafsu Makan</p>
                  <p className="font-semibold text-lg">
                    {pemeriksaan.nafsu_makan}/10
                  </p>
                  {pemeriksaan.nafsu_makan < 7 ? (
                    <span className="badge badge-error badge-sm mt-1">
                      Buruk
                    </span>
                  ) : (
                    <span className="badge badge-success badge-sm mt-1">
                      Baik
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <ActivityIcon className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Aktivitas</p>
                  <p className="font-semibold text-lg">
                    {pemeriksaan.aktivitas}/10
                  </p>
                  {pemeriksaan.aktivitas < 7 ? (
                    <span className="badge badge-error badge-sm mt-1">
                      Rendah
                    </span>
                  ) : (
                    <span className="badge badge-success badge-sm mt-1">
                      Normal
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gejala Klinis */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Gejala Klinis</h3>
            {gejalaList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {gejalaList.map((gejala, index) => (
                  <span key={index} className="badge badge-error badge-lg">
                    {gejala}
                  </span>
                ))}
              </div>
            ) : (
              <div className="alert alert-success">
                <span>Tidak ada gejala klinis yang terdeteksi</span>
              </div>
            )}
          </div>

          {/* Kondisi Fisik */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kondisi Fisik</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👁️</span>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Kondisi Mata</p>
                  <p className="font-semibold">
                    {getKondisiFisikLabel(pemeriksaan.kondisi_mata, "mata")}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👃</span>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Kondisi Hidung</p>
                  <p className="font-semibold">
                    {getKondisiFisikLabel(
                      pemeriksaan.kondisi_hidung,
                      "hidung"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💩</span>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    Konsistensi Feses
                  </p>
                  <p className="font-semibold">
                    {getKondisiFisikLabel(
                      pemeriksaan.konsistensi_feses,
                      "feses"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Pemeriksaan */}
          {pemeriksaan.catatan_pemeriksaan && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Catatan Pemeriksaan</h3>
              <div className="bg-base-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-warning mt-1" />
                  <p className="text-sm whitespace-pre-wrap">
                    {pemeriksaan.catatan_pemeriksaan}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="divider"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-base-content/60">
            {pemeriksaan.created_at && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  Dibuat: {moment(pemeriksaan.created_at).format("DD MMMM YYYY HH:mm")}
                </span>
              </div>
            )}
            {pemeriksaan.updated_at && (
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4" />
                <span>
                  Diperbarui: {moment(pemeriksaan.updated_at).format("DD MMMM YYYY HH:mm")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kesimpulan Diagnosis */}
      {showDiagnosis && (
        <div className="mt-6">
          <DiseaseConclusion />
        </div>
      )}
    </div>
  );
};

export default PemeriksaanSapiDetailInfo;

