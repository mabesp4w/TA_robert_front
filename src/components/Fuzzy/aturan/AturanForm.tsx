/** @format */

// app/fuzzy/aturan/components/AturanForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { AturanFuzzy, JenisPenyakitChoice } from "@/types/fuzzy";

interface AturanFormProps {
  onSubmit: (data: AturanFuzzy) => Promise<boolean>;
  onCancel: () => void;
  initialData?: AturanFuzzy | null;
  isEditMode?: boolean;
  loading?: boolean;
  penyakitChoices: JenisPenyakitChoice[];
  loadingChoices: boolean;
}

interface KondisiIF {
  parameter: string;
  nilai: string;
}

interface KesimpulanThen {
  key: string;
  value: any;
}

export default function AturanForm({
  onSubmit,
  onCancel,
  initialData,
  isEditMode = false,
  loading = false,
  penyakitChoices,
  loadingChoices,
}: AturanFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AturanFuzzy>({
    defaultValues: {
      nama_aturan: "",
      penyakit: "",
      kondisi_if: {},
      kesimpulan_then: {},
      bobot: 1.0,
      deskripsi: "",
      aktif: true,
    },
  });

  const [kondisiList, setKondisiList] = useState<KondisiIF[]>([
    { parameter: "", nilai: "" },
  ]);

  const [kesimpulanList, setKesimpulanList] = useState<KesimpulanThen[]>([
    { key: "tingkat_resiko", value: "tinggi" },
  ]);

  useEffect(() => {
    if (initialData) {
      reset({
        nama_aturan: initialData.nama_aturan || "",
        penyakit: initialData.penyakit || "",
        kondisi_if: initialData.kondisi_if || {},
        kesimpulan_then: initialData.kesimpulan_then || {},
        bobot: initialData.bobot || 1.0,
        deskripsi: initialData.deskripsi || "",
        aktif: initialData.aktif !== undefined ? initialData.aktif : true,
      });

      // Convert kondisi_if object to array for UI
      if (initialData.kondisi_if) {
        const kondisiArray = Object.entries(initialData.kondisi_if).map(
          ([parameter, nilai]) => ({
            parameter,
            nilai: String(nilai),
          })
        );
        setKondisiList(
          kondisiArray.length > 0
            ? kondisiArray
            : [{ parameter: "", nilai: "" }]
        );
      }

      // Convert kesimpulan_then object to array for UI
      if (initialData.kesimpulan_then) {
        const kesimpulanArray = Object.entries(initialData.kesimpulan_then).map(
          ([key, value]) => ({
            key,
            value,
          })
        );
        setKesimpulanList(
          kesimpulanArray.length > 0
            ? kesimpulanArray
            : [{ key: "tingkat_resiko", value: "tinggi" }]
        );
      }
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: AturanFuzzy) => {
    // Convert kondisi array to object
    const kondisiObject = kondisiList.reduce((acc, item) => {
      if (item.parameter && item.nilai) {
        acc[item.parameter] = item.nilai;
      }
      return acc;
    }, {} as Record<string, string>);

    // Convert kesimpulan array to object
    const kesimpulanObject = kesimpulanList.reduce((acc, item) => {
      if (item.key && item.value) {
        acc[item.key] = item.value;
      }
      return acc;
    }, {} as Record<string, any>);

    const formData = {
      ...data,
      kondisi_if: kondisiObject,
      kesimpulan_then: kesimpulanObject,
    };

    const success = await onSubmit(formData);
    if (success) {
      if (!isEditMode) {
        reset();
        setKondisiList([{ parameter: "", nilai: "" }]);
        setKesimpulanList([{ key: "tingkat_resiko", value: "tinggi" }]);
      }
    }
  };

  const addKondisi = () => {
    setKondisiList([...kondisiList, { parameter: "", nilai: "" }]);
  };

  const removeKondisi = (index: number) => {
    if (kondisiList.length > 1) {
      setKondisiList(kondisiList.filter((_, i) => i !== index));
    }
  };

  const updateKondisi = (
    index: number,
    field: keyof KondisiIF,
    value: string
  ) => {
    const updated = [...kondisiList];
    updated[index][field] = value;
    setKondisiList(updated);
  };

  const addKesimpulan = () => {
    setKesimpulanList([...kesimpulanList, { key: "", value: "" }]);
  };

  const removeKesimpulan = (index: number) => {
    if (kesimpulanList.length > 1) {
      setKesimpulanList(kesimpulanList.filter((_, i) => i !== index));
    }
  };

  const updateKesimpulan = (
    index: number,
    field: keyof KesimpulanThen,
    value: any
  ) => {
    const updated = [...kesimpulanList];
    updated[index][field] = value;
    setKesimpulanList(updated);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Nama Aturan */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nama Aturan *</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full ${
            errors.nama_aturan ? "input-error" : ""
          }`}
          {...register("nama_aturan", {
            required: "Nama aturan harus diisi",
            minLength: {
              value: 3,
              message: "Nama aturan minimal 3 karakter",
            },
            maxLength: {
              value: 100,
              message: "Nama aturan maksimal 100 karakter",
            },
          })}
          placeholder="Masukkan nama aturan"
        />
        {errors.nama_aturan && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.nama_aturan.message}
            </span>
          </label>
        )}
      </div>

      {/* Penyakit Target */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Penyakit Target *</span>
        </label>
        <select
          className={`select select-bordered w-full ${
            errors.penyakit ? "select-error" : ""
          }`}
          {...register("penyakit", {
            required: "Penyakit target harus dipilih",
          })}
          disabled={loadingChoices}
        >
          <option value="">Pilih Penyakit</option>
          {penyakitChoices.map((penyakit) => (
            <option key={penyakit.id} value={penyakit.id}>
              {penyakit.nm_penyakit} ({penyakit.tingkat_bahaya})
            </option>
          ))}
        </select>
        {errors.penyakit && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.penyakit.message}
            </span>
          </label>
        )}
      </div>

      {/* Kondisi IF (Antecedent) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Kondisi IF (Antecedent) *</span>
        </label>
        <div className="space-y-2">
          {kondisiList.map((kondisi, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                className="input input-bordered input-sm flex-1"
                placeholder="Parameter (contoh: suhu_tubuh)"
                value={kondisi.parameter}
                onChange={(e) =>
                  updateKondisi(index, "parameter", e.target.value)
                }
              />
              <span className="text-sm">adalah</span>
              <input
                type="text"
                className="input input-bordered input-sm flex-1"
                placeholder="Nilai (contoh: tinggi)"
                value={kondisi.nilai}
                onChange={(e) => updateKondisi(index, "nilai", e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                variant="error"
                onClick={() => removeKondisi(index)}
                disabled={kondisiList.length === 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addKondisi}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kondisi
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Contoh kondisi: suhu_tubuh = tinggi, nafsu_makan = rendah
        </div>
      </div>

      {/* Kesimpulan THEN (Consequent) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Kesimpulan THEN (Consequent) *</span>
        </label>
        <div className="space-y-2">
          {kesimpulanList.map((kesimpulan, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                className="input input-bordered input-sm flex-1"
                placeholder="Key (contoh: tingkat_resiko)"
                value={kesimpulan.key}
                onChange={(e) => updateKesimpulan(index, "key", e.target.value)}
              />
              <span className="text-sm">adalah</span>
              <input
                type="text"
                className="input input-bordered input-sm flex-1"
                placeholder="Value (contoh: tinggi)"
                value={kesimpulan.value}
                onChange={(e) =>
                  updateKesimpulan(index, "value", e.target.value)
                }
              />
              <Button
                type="button"
                size="sm"
                variant="error"
                onClick={() => removeKesimpulan(index)}
                disabled={kesimpulanList.length === 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addKesimpulan}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kesimpulan
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Contoh kesimpulan: tingkat_resiko = tinggi, kepercayaan = 0.8
        </div>
      </div>

      {/* Bobot Aturan */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Bobot Aturan *</span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          className={`input input-bordered w-full ${
            errors.bobot ? "input-error" : ""
          }`}
          {...register("bobot", {
            required: "Bobot aturan harus diisi",
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Bobot minimum adalah 0",
            },
            max: {
              value: 1,
              message: "Bobot maksimum adalah 1",
            },
          })}
          placeholder="0.8"
        />
        {errors.bobot && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.bobot.message}
            </span>
          </label>
        )}
        <div className="text-xs text-gray-500 mt-1">
          Nilai antara 0.0 - 1.0 (1.0 = bobot penuh)
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
          placeholder="Deskripsi aturan (opsional)"
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
          <span className="label-text">Aturan Aktif</span>
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
