/** @format */
// components/pages/DataSapi/DataSapiForm.tsx
import { useForm } from "react-hook-form";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { useDataSapiStore } from "@/stores/crud/dataSapiStore";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import { DataSapi } from "@/types";
import { useEffect, useState } from "react";

interface DataSapiFormProps {
  initialData?: Partial<DataSapi>;
  onSuccess?: (data: DataSapi) => void;
  onCancel?: () => void;
}

const DataSapiForm = ({
  initialData,
  onSuccess,
  onCancel,
}: DataSapiFormProps) => {
  const { createDataSapi, updateDataSapi, loading } = useDataSapiStore();
  const { pemiliks, fetchPemiliks, loading: loadingPemilik } = usePemilikStore();
  const [generatedNoSapi, setGeneratedNoSapi] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<any>();

  // Generate no_sapi dan tgl_registrasi otomatis berdasarkan tanggal
  useEffect(() => {
    if (!initialData?.id) {
      // Hanya generate untuk create baru
      const generateNoSapi = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const dateStr = `${year}${month}${day}`;
        
        // Generate dengan format YYYYMMDD-XXX (XXX adalah urutan)
        // Untuk sementara kita gunakan timestamp untuk memastikan unique
        const timestamp = Date.now().toString().slice(-4);
        const noSapi = `${dateStr}-${timestamp}`;
        
        setGeneratedNoSapi(noSapi);
        setValue("no_sapi", noSapi);
      };
      
      // Set tgl_registrasi otomatis ke hari ini
      const setTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const todayStr = `${year}-${month}-${day}`;
        setValue("tgl_registrasi", todayStr);
      };
      
      generateNoSapi();
      setTodayDate();
    }
  }, [initialData?.id, setValue]);

  // Fetch pemilik saat component mount
  useEffect(() => {
    fetchPemiliks({ status_aktif: true });
  }, [fetchPemiliks]);

  useEffect(() => {
    if (initialData) {
      // Handle pemilik - bisa berupa string ID atau object dengan id
      const pemilikId = typeof initialData.pemilik === 'string' 
        ? initialData.pemilik 
        : (initialData.pemilik as any)?.id || initialData.pemilik_detail?.id || "";
      
      // Set no_sapi untuk edit
      if (initialData?.no_sapi) {
        setGeneratedNoSapi(initialData.no_sapi);
        setValue("no_sapi", initialData.no_sapi);
      }
      
      setValue("nm_sapi", initialData?.nm_sapi || "");
      setValue("pemilik", pemilikId);
      setValue("jenkel", initialData?.jenkel || "jantan");
      setValue("umur_bulan", initialData?.umur_bulan || 0);
      setValue("berat_kg", initialData?.berat_kg || 0);
      setValue("status_kesehatan", initialData?.status_kesehatan || "sehat");
      
      // Set tgl_registrasi untuk edit - format dari ISO string ke YYYY-MM-DD
      if (initialData?.tgl_registrasi) {
        const tglRegistrasi = new Date(initialData.tgl_registrasi);
        const year = tglRegistrasi.getFullYear();
        const month = String(tglRegistrasi.getMonth() + 1).padStart(2, "0");
        const day = String(tglRegistrasi.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        setValue("tgl_registrasi", formattedDate);
      }
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: Partial<DataSapi>) => {
    // Pastikan no_sapi terkirim jika belum ada di data
    if (!data.no_sapi && generatedNoSapi) {
      data.no_sapi = generatedNoSapi;
    }

    // Untuk edit, hapus tgl_registrasi karena readonly (backend akan menggunakan auto_now_add)
    // Untuk create, tetap kirim tgl_registrasi (meskipun backend mungkin mengabaikannya jika auto_now_add)
    const submitData = { ...data };
    if (initialData?.id) {
      // Edit mode: jangan kirim tgl_registrasi karena readonly
      delete submitData.tgl_registrasi;
    }

    const success = initialData?.id
      ? await updateDataSapi(initialData.id, submitData as DataSapi)
      : await createDataSapi(submitData as DataSapi);

    if (success) {
      reset();
      onSuccess?.(submitData as DataSapi);
    }
  };

  const jenkelOptions = [
    { value: "jantan", label: "Jantan" },
    { value: "betina", label: "Betina" },
  ];

  const statusKesehatanOptions = [
    { value: "sehat", label: "Sehat" },
    { value: "sakit", label: "Sakit" },
    { value: "dalam_pengobatan", label: "Dalam Pengobatan" },
    { value: "sembuh", label: "Sembuh" },
  ];

  // Prepare pemilik options
  const pemilikOptions = pemiliks.map((pemilik) => ({
    value: pemilik.id,
    label: `${pemilik.nm_pemilik} (${pemilik.jenis_pemilik})`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* No Sapi - Auto Generated (readonly saat edit) */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">
            Nomor Sapi
            <span className="text-error ml-1">*</span>
          </span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full bg-base-200"
          value={generatedNoSapi || ""}
          readOnly
          {...(register("no_sapi" as any, {
            required: "Nomor sapi harus diisi",
            value: generatedNoSapi,
          }) as any)}
        />
        {errors.no_sapi && (
          <label className="label">
            <span className="label-text-alt text-error">
              {(errors.no_sapi as any)?.message}
            </span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            {initialData?.id 
              ? "Nomor sapi tidak dapat diubah" 
              : "Nomor sapi otomatis di-generate berdasarkan tanggal (format: YYYYMMDD-XXXX)"}
          </span>
        </label>
      </div>

      {/* Pemilik - Required */}
      <FormSelect
        label="Pemilik"
        required
        options={pemilikOptions}
        disabled={loadingPemilik}
        {...register("pemilik", {
          required: "Pemilik harus dipilih",
        })}
        error={(errors.pemilik as any)?.message}
      />

      <FormInput
        label="Nama Sapi"
        placeholder="Masukkan nama sapi (opsional)"
        {...register("nm_sapi")}
        error={(errors.nm_sapi as any)?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Jenis Kelamin"
          required
          options={jenkelOptions}
          {...register("jenkel", {
            required: "Jenis kelamin harus dipilih",
          })}
          error={(errors.jenkel as any)?.message}
        />

        <FormSelect
          label="Status Kesehatan"
          required
          options={statusKesehatanOptions}
          {...register("status_kesehatan", {
            required: "Status kesehatan harus dipilih",
          })}
          error={(errors.status_kesehatan as any)?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Umur (Bulan)"
          type="number"
          required
          placeholder="Umur dalam bulan"
          {...register("umur_bulan", {
            required: "Umur harus diisi",
            min: {
              value: 0,
              message: "Umur tidak boleh negatif",
            },
          })}
          error={(errors.umur_bulan as any)?.message}
        />

        <FormInput
          label="Berat (Kg)"
          type="number"
          step="0.1"
          required
          placeholder="Berat dalam kg"
          {...register("berat_kg", {
            required: "Berat harus diisi",
            min: {
              value: 0,
              message: "Berat tidak boleh negatif",
            },
          })}
          error={(errors.berat_kg as any)?.message}
        />
      </div>

      {/* Tanggal Registrasi - Auto filled untuk create, readonly untuk edit */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">
            Tanggal Registrasi
            <span className="text-error ml-1">*</span>
          </span>
        </label>
        <input
          type="date"
          className={`input input-bordered w-full ${initialData?.id ? 'bg-base-200' : ''}`}
          readOnly={!!initialData?.id}
          {...register("tgl_registrasi", {
            required: "Tanggal registrasi harus diisi",
          })}
        />
        {errors.tgl_registrasi && (
          <label className="label">
            <span className="label-text-alt text-error">
              {(errors.tgl_registrasi as any)?.message}
            </span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            {initialData?.id 
              ? "Tanggal registrasi tidak dapat diubah" 
              : "Tanggal registrasi otomatis diisi dengan hari ini"}
          </span>
        </label>
      </div>

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

export default DataSapiForm;
