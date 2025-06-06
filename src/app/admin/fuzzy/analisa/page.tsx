/** @format */

// app/fuzzy-calculation/page.tsx
"use client";

import React, { useState } from "react";
import { useFuzzyCalculationStore } from "@/stores/api/fuzzyCalculationStore";
import { FuzzificationStep } from "@/components/Fuzzy/FuzzificationStep";
import { InferenceStep } from "@/components/Fuzzy/InferenceStep";
import { DefuzzificationStep } from "@/components/Fuzzy/DefuzzificationStep";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ManualInputForm } from "@/types/fuzzy";

export default function FuzzyCalculationPage() {
  const {
    completeFlowData,
    loading,
    error,
    currentStep,
    setInputData,
    setPemeriksaanId,
    setCurrentStep,
    calculateCompleteFlow,
    resetCalculation,
  } = useFuzzyCalculationStore();

  const [showInputForm, setShowInputForm] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualInputForm>();

  const onSubmitManual = (data: ManualInputForm) => {
    setInputData(data as any);
    setPemeriksaanId(null);
    handleCalculate();
  };

  const handleCalculate = async () => {
    try {
      await calculateCompleteFlow();
      setShowInputForm(false);
      toast.success("Fuzzy calculation completed successfully!");
    } catch (error) {
      console.log({ error });
      toast.error("Calculation failed. Please check your inputs.");
    }
  };

  const handleReset = () => {
    resetCalculation();
    reset();
    setShowInputForm(true);
    setCurrentStep(1);
    toast("Calculation reset");
  };

  const steps = [
    { id: 1, name: "Fuzzification", component: FuzzificationStep },
    { id: 2, name: "Inference", component: InferenceStep },
    { id: 3, name: "Defuzzification", component: DefuzzificationStep },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">
            Fuzzy Mamdani Calculation
          </h1>
          <p className="text-lg text-base-content/70">
            Step-by-step fuzzy logic calculation for cattle disease diagnosis
          </p>
        </div>

        {/* Input Form */}
        {showInputForm && (
          <div className="card bg-base-100 shadow-lg mb-8">
            <div className="card-body">
              <form
                onSubmit={handleSubmit(onSubmitManual)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Suhu Tubuh */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Suhu Tubuh (°C)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="35"
                      max="45"
                      className={`input input-bordered ${
                        errors.suhu_tubuh ? "input-error" : ""
                      }`}
                      placeholder="38.5"
                      {...register("suhu_tubuh", {
                        required: "Suhu tubuh wajib diisi",
                        min: { value: 35, message: "Minimal 35°C" },
                        max: { value: 45, message: "Maksimal 45°C" },
                      })}
                    />
                    {errors.suhu_tubuh && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.suhu_tubuh.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Nafsu Makan */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nafsu Makan (0-10)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className={`input input-bordered ${
                        errors.nafsu_makan ? "input-error" : ""
                      }`}
                      placeholder="7"
                      {...register("nafsu_makan", {
                        required: "Nafsu makan wajib diisi",
                        min: { value: 0, message: "Minimal 0" },
                        max: { value: 10, message: "Maksimal 10" },
                      })}
                    />
                    {errors.nafsu_makan && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.nafsu_makan.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Aktivitas */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Aktivitas (0-10)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className={`input input-bordered ${
                        errors.aktivitas ? "input-error" : ""
                      }`}
                      placeholder="8"
                      {...register("aktivitas", {
                        required: "Aktivitas wajib diisi",
                        min: { value: 0, message: "Minimal 0" },
                        max: { value: 10, message: "Maksimal 10" },
                      })}
                    />
                    {errors.aktivitas && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.aktivitas.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Frekuensi Napas */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Frekuensi Napas (/menit)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="60"
                      className={`input input-bordered ${
                        errors.frekuensi_napas ? "input-error" : ""
                      }`}
                      placeholder="24"
                      {...register("frekuensi_napas", {
                        required: "Frekuensi napas wajib diisi",
                        min: { value: 10, message: "Minimal 10/menit" },
                        max: { value: 60, message: "Maksimal 60/menit" },
                      })}
                    />
                    {errors.frekuensi_napas && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.frekuensi_napas.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Denyut Jantung */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Denyut Jantung (/menit)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="40"
                      max="120"
                      className={`input input-bordered ${
                        errors.denyut_jantung ? "input-error" : ""
                      }`}
                      placeholder="72"
                      {...register("denyut_jantung", {
                        required: "Denyut jantung wajib diisi",
                        min: { value: 40, message: "Minimal 40/menit" },
                        max: { value: 120, message: "Maksimal 120/menit" },
                      })}
                    />
                    {errors.denyut_jantung && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.denyut_jantung.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Kondisi Mata */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Kondisi Mata (0-10)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className={`input input-bordered ${
                        errors.kondisi_mata ? "input-error" : ""
                      }`}
                      placeholder="8"
                      {...register("kondisi_mata", {
                        required: "Kondisi mata wajib diisi",
                        min: { value: 0, message: "Minimal 0" },
                        max: { value: 10, message: "Maksimal 10" },
                      })}
                    />
                    {errors.kondisi_mata && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.kondisi_mata.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Kondisi Hidung */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Kondisi Hidung (0-10)</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className={`input input-bordered ${
                        errors.kondisi_hidung ? "input-error" : ""
                      }`}
                      placeholder="7"
                      {...register("kondisi_hidung", {
                        required: "Kondisi hidung wajib diisi",
                        min: { value: 0, message: "Minimal 0" },
                        max: { value: 10, message: "Maksimal 10" },
                      })}
                    />
                    {errors.kondisi_hidung && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.kondisi_hidung.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Konsistensi Feses */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Konsistensi Feses (0-10)
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className={`input input-bordered ${
                        errors.konsistensi_feses ? "input-error" : ""
                      }`}
                      placeholder="6"
                      {...register("konsistensi_feses", {
                        required: "Konsistensi feses wajib diisi",
                        min: { value: 0, message: "Minimal 0" },
                        max: { value: 10, message: "Maksimal 10" },
                      })}
                    />
                    {errors.konsistensi_feses && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.konsistensi_feses.message}
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Produksi Susu */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Produksi Susu (L/hari)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="50"
                      className={`input input-bordered ${
                        errors.produksi_susu ? "input-error" : ""
                      }`}
                      placeholder="15.5"
                      {...register("produksi_susu", {
                        required: "Produksi susu wajib diisi",
                        min: { value: 0, message: "Minimal 0" },
                        max: { value: 50, message: "Maksimal 50" },
                      })}
                    />
                    {errors.produksi_susu && (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {errors.produksi_susu.message}
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => reset()}
                  >
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? "loading" : ""}`}
                    disabled={loading}
                  >
                    {loading ? "Calculating..." : "Calculate Fuzzy"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="alert alert-error mb-6">
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

        {/* Results Section */}
        {completeFlowData && !showInputForm && (
          <>
            {/* Step Navigation */}
            <div className="card bg-base-100 shadow-md mb-6">
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

                  <div className="flex gap-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={handleReset}
                    >
                      New Calculation
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setShowInputForm(true)}
                    >
                      Edit Input
                    </button>
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
                  return CurrentStepComponent ? <CurrentStepComponent /> : null;
                })()}
              </div>
            </div>

            {/* Step Navigation Buttons */}
            <div className="flex justify-between mt-6">
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
          </>
        )}
      </div>
    </div>
  );
}
