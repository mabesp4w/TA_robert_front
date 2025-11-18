/** @format */

// app/fuzzy-calculation/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useFuzzyCalculationStore } from "@/stores/api/fuzzyCalculationStore";
import { FuzzificationStep } from "@/components/Fuzzy/FuzzificationStep";
import { InferenceStep } from "@/components/Fuzzy/InferenceStep";
import { DefuzzificationStep } from "@/components/Fuzzy/DefuzzificationStep";
import { DiseaseConclusion } from "@/components/Fuzzy/DiseaseConclusion";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

export default function FuzzyCalculationPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    completeFlowData,
    error,
    currentStep,
    setCurrentStep,
    calculateCompleteFlow,
    resetCalculation,
    setPemeriksaanId,
    loading,
  } = useFuzzyCalculationStore();

  const [showInputForm, setShowInputForm] = useState(true);
  const pemeriksaanId = params.id;

  useEffect(() => {
    const handleCalculate = async () => {
      try {
        setPemeriksaanId(pemeriksaanId);
        await calculateCompleteFlow();
        setShowInputForm(false);
        toast.success("Fuzzy calculation completed successfully!");
      } catch (error) {
        console.log({ error });
        toast.error("Calculation failed. Please check your inputs.");
      }
    };

    handleCalculate();
  }, [pemeriksaanId, setPemeriksaanId, calculateCompleteFlow]);

  const handleReset = () => {
    resetCalculation();
    setShowInputForm(true);
    setCurrentStep(1);
    toast("Calculation reset");
  };

  const steps = [
    { id: 1, name: "Fuzzification", component: FuzzificationStep },
    { id: 2, name: "Inference", component: InferenceStep },
    { id: 3, name: "Defuzzification", component: DefuzzificationStep },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

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

            {/* Disease Conclusion - Show after step 3 */}
            {currentStep === 3 && (
              <div className="mt-8">
                <DiseaseConclusion />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
