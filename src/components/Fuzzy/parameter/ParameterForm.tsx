/** @format */

// app/fuzzy/parameter/components/ParameterForm.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/UI/Button";
import { ParameterFuzzy } from "@/types/fuzzy";

interface ParameterFormProps {
  onSubmit: (data: ParameterFuzzy) => Promise<boolean>;
  onCancel: () => void;
  initialData?: ParameterFuzzy | null;
  isEditMode?: boolean;
  loading?: boolean;
}

export default function ParameterForm({
  onSubmit,
  onCancel,
  initialData,
  isEditMode = false,
  loading = false,
}: ParameterFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ParameterFuzzy>({
    defaultValues: {
      nama_parameter: "",
      tipe: "input",
      satuan: "",
      nilai_min: 0,
      nilai_max: 100,
      deskripsi: "",
      aktif: true,
    },
  });

  const watchedNilaiMin = watch("nilai_min");
  const watchedNilaiMax = watch("nilai_max");

  useEffect(() => {
    if (initialData) {
      reset({
        nama_parameter: initialData.nama_parameter || "",
        tipe: initialData.tipe || "input",
        satuan: initialData.satuan || "",
        nilai_min: initialData.nilai_min || 0,
        nilai_max: initialData.nilai_max || 100,
        deskripsi: initialData.deskripsi || "",
        aktif: initialData.aktif !== undefined ? initialData.aktif : true,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: ParameterFuzzy) => {
    const success = await onSubmit(data);
    if (success) {
      if (!isEditMode) {
        reset();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Nama Parameter */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nama Parameter *</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full ${
            errors.nama_parameter ? "input-error" : ""
          }`}
          {...register("nama_parameter", {
            required: "Nama parameter harus diisi",
            minLength: {
              value: 2,
              message: "Nama parameter minimal 2 karakter",
            },
            maxLength: {
              value: 50,
              message: "Nama parameter maksimal 50 karakter",
            },
          })}
          placeholder="Masukkan nama parameter"
        />
        {errors.nama_parameter && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.nama_parameter.message}
            </span>
          </label>
        )}
      </div>

      {/* Tipe Parameter */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Tipe Parameter *</span>
        </label>
        <select
          className={`select select-bordered w-full ${
            errors.tipe ? "select-error" : ""
          }`}
          {...register("tipe", {
            required: "Tipe parameter harus dipilih",
          })}
        >
          <option value="input">Input</option>
          <option value="output">Output</option>
        </select>
        {errors.tipe && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.tipe.message}
            </span>
          </label>
        )}
      </div>

      {/* Satuan */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Satuan</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          {...register("satuan", {
            maxLength: {
              value: 20,
              message: "Satuan maksimal 20 karakter",
            },
          })}
          placeholder="Contoh: °C, %, kg"
        />
        {errors.satuan && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.satuan.message}
            </span>
          </label>
        )}
      </div>

      {/* Range Nilai */}
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Nilai Minimum *</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`input input-bordered w-full ${
              errors.nilai_min ? "input-error" : ""
            }`}
            {...register("nilai_min", {
              required: "Nilai minimum harus diisi",
              valueAsNumber: true,
              validate: (value) => {
                if (isNaN(value)) return "Nilai minimum harus berupa angka";
                if (watchedNilaiMax && value >= watchedNilaiMax) {
                  return "Nilai minimum harus lebih kecil dari nilai maksimum";
                }
                return true;
              },
            })}
            placeholder="0"
          />
          {errors.nilai_min && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.nilai_min.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nilai Maksimum *</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`input input-bordered w-full ${
              errors.nilai_max ? "input-error" : ""
            }`}
            {...register("nilai_max", {
              required: "Nilai maksimum harus diisi",
              valueAsNumber: true,
              validate: (value) => {
                if (isNaN(value)) return "Nilai maksimum harus berupa angka";
                if (watchedNilaiMin && value <= watchedNilaiMin) {
                  return "Nilai maksimum harus lebih besar dari nilai minimum";
                }
                return true;
              },
            })}
            placeholder="100"
          />
          {errors.nilai_max && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.nilai_max.message}
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Deskripsi */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Deskripsi</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24 resize-none"
          {...register("deskripsi", {
            maxLength: {
              value: 500,
              message: "Deskripsi maksimal 500 karakter",
            },
          })}
          placeholder="Deskripsi parameter (opsional)"
        />
        {errors.deskripsi && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.deskripsi.message}
            </span>
          </label>
        )}
      </div>

      {/* Status Aktif */}
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register("aktif")}
          />
          <span className="label-text">Parameter Aktif</span>
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
