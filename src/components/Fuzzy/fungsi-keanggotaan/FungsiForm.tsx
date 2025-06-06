/** @format */

// app/fuzzy/fungsi-keanggotaan/components/FungsiForm.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/UI/Button";
import { FungsiKeanggotaan, ParameterFuzzyChoice } from "@/types/fuzzy";

interface FungsiFormProps {
  onSubmit: (data: FungsiKeanggotaan) => Promise<boolean>;
  onCancel: () => void;
  initialData?: FungsiKeanggotaan | null;
  isEditMode?: boolean;
  loading?: boolean;
  parameterChoices: ParameterFuzzyChoice[];
  loadingChoices: boolean;
}

export default function FungsiForm({
  onSubmit,
  onCancel,
  initialData,
  isEditMode = false,
  loading = false,
  parameterChoices,
  loadingChoices,
}: FungsiFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FungsiKeanggotaan>({
    defaultValues: {
      parameter: "",
      nama_himpunan: "",
      tipe_fungsi: "trimf",
      parameter_fungsi: [0, 50, 100],
      warna: "#0000FF",
      aktif: true,
    },
  });

  const watchedTipeFungsi = watch("tipe_fungsi");

  useEffect(() => {
    if (initialData) {
      reset({
        parameter: initialData.parameter || "",
        nama_himpunan: initialData.nama_himpunan || "",
        tipe_fungsi: initialData.tipe_fungsi || "trimf",
        parameter_fungsi: initialData.parameter_fungsi || [0, 50, 100],
        warna: initialData.warna || "#0000FF",
        aktif: initialData.aktif !== undefined ? initialData.aktif : true,
      });
    }
  }, [initialData, reset]);

  // Update parameter fungsi ketika tipe fungsi berubah
  useEffect(() => {
    if (watchedTipeFungsi && !isEditMode) {
      switch (watchedTipeFungsi) {
        case "trimf":
          setValue("parameter_fungsi", [0, 50, 100]);
          break;
        case "trapmf":
          setValue("parameter_fungsi", [0, 25, 75, 100]);
          break;
        case "gaussmf":
          setValue("parameter_fungsi", [50, 20]);
          break;
      }
    }
  }, [watchedTipeFungsi, setValue, isEditMode]);

  const handleFormSubmit = async (data: FungsiKeanggotaan) => {
    const success = await onSubmit(data);
    if (success) {
      if (!isEditMode) {
        reset();
      }
    }
  };

  const getParameterFieldsDescription = () => {
    switch (watchedTipeFungsi) {
      case "trimf":
        return "Format: [a, b, c] - a: nilai minimum, b: nilai tengah, c: nilai maksimum";
      case "trapmf":
        return "Format: [a, b, c, d] - a: mulai naik, b: mulai datar, c: mulai turun, d: selesai turun";
      case "gaussmf":
        return "Format: [mean, sigma] - mean: nilai tengah, sigma: simpangan baku";
      default:
        return "";
    }
  };

  const getRequiredLength = () => {
    switch (watchedTipeFungsi) {
      case "trimf":
        return 3;
      case "trapmf":
        return 4;
      case "gaussmf":
        return 2;
      default:
        return 3;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Parameter */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Parameter *</span>
        </label>
        <select
          className={`select select-bordered w-full ${
            errors.parameter ? "select-error" : ""
          }`}
          {...register("parameter", {
            required: "Parameter harus dipilih",
          })}
          disabled={loadingChoices}
        >
          <option value="">Pilih Parameter</option>
          {parameterChoices.map((param) => (
            <option key={param.id} value={param.id}>
              {param.nama_parameter} ({param.tipe})
            </option>
          ))}
        </select>
        {errors.parameter && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.parameter.message}
            </span>
          </label>
        )}
      </div>

      {/* Nama Himpunan */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nama Himpunan Fuzzy *</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full ${
            errors.nama_himpunan ? "input-error" : ""
          }`}
          {...register("nama_himpunan", {
            required: "Nama himpunan harus diisi",
            minLength: {
              value: 2,
              message: "Nama himpunan minimal 2 karakter",
            },
            maxLength: {
              value: 50,
              message: "Nama himpunan maksimal 50 karakter",
            },
          })}
          placeholder="Contoh: Rendah, Sedang, Tinggi"
        />
        {errors.nama_himpunan && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.nama_himpunan.message}
            </span>
          </label>
        )}
      </div>

      {/* Tipe Fungsi */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Tipe Fungsi *</span>
        </label>
        <select
          className={`select select-bordered w-full ${
            errors.tipe_fungsi ? "select-error" : ""
          }`}
          {...register("tipe_fungsi", {
            required: "Tipe fungsi harus dipilih",
          })}
        >
          <option value="trimf">Triangular (3 parameter)</option>
          <option value="trapmf">Trapezoidal (4 parameter)</option>
          <option value="gaussmf">Gaussian (2 parameter)</option>
        </select>
        {errors.tipe_fungsi && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.tipe_fungsi.message}
            </span>
          </label>
        )}
      </div>

      {/* Parameter Fungsi */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Parameter Fungsi *</span>
        </label>
        <div className="text-xs text-base-content/70 mb-2">
          {getParameterFieldsDescription()}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: getRequiredLength() }).map((_, index) => (
            <input
              key={index}
              type="number"
              step="0.01"
              className={`input input-bordered input-sm ${
                errors.parameter_fungsi?.[index] ? "input-error" : ""
              }`}
              {...register(`parameter_fungsi.${index}`, {
                required: "Parameter wajib diisi",
                valueAsNumber: true,
                validate: (value) => {
                  if (isNaN(value)) return "Harus berupa angka";
                  return true;
                },
              })}
              placeholder={
                watchedTipeFungsi === "trimf"
                  ? ["a", "b", "c"][index]
                  : watchedTipeFungsi === "trapmf"
                  ? ["a", "b", "c", "d"][index]
                  : ["mean", "sigma"][index]
              }
            />
          ))}
        </div>
        {errors.parameter_fungsi && (
          <label className="label">
            <span className="label-text-alt text-error">
              Semua parameter fungsi harus diisi dengan benar
            </span>
          </label>
        )}
      </div>

      {/* Warna */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Warna Visualisasi</span>
        </label>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            className="input input-bordered w-20 h-12 p-1"
            {...register("warna")}
          />
          <input
            type="text"
            className="input input-bordered flex-1"
            {...register("warna")}
            placeholder="#0000FF"
          />
        </div>
      </div>

      {/* Status Aktif */}
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register("aktif")}
          />
          <span className="label-text">Fungsi Keanggotaan Aktif</span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="modal-action">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditMode ? "Update" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
