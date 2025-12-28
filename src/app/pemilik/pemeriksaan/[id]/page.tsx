/** @format */
"use client";

import React, { useEffect, useState } from "react";
import { usePemeriksaanSapiStore } from "@/stores/crud/pemeriksaanSapiStore";
import { useFuzzyCalculationStore } from "@/stores/api/fuzzyCalculationStore";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import PemeriksaanSapiDetailInfo from "@/components/pages/PemeriksaanSapi/PemeriksaanSapiDetailInfo";
import { FuzzificationStep } from "@/components/Fuzzy/FuzzificationStep";
import { InferenceStep } from "@/components/Fuzzy/InferenceStep";
import { DefuzzificationStep } from "@/components/Fuzzy/DefuzzificationStep";
import { DiseaseConclusion } from "@/components/Fuzzy/DiseaseConclusion";
import { pemeriksaanSapiCRUD } from "@/services/crudService";
import toast from "react-hot-toast";

export default function PemeriksaanPemilikDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { currentPemeriksaanSapi, fetchPemeriksaanSapiById, loading } =
    usePemeriksaanSapiStore();
  const {
    completeFlowData,
    error,
    currentStep,
    setCurrentStep,
    calculateCompleteFlow,
    resetCalculation,
    setPemeriksaanId,
    loading: loadingFuzzy,
  } = useFuzzyCalculationStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"detail" | "fuzzy">("detail");
  const [fuzzyCalculated, setFuzzyCalculated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchPemeriksaanSapiById(params.id);
    }
  }, [params.id, fetchPemeriksaanSapiById]);

  // Calculate fuzzy when detail tab is opened or when switching to fuzzy tab
  useEffect(() => {
    if (!fuzzyCalculated && currentPemeriksaanSapi) {
      const handleCalculate = async () => {
        try {
          setPemeriksaanId(params.id);
          await calculateCompleteFlow();
          setFuzzyCalculated(true);
          if (activeTab === "fuzzy") {
            toast.success("Fuzzy calculation completed successfully!");
          }
        } catch (error) {
          console.log({ error });
          if (activeTab === "fuzzy") {
            toast.error("Calculation failed. Please check your inputs.");
          }
        }
      };

      handleCalculate();
    }
  }, [
    fuzzyCalculated,
    currentPemeriksaanSapi,
    params.id,
    setPemeriksaanId,
    calculateCompleteFlow,
    activeTab,
  ]);

  const handleReset = () => {
    resetCalculation();
    setFuzzyCalculated(false);
    setCurrentStep(1);
    toast("Calculation reset");
  };

  const handleExportPdf = async () => {
    if (!currentPemeriksaanSapi) {
      toast.error("Data pemeriksaan tidak tersedia");
      return;
    }

    setDownloading(true);
    try {
      const blob = await pemeriksaanSapiCRUD.exportPdf(params.id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const sapiName = currentPemeriksaanSapi.sapi_detail?.nm_sapi || `Sapi_${params.id.slice(0, 8)}`;
      const tglPemeriksaan = new Date(currentPemeriksaanSapi.tgl_pemeriksaan)
        .toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, 16);
      link.download = `Laporan_Pemeriksaan_${sapiName}_${tglPemeriksaan}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF berhasil diunduh");
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      toast.error(error.response?.data?.message || "Gagal mengunduh PDF");
    } finally {
      setDownloading(false);
    }
  };

  const steps = [
    { id: 1, name: "Fuzzification", component: FuzzificationStep },
    { id: 2, name: "Inference", component: InferenceStep },
    { id: 3, name: "Defuzzification", component: DefuzzificationStep },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentPemeriksaanSapi) {
    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-2xl mb-4">
                Data Pemeriksaan Tidak Ditemukan
              </h2>
              <p className="text-base-content/70 mb-6">
                Data pemeriksaan dengan ID tersebut tidak ditemukan atau telah dihapus.
              </p>
              <button
                onClick={() => router.push("/pemilik/pemeriksaan")}
                className="btn btn-primary"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Kembali ke Daftar Pemeriksaan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/pemilik/pemeriksaan")}
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold">Detail Pemeriksaan Sapi</h1>
          <button
            onClick={handleExportPdf}
            disabled={downloading || !currentPemeriksaanSapi}
            className="btn btn-primary btn-sm"
          >
            {downloading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Mengunduh...
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Unduh PDF
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === "detail" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("detail")}
          >
            Detail Pemeriksaan
          </button>
          <button
            className={`tab ${activeTab === "fuzzy" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("fuzzy")}
          >
            Fuzzy Mamdani Calculation
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "detail" && (
          <>
            <PemeriksaanSapiDetailInfo 
              pemeriksaan={currentPemeriksaanSapi} 
              showDiagnosis={true}
            />
            {/* Auto-calculate fuzzy for diagnosis if not already calculated */}
            {!fuzzyCalculated && (
              <div className="mt-6">
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
                  <span>Menghitung diagnosis...</span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "fuzzy" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-base-content mb-2">
                Fuzzy Mamdani Calculation
              </h2>
              <p className="text-lg text-base-content/70">
                Step-by-step fuzzy logic calculation for cattle disease diagnosis
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
                <button className="btn btn-sm btn-ghost" onClick={handleReset}>
                  Try Again
                </button>
              </div>
            )}

            {/* Loading */}
            {loadingFuzzy && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner />
              </div>
            )}

            {/* Results Section */}
            {completeFlowData && !loadingFuzzy && (
              <>
                {/* Step Navigation */}
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                      <div className="steps steps-horizontal">
                        {steps.map((step) => (
                          <button
                            key={step.id}
                            className={`step ${
                              currentStep >= step.id ? "step-primary" : ""
                            }`}
                            onClick={() => setCurrentStep(step.id)}
                          >
                            {step.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Step Content */}
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    {(() => {
                      const CurrentStepComponent = steps.find(
                        (step) => step.id === currentStep
                      )?.component;
                      return CurrentStepComponent ? (
                        <CurrentStepComponent />
                      ) : null;
                    })()}
                  </div>
                </div>

                {/* Step Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    className="btn btn-outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous Step
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                    disabled={currentStep === 3}
                  >
                    Next Step
                  </button>
                </div>

                {/* Disease Conclusion - Show after step 3 */}
                {currentStep === 3 && (
                  <div className="mt-8">
                    <DiseaseConclusion />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

