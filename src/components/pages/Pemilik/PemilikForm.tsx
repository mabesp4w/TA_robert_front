/** @format */
// components/pages/Pemilik/PemilikForm.tsx
import { useForm } from "react-hook-form";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import { Pemilik } from "@/types";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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
  const [showPassword, setShowPassword] = useState(false);

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
    // Hapus password dari data saat update (password disabled, tidak bisa diubah)
    const submitData = { ...data };
    if (initialData?.id) {
      delete submitData.password;
    }

    const success = initialData?.id
      ? await updatePemilik(initialData.id, submitData as Pemilik)
      : await createPemilik(submitData as Pemilik);

    if (success) {
      reset();
      onSuccess?.(submitData as Pemilik);
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

      {/* Password - hanya untuk create atau update jika diisi */}
      {!initialData?.id && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">
              Password <span className="text-error">*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password untuk akun login"
              className={`input input-bordered w-full pr-12 ${
                errors.password ? "input-error" : ""
              }`}
              {...register("password", {
                required: !initialData?.id ? "Password harus diisi" : false,
                minLength: {
                  value: 6,
                  message: "Password minimal 6 karakter",
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.password.message}
              </span>
            </label>
          )}
          {!errors.password && (
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Password akan digunakan untuk login akun pemilik
              </span>
            </label>
          )}
        </div>
      )}

      {initialData?.id && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password tidak dapat diubah"
              disabled
              className={`input input-bordered w-full pr-12 input-disabled ${
                errors.password ? "input-error" : ""
              }`}
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password minimal 6 karakter",
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-300" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-300" />
              )}
            </button>
          </div>
          {!errors.password && (
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Password tidak dapat diubah melalui form ini. Lihat password di halaman detail pemilik.
              </span>
            </label>
          )}
        </div>
      )}

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
