/** @format */

// app/fuzzy/aturan/components/TestRuleModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TestTube, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Modal from "@/components/UI/Modal";
import { Button } from "@/components/UI/Button";
import Alert from "@/components/UI/Alert";
import ProgressBar from "@/components/UI/ProgressBar";
import { useAturanStore } from "@/stores/crud/aturanStore";

export default function TestRuleModal() {
  const {
    isTestModalOpen,
    aturan,
    testResult,
    loadingTest,
    closeTestModal,
    testRule,
  } = useAturanStore();

  const [inputData, setInputData] = useState<Record<string, any>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isTestModalOpen && aturan) {
      // Initialize input data based on rule conditions
      const initialData: Record<string, any> = {};
      if (aturan.kondisi_if) {
        Object.keys(aturan.kondisi_if).forEach((param) => {
          initialData[param] = "";
        });
      }
      setInputData(initialData);
      reset(initialData);
    }
  }, [isTestModalOpen, aturan, reset]);

  const handleTest = async (data: Record<string, any>) => {
    if (aturan?.id) {
      await testRule(aturan.id, data);
    }
  };

  const handleInputChange = (parameter: string, value: any) => {
    setInputData((prev) => ({
      ...prev,
      [parameter]: value,
    }));
  };

  const getTestResultIcon = () => {
    if (!testResult?.hasil_test) return null;

    const status = testResult.hasil_test.status;
    switch (status) {
      case "aturan_aktif":
        return <CheckCircle className="w-6 h-6 text-success" />;
      case "aturan_tidak_aktif":
        return <XCircle className="w-6 h-6 text-error" />;
      default:
        return <AlertCircle className="w-6 h-6 text-warning" />;
    }
  };

  const getTestResultColor = () => {
    if (!testResult?.hasil_test) return "info";

    const status = testResult.hasil_test.status;
    switch (status) {
      case "aturan_aktif":
        return "success";
      case "aturan_tidak_aktif":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <Modal
      isOpen={isTestModalOpen}
      onClose={closeTestModal}
      title="Test Aturan Fuzzy"
      size="lg"
    >
      <div className="space-y-6">
        {/* Rule Info */}
        {aturan && (
          <div className="bg-base-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              {aturan.nama_aturan}
            </h3>
            <div className="text-sm space-y-1">
              <div>
                <strong>Penyakit:</strong> {aturan.penyakit_nama}
              </div>
              <div>
                <strong>Bobot:</strong> {(aturan.bobot * 100).toFixed(0)}%
              </div>
              <div>
                <strong>Kondisi IF:</strong> {aturan.kondisi_readable}
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit(handleTest)} className="space-y-4">
          <h4 className="font-semibold">Input Data untuk Testing</h4>

          {aturan?.kondisi_if &&
            Object.keys(aturan.kondisi_if).map((parameter) => (
              <div key={parameter} className="form-control">
                <label className="label">
                  <span className="label-text capitalize">
                    {parameter.replace(/_/g, " ")} *
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  {...register(parameter, {
                    required: `${parameter} harus diisi`,
                    onChange: (e) =>
                      handleInputChange(parameter, e.target.value),
                  })}
                  placeholder={`Masukkan nilai ${parameter}`}
                />
                {errors[parameter] && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors[parameter]?.message?.toString()}
                    </span>
                  </label>
                )}
              </div>
            ))}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={loadingTest}
              disabled={Object.keys(inputData).length === 0}
            >
              <TestTube className="w-4 h-4 mr-2" />
              {loadingTest ? "Testing..." : "Test Aturan"}
            </Button>
            <Button type="button" variant="ghost" onClick={closeTestModal}>
              Tutup
            </Button>
          </div>
        </form>

        {/* Test Results */}
        {testResult && (
          <div className="space-y-4">
            <div className="divider">Hasil Test</div>

            {/* Main Result */}
            <Alert type={getTestResultColor()}>
              <div className="flex items-center gap-3">
                {getTestResultIcon()}
                <div>
                  <h4 className="font-semibold">
                    {testResult.hasil_test?.status === "aturan_aktif"
                      ? "Aturan Berhasil Diaktifkan"
                      : "Aturan Tidak Aktif"}
                  </h4>
                  <p className="text-sm mt-1">
                    {testResult.hasil_test?.keterangan}
                  </p>
                </div>
              </div>
            </Alert>

            {/* Activation Level */}
            {testResult.hasil_test?.tingkat_aktivasi !== undefined && (
              <div className="bg-base-200 rounded-lg p-4">
                <h5 className="font-semibold mb-3">Tingkat Aktivasi</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Skor Aktivasi:</span>
                    <span className="font-mono">
                      {(testResult.hasil_test.tingkat_aktivasi * 100).toFixed(
                        2
                      )}
                      %
                    </span>
                  </div>
                  <ProgressBar
                    value={testResult.hasil_test.tingkat_aktivasi * 100}
                    max={100}
                    color={
                      testResult.hasil_test.tingkat_aktivasi > 0.5
                        ? "success"
                        : "warning"
                    }
                    size="sm"
                  />
                </div>
              </div>
            )}

            {/* Input Data Summary */}
            <div className="bg-base-200 rounded-lg p-4">
              <h5 className="font-semibold mb-3">Data Input</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {testResult.input_data &&
                  Object.entries(testResult.input_data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span className="font-mono">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Rule Details */}
            <div className="bg-base-200 rounded-lg p-4">
              <h5 className="font-semibold mb-3">Detail Aturan</h5>
              <div className="text-sm space-y-2">
                <div>
                  <strong>Kondisi IF:</strong>
                  <div className="mt-1 p-2 bg-base-300 rounded text-xs font-mono">
                    {JSON.stringify(aturan?.kondisi_if, null, 2)}
                  </div>
                </div>
                <div>
                  <strong>Kesimpulan THEN:</strong>
                  <div className="mt-1 p-2 bg-base-300 rounded text-xs font-mono">
                    {JSON.stringify(aturan?.kesimpulan_then, null, 2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
