/** @format */
// components/pages/PemeriksaanSapi/PemeriksaanSapiForm.tsx
import { useForm } from "react-hook-form";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { usePemeriksaanSapiStore } from "@/stores/crud/pemeriksaanSapiStore";
import { useDataSapiStore } from "@/stores/crud/dataSapiStore";
import { PemeriksaanSapi } from "@/types";
import { useEffect, useState, useMemo } from "react";

interface PemeriksaanSapiFormProps {
  initialData?: Partial<PemeriksaanSapi>;
  onSuccess?: (data: PemeriksaanSapi) => void;
  onCancel?: () => void;
  sapiList?: any[];
  disableSapiSelect?: boolean;
}

const PemeriksaanSapiForm = ({
  initialData,
  onSuccess,
  onCancel,
  sapiList,
  disableSapiSelect = false,
}: PemeriksaanSapiFormProps) => {
  const { createPemeriksaanSapi, updatePemeriksaanSapi, loading } =
    usePemeriksaanSapiStore();
  const { dataSapi, fetchDataSapis, loading: loadingSapi } = useDataSapiStore();
  const [parameterStatus, setParameterStatus] = useState<any>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PemeriksaanSapi>();

  // Watch vital parameters for real-time validation
  const suhuTubuh = watch("suhu_tubuh");
  const frekuensiNapas = watch("frekuensi_napas");
  const denyutJantung = watch("denyut_jantung");
  const nafsuMakan = watch("nafsu_makan");
  const aktivitas = watch("aktivitas");

  useEffect(() => {
    // Fetch data sapi untuk dropdown (hanya jika sapiList tidak disediakan)
    if (!sapiList || sapiList.length === 0) {
      fetchDataSapis();
    }
  }, [fetchDataSapis, sapiList]);

  useEffect(() => {
    if (initialData) {
      setValue("sapi", initialData?.sapi || "");
      setValue("tgl_pemeriksaan", initialData?.tgl_pemeriksaan || "");
      setValue("suhu_tubuh", initialData?.suhu_tubuh || 38.5);
      setValue("frekuensi_napas", initialData?.frekuensi_napas || 24);
      setValue("denyut_jantung", initialData?.denyut_jantung || 72);
      setValue("nafsu_makan", initialData?.nafsu_makan || 8);
      setValue("aktivitas", initialData?.aktivitas || 8);
      setValue("batuk", initialData?.batuk || false);
      setValue("sesak_napas", initialData?.sesak_napas || false);
      setValue("diare", initialData?.diare || false);
      setValue("muntah", initialData?.muntah || false);
      setValue("lemas", initialData?.lemas || false);
      setValue("demam", initialData?.demam || false);
      setValue("kondisi_mata", initialData?.kondisi_mata || 0);
      setValue("kondisi_hidung", initialData?.kondisi_hidung || 0);
      setValue("konsistensi_feses", initialData?.konsistensi_feses || 0);
      setValue("catatan_pemeriksaan", initialData?.catatan_pemeriksaan || "");
    }
  }, [initialData, setValue]);

  // Real-time parameter validation
  useEffect(() => {
    const newStatus: any = {};

    // Suhu tubuh validation
    if (suhuTubuh) {
      newStatus.suhu_tubuh = {
        value: suhuTubuh,
        status: suhuTubuh >= 38.0 && suhuTubuh <= 39.5 ? "normal" : "abnormal",
        color: suhuTubuh >= 38.0 && suhuTubuh <= 39.5 ? "success" : "error",
        range: "38.0 - 39.5°C",
      };
    }

    // Frekuensi napas validation
    if (frekuensiNapas) {
      newStatus.frekuensi_napas = {
        value: frekuensiNapas,
        status:
          frekuensiNapas >= 12 && frekuensiNapas <= 36 ? "normal" : "abnormal",
        color:
          frekuensiNapas >= 12 && frekuensiNapas <= 36 ? "success" : "error",
        range: "12 - 36 /menit",
      };
    }

    // Denyut jantung validation
    if (denyutJantung) {
      newStatus.denyut_jantung = {
        value: denyutJantung,
        status:
          denyutJantung >= 60 && denyutJantung <= 84 ? "normal" : "abnormal",
        color: denyutJantung >= 60 && denyutJantung <= 84 ? "success" : "error",
        range: "60 - 84 BPM",
      };
    }

    // Nafsu makan validation
    if (nafsuMakan) {
      newStatus.nafsu_makan = {
        value: nafsuMakan,
        status: nafsuMakan >= 7 ? "baik" : "buruk",
        color: nafsuMakan >= 7 ? "success" : "warning",
        category:
          nafsuMakan >= 8 ? "tinggi" : nafsuMakan >= 5 ? "sedang" : "rendah",
      };
    }

    // Aktivitas validation
    if (aktivitas) {
      newStatus.aktivitas = {
        value: aktivitas,
        status: aktivitas >= 7 ? "aktif" : "lemas",
        color: aktivitas >= 7 ? "success" : "warning",
        category:
          aktivitas >= 8 ? "tinggi" : aktivitas >= 5 ? "sedang" : "rendah",
      };
    }

    setParameterStatus(newStatus);
  }, [suhuTubuh, frekuensiNapas, denyutJantung, nafsuMakan, aktivitas]);

  const onSubmit = async (data: Partial<PemeriksaanSapi>) => {
    const success = initialData?.id
      ? await updatePemeriksaanSapi(initialData.id, data as PemeriksaanSapi)
      : await createPemeriksaanSapi(data as PemeriksaanSapi);

    if (success) {
      reset();
      onSuccess?.(data as PemeriksaanSapi);
    }
  };

  // Gunakan useMemo agar reactive terhadap perubahan dataSapi atau sapiList
  const sapiOptions = useMemo(() => {
    const sourceList = sapiList && sapiList.length > 0 ? sapiList : dataSapi;
    return sourceList
      .filter((sapi) => sapi && sapi.id) // Hanya filter sapi yang memiliki ID
      .map((sapi) => ({
        value: sapi.id,
        label: `${sapi.nm_sapi || `Sapi ${sapi.id.slice(0, 8)}`}${
          sapi.jenkel ? ` (${sapi.jenkel}` : ""
        }${sapi.umur_bulan ? `, ${sapi.umur_bulan} bulan` : ""}${
          sapi.berat_kg ? `, ${sapi.berat_kg} kg` : ""
        }${sapi.jenkel ? ")" : ""}`,
      }));
  }, [dataSapi, sapiList]);

  const getStatusBadge = (paramKey: string) => {
    const param = parameterStatus[paramKey];
    if (!param) return null;

    return (
      <span className={`badge badge-${param.color} badge-sm`}>
        {param.status}
        {param.category && ` (${param.category})`}
      </span>
    );
  };

  const getParameterHelper = (paramKey: string) => {
    const param = parameterStatus[paramKey];
    if (!param) return null;

    return (
      <div
        className={`text-xs mt-1 ${
          param.color === "success"
            ? "text-success"
            : param.color === "error"
            ? "text-error"
            : "text-warning"
        }`}
      >
        {param.range && `Normal: ${param.range}`}
        {param.status === "abnormal" && " - Nilai di luar range normal!"}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Informasi Dasar</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormSelect
                label="Pilih Sapi"
                required
                options={[
                  {
                    value: "",
                    label: loadingSapi
                      ? "Memuat data sapi..."
                      : sapiOptions.length === 0
                      ? "Tidak ada data sapi"
                      : "Pilih sapi...",
                  },
                  ...sapiOptions,
                ]}
                {...register("sapi", {
                  required: "Sapi harus dipilih",
                })}
                error={errors.sapi?.message}
                disabled={disableSapiSelect || loadingSapi || sapiOptions.length === 0}
              />
              {!loadingSapi && sapiOptions.length === 0 && (
                <p className="text-xs text-warning mt-1">
                  Belum ada data sapi. Silakan tambah data sapi terlebih dahulu.
                </p>
              )}
            </div>

            <FormInput
              label="Tanggal Pemeriksaan"
              type="datetime-local"
              required
              {...register("tgl_pemeriksaan", {
                required: "Tanggal pemeriksaan harus diisi",
              })}
              error={errors.tgl_pemeriksaan?.message}
            />
          </div>
        </div>
      </div>

      {/* Vital Parameters */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Parameter Vital</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="label-text">
                  Suhu Tubuh (°C) <span className="text-error">*</span>
                </label>
                {getStatusBadge("suhu_tubuh")}
              </div>
              <FormInput
                type="number"
                step="0.1"
                placeholder="38.5"
                {...register("suhu_tubuh", {
                  required: "Suhu tubuh harus diisi",
                  valueAsNumber: true,
                  min: { value: 35, message: "Suhu terlalu rendah" },
                  max: { value: 45, message: "Suhu terlalu tinggi" },
                })}
                error={errors.suhu_tubuh?.message}
              />
              {getParameterHelper("suhu_tubuh")}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label-text">
                  Frekuensi Napas (/menit) <span className="text-error">*</span>
                </label>
                {getStatusBadge("frekuensi_napas")}
              </div>
              <FormInput
                type="number"
                placeholder="24"
                {...register("frekuensi_napas", {
                  required: "Frekuensi napas harus diisi",
                  valueAsNumber: true,
                  min: { value: 5, message: "Frekuensi terlalu rendah" },
                  max: { value: 60, message: "Frekuensi terlalu tinggi" },
                })}
                error={errors.frekuensi_napas?.message}
              />
              {getParameterHelper("frekuensi_napas")}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label-text">
                  Denyut Jantung (BPM) <span className="text-error">*</span>
                </label>
                {getStatusBadge("denyut_jantung")}
              </div>
              <FormInput
                type="number"
                placeholder="72"
                {...register("denyut_jantung", {
                  required: "Denyut jantung harus diisi",
                  valueAsNumber: true,
                  min: { value: 30, message: "Denyut terlalu rendah" },
                  max: { value: 150, message: "Denyut terlalu tinggi" },
                })}
                error={errors.denyut_jantung?.message}
              />
              {getParameterHelper("denyut_jantung")}
            </div>
          </div>
        </div>
      </div>

      {/* Behavioral Parameters */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Parameter Perilaku</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="label-text">
                  Nafsu Makan (1-10) <span className="text-error">*</span>
                </label>
                {getStatusBadge("nafsu_makan")}
              </div>
              <input
                type="range"
                min="1"
                max="10"
                className="range range-primary"
                {...register("nafsu_makan", {
                  required: "Nafsu makan harus diisi",
                  valueAsNumber: true,
                })}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
              <div className="text-center mt-1">
                <span className="font-semibold">Nilai: {nafsuMakan || 5}</span>
              </div>
              {errors.nafsu_makan && (
                <div className="text-error text-sm mt-1">
                  {errors.nafsu_makan.message}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="label-text">
                  Aktivitas (1-10) <span className="text-error">*</span>
                </label>
                {getStatusBadge("aktivitas")}
              </div>
              <input
                type="range"
                min="1"
                max="10"
                className="range range-secondary"
                {...register("aktivitas", {
                  required: "Aktivitas harus diisi",
                  valueAsNumber: true,
                })}
              />
              <div className="w-full flex justify-between text-xs px-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
              <div className="text-center mt-1">
                <span className="font-semibold">Nilai: {aktivitas || 5}</span>
              </div>
              {errors.aktivitas && (
                <div className="text-error text-sm mt-1">
                  {errors.aktivitas.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Signs */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Gejala Klinis</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "batuk", label: "Batuk", color: "checkbox-error" },
              {
                key: "sesak_napas",
                label: "Sesak Napas",
                color: "checkbox-warning",
              },
              { key: "diare", label: "Diare", color: "checkbox-info" },
              { key: "muntah", label: "Muntah", color: "checkbox-success" },
              { key: "lemas", label: "Lemas", color: "checkbox-secondary" },
              { key: "demam", label: "Demam", color: "checkbox-accent" },
            ].map((gejala) => (
              <div key={gejala.key} className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">{gejala.label}</span>
                  <input
                    type="checkbox"
                    className={`checkbox ${gejala.color}`}
                    {...register(gejala.key as keyof PemeriksaanSapi)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Physical Condition */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Kondisi Fisik</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              label="Kondisi Mata"
              required
              options={[
                { value: 0, label: "Pilih kondisi..." },
                { value: 1, label: "Normal (Bersih & Cerah)" },
                { value: 2, label: "Berair" },
                { value: 3, label: "Merah/Iritasi" },
                { value: 4, label: "Bengkak" },
                { value: 5, label: "Ada Kotoran/Nanah" },
                { value: 6, label: "Keruh/Tidak Jernih" },
              ]}
              {...register("kondisi_mata", {
                valueAsNumber: true,
                required: "Kondisi mata harus dipilih",
                validate: (value) => value > 0 || "Kondisi mata harus dipilih",
              })}
              error={errors.kondisi_mata?.message}
            />

            <FormSelect
              label="Kondisi Hidung"
              required
              options={[
                { value: 0, label: "Pilih kondisi..." },
                { value: 1, label: "Normal (Bersih & Lembab)" },
                { value: 2, label: "Kering" },
                { value: 3, label: "Berlendir Bening" },
                { value: 4, label: "Berlendir Kental" },
                { value: 5, label: "Bernanah" },
                { value: 6, label: "Berdarah" },
                { value: 7, label: "Ada Kerak" },
              ]}
              {...register("kondisi_hidung", {
                valueAsNumber: true,
                required: "Kondisi hidung harus dipilih",
                validate: (value) =>
                  value > 0 || "Kondisi hidung harus dipilih",
              })}
              error={errors.kondisi_hidung?.message}
            />

            <FormSelect
              label="Konsistensi Feses"
              required
              options={[
                { value: 0, label: "Pilih konsistensi..." },
                { value: 1, label: "Normal (Padat & Berbentuk)" },
                { value: 2, label: "Lunak" },
                { value: 3, label: "Encer/Diare" },
                { value: 4, label: "Berlendir" },
                { value: 5, label: "Berdarah" },
                { value: 6, label: "Keras/Kering" },
                { value: 7, label: "Berbusa" },
              ]}
              {...register("konsistensi_feses", {
                valueAsNumber: true,
                required: "Konsistensi feses harus dipilih",
                validate: (value) =>
                  value > 0 || "Konsistensi feses harus dipilih",
              })}
              error={errors.konsistensi_feses?.message}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Catatan Pemeriksaan</h3>

          <div className="form-control">
            <textarea
              className="textarea textarea-bordered"
              placeholder="Catatan tambahan tentang kondisi sapi..."
              rows={4}
              {...register("catatan_pemeriksaan")}
            />
          </div>
        </div>
      </div>

      {/* Health Score Preview */}
      {Object.keys(parameterStatus).length > 0 && (
        <div className="alert alert-info">
          <div>
            <h4 className="font-bold">Preview Analisis</h4>
            <div className="text-sm">
              Parameter Normal:{" "}
              {
                Object.values(parameterStatus).filter(
                  (p: any) =>
                    p.status === "normal" ||
                    p.status === "baik" ||
                    p.status === "aktif"
                ).length
              }{" "}
              dari {Object.keys(parameterStatus).length}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
            disabled={loading}
          >
            Batal
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Menyimpan...
            </>
          ) : initialData?.id ? (
            "Perbarui"
          ) : (
            "Simpan"
          )}
        </button>
      </div>
    </form>
  );
};

export default PemeriksaanSapiForm;
