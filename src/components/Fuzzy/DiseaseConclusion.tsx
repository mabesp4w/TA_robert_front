/** @format */

// components/Fuzzy/DiseaseConclusion.tsx
"use client";

import React from "react";
import { useFuzzyCalculationStore } from "@/stores/api/fuzzyCalculationStore";

// Interface for disease data from backend
interface DiseaseData {
  disease_id: string;
  nm_penyakit?: string;
  deskripsi?: string;
  tingkat_bahaya?: string;
  gejala_umum?: string;
  pengobatan?: string;
  pencegahan?: string;
  gambar_url?: string | null;
  total_score: number;
  rules_count: number;
  max_activation: number;
  avg_activation: number;
  severity: string;
}

export const DiseaseConclusion: React.FC = () => {
  const completeFlowData = useFuzzyCalculationStore(
    (state) => state.completeFlowData
  );

  if (!completeFlowData) {
    return null;
  }

  const diseasesScores = completeFlowData.step_2_inference?.results?.diseases_scores;
  
  if (!diseasesScores || Object.keys(diseasesScores).length === 0) {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl">Kesimpulan Diagnosis</h2>
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Tidak ada penyakit yang terdeteksi. Sapi dalam kondisi sehat.</span>
          </div>
        </div>
      </div>
    );
  }

  const topDiseases = Object.entries(diseasesScores)
    .sort(([, a], [, b]) => b.total_score - a.total_score)
    .slice(0, 3);

  // Get severity badge color
  const getSeverityBadge = (tingkatBahaya: string) => {
    switch (tingkatBahaya) {
      case "ringan":
        return "badge-success";
      case "sedang":
        return "badge-warning";
      case "berat":
        return "badge-error";
      case "sangat_berat":
        return "badge-error badge-lg";
      default:
        return "badge-neutral";
    }
  };

  // Get severity label
  const getSeverityLabel = (tingkatBahaya: string) => {
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

  const primaryDisease = topDiseases[0];
  const primaryDiseaseData = primaryDisease[1] as DiseaseData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-base-content mb-2">
          Kesimpulan Diagnosis
        </h2>
        <p className="text-base-content/70">
          Berdasarkan analisis fuzzy logic, berikut adalah penyakit yang terdeteksi
        </p>
      </div>

      {/* Primary Disease - Most Likely */}
      {primaryDiseaseData && (
        <div className="card bg-base-100 shadow-xl border-2 border-primary">
          {/* Disease Image */}
          {primaryDiseaseData.gambar_url && (
            <figure className="h-64 overflow-hidden">
              <img
                src={primaryDiseaseData.gambar_url}
                alt={primaryDiseaseData.nm_penyakit || "Gambar Penyakit"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading disease image:", primaryDiseaseData.gambar_url);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </figure>
          )}
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="card-title text-2xl text-primary mb-2">
                  {primaryDiseaseData.nm_penyakit || primaryDisease[0]}
                </h3>
                <div className="flex gap-2 items-center flex-wrap">
                  <div className={`badge ${getSeverityBadge(primaryDiseaseData.tingkat_bahaya || primaryDiseaseData.severity)}`}>
                    {getSeverityLabel(primaryDiseaseData.tingkat_bahaya || primaryDiseaseData.severity)}
                  </div>
                  <div className="badge badge-outline">
                    Skor: {primaryDiseaseData.total_score.toFixed(3)}
                  </div>
                  <div className="badge badge-outline">
                    {primaryDiseaseData.rules_count} Aturan Teraktivasi
                  </div>
                </div>
              </div>
            </div>

            {/* Disease Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Deskripsi */}
              {primaryDiseaseData.deskripsi && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">Deskripsi</h4>
                  <p className="text-base-content/80 leading-relaxed">
                    {primaryDiseaseData.deskripsi}
                  </p>
                </div>
              )}

              {/* Gejala Umum */}
              {primaryDiseaseData.gejala_umum && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">Gejala Umum</h4>
                  <p className="text-base-content/80 leading-relaxed">
                    {primaryDiseaseData.gejala_umum}
                  </p>
                </div>
              )}

              {/* Pengobatan */}
              {primaryDiseaseData.pengobatan && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">Pengobatan</h4>
                  <p className="text-base-content/80 leading-relaxed whitespace-pre-line">
                    {primaryDiseaseData.pengobatan}
                  </p>
                </div>
              )}

              {/* Pencegahan */}
              {primaryDiseaseData.pencegahan && (
                <div>
                  <h4 className="font-semibold text-lg mb-2">Pencegahan</h4>
                  <p className="text-base-content/80 leading-relaxed whitespace-pre-line">
                    {primaryDiseaseData.pencegahan}
                  </p>
                </div>
              )}
            </div>

            {/* Diagnosis Statistics */}
            <div className="divider">Statistik Diagnosis</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Total Skor</div>
                <div className="stat-value text-2xl">
                  {primaryDiseaseData.total_score.toFixed(3)}
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Rata-rata Aktivasi</div>
                <div className="stat-value text-2xl">
                  {(primaryDiseaseData.avg_activation * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Maks Aktivasi</div>
                <div className="stat-value text-2xl">
                  {(primaryDiseaseData.max_activation * 100).toFixed(1)}%
                </div>
              </div>
              <div className="stat bg-base-200 rounded-lg">
                <div className="stat-title">Aturan Teraktivasi</div>
                <div className="stat-value text-2xl">
                  {primaryDiseaseData.rules_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Possible Diseases */}
      {topDiseases.length > 1 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">
              Penyakit Lain yang Mungkin
            </h3>
            <div className="space-y-4">
              {topDiseases.slice(1).map(([diseaseName, diseaseScore], index) => {
                const diseaseData = diseaseScore as DiseaseData;
                return (
                  <div
                    key={diseaseName}
                    className="card bg-base-200 shadow-md"
                  >
                    {/* Disease Image */}
                    {diseaseData.gambar_url && (
                      <figure className="h-48 overflow-hidden">
                        <img
                          src={diseaseData.gambar_url}
                          alt={diseaseData.nm_penyakit || "Gambar Penyakit"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Error loading disease image:", diseaseData.gambar_url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </figure>
                    )}
                    <div className="card-body">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">
                            {index + 2}. {diseaseData.nm_penyakit || diseaseName}
                          </h4>
                          <div className="flex gap-2 mb-2 flex-wrap">
                            <div
                              className={`badge ${getSeverityBadge(diseaseData.tingkat_bahaya || diseaseData.severity)}`}
                            >
                              {getSeverityLabel(diseaseData.tingkat_bahaya || diseaseData.severity)}
                            </div>
                            <div className="badge badge-outline">
                              Skor: {diseaseData.total_score.toFixed(3)}
                            </div>
                          </div>
                          {diseaseData.deskripsi && (
                            <p className="text-sm text-base-content/70 mb-2">
                              {diseaseData.deskripsi}
                            </p>
                          )}
                          {diseaseData.gejala_umum && (
                            <div className="text-sm">
                              <span className="font-medium">Gejala: </span>
                              <span className="text-base-content/70">
                                {diseaseData.gejala_umum}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="stat p-0">
                            <div className="stat-value text-lg">
                              {(diseaseData.avg_activation * 100).toFixed(1)}%
                            </div>
                            <div className="stat-title text-xs">
                              Aktivasi Rata-rata
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

