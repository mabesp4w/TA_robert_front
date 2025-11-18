/** @format */
// components/pages/Pemilik/PemilikForm.tsx
import { useForm } from "react-hook-form";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import { Pemilik } from "@/types";
import { useEffect } from "react";

interface PemilikFormProps {
  initialData?: Partial<Pemilik>;
  onSuccess?: (data: Pemilik) => void;
  onCancel?: () => void;
}

const PemilikForm = ({
  initialData,
  onSuccess,
  onCancel,
}: PemilikFormProps) => {
  const { createPemilik, updatePemilik, loading } = usePemilikStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<Pemilik>();

  // Watch jenis_pemilik untuk conditional validation
  const jenisPemilik = watch("jenis_pemilik");

  useEffect(() => {
    if (initialData) {
      setValue("nm_pemilik", initialData?.nm_pemilik || "");
      setValue("email", initialData?.email || "");
      setValue("no_hp", initialData?.no_hp || "");
      setValue("alamat", initialData?.alamat || "");
      setValue("jenis_pemilik", initialData?.jenis_pemilik || "perorangan");
      setValue("max_sapi", initialData?.max_sapi || 10);
      setValue("status_aktif", initialData?.status_aktif ?? true);
      setValue("tgl_registrasi", initialData?.tgl_registrasi || "");
      setValue("catatan", initialData?.catatan || "");
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: Partial<Pemilik>) => {
    const success = initialData?.id
      ? await updatePemilik(initialData.id, data as Pemilik)
      : await createPemilik(data as Pemilik);

    if (success) {
      reset();
      onSuccess?.(data as Pemilik);
    }
  };

  const jenisPemilikOptions = [
    { value: "perorangan", label: "Perorangan" },
    { value: "kelompok", label: "Kelompok" },
    { value: "koperasi", label: "Koperasi" },
    { value: "perusahaan", label: "Perusahaan" },
  ];

  const statusAktifOptions = [
    { value: "true", label: "Aktif" },
    { value: "false", label: "Non-Aktif" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Nama Pemilik */}
      <FormInput
          label="Nama Pemilik"
          placeholder="Masukkan nama pemilik"
          {...register("nm_pemilik", {
            required: "Nama pemilik harus diisi",
          })}
          error={errors.nm_pemilik?.message}
      />

      {/* Email dan No HP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="Masukkan email"
          {...register("email", {
            required: "Email harus diisi",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Format email tidak valid",
            },
          })}
          error={errors.email?.message}
        />

        <FormInput
          label="No. HP"
          type="tel"
          placeholder="Masukkan nomor HP"
          {...register("no_hp", {
            required: "Nomor HP harus diisi",
            pattern: {
              value: /^[0-9+\-\s()]+$/,
              message: "Format nomor HP tidak valid",
            },
          })}
          error={errors.no_hp?.message}
        />
      </div>

      {/* Alamat */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Alamat <span className="text-error">*</span>
          </span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Masukkan alamat lengkap..."
          rows={3}
          {...register("alamat", {
            required: "Alamat harus diisi",
          })}
        />
        {errors.alamat && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.alamat.message}
            </span>
          </label>
        )}
      </div>

      {/* Jenis Pemilik dan Max Sapi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Jenis Pemilik"
          required
          options={jenisPemilikOptions}
          {...register("jenis_pemilik", {
            required: "Jenis pemilik harus dipilih",
          })}
          error={errors.jenis_pemilik?.message}
        />

        <FormInput
          label="Maksimal Sapi"
          type="number"
          required
          placeholder="Jumlah maksimal sapi"
          {...register("max_sapi", {
            required: "Maksimal sapi harus diisi",
            min: {
              value: 1,
              message: "Minimal 1 sapi",
            },
            max: {
              value:
                jenisPemilik === "perorangan"
                  ? 50
                  : jenisPemilik === "kelompok"
                  ? 100
                  : jenisPemilik === "koperasi"
                  ? 200
                  : 500,
              message: `Maksimal untuk ${jenisPemilik} adalah ${
                jenisPemilik === "perorangan"
                  ? 50
                  : jenisPemilik === "kelompok"
                  ? 100
                  : jenisPemilik === "koperasi"
                  ? 200
                  : 500
              } sapi`,
            },
          })}
          error={errors.max_sapi?.message}
        />
      </div>

      {/* Tanggal Registrasi dan Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Tanggal Registrasi"
          type="date"
          required
          {...register("tgl_registrasi", {
            required: "Tanggal registrasi harus diisi",
          })}
          error={errors.tgl_registrasi?.message}
        />

        <FormSelect
          label="Status"
          required
          options={statusAktifOptions}
          {...register("status_aktif", {
            required: "Status harus dipilih",
            setValueAs: (value) => value === "true",
          })}
          error={errors.status_aktif?.message}
        />
      </div>

      {/* Catatan */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Catatan</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Catatan tambahan..."
          rows={3}
          {...register("catatan")}
        />
        {errors.catatan && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.catatan.message}
            </span>
          </label>
        )}
      </div>

      {/* Info Kapasitas berdasarkan jenis */}
      {jenisPemilik && (
        <div className="alert alert-info">
          <div>
            <h3 className="font-bold">Info Kapasitas {jenisPemilik}:</h3>
            <div className="text-xs">
              {jenisPemilik === "perorangan" && "Maksimal 50 sapi"}
              {jenisPemilik === "kelompok" && "Maksimal 100 sapi"}
              {jenisPemilik === "koperasi" && "Maksimal 200 sapi"}
              {jenisPemilik === "perusahaan" && "Maksimal 500 sapi"}
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

export default PemilikForm;
