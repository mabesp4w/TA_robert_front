/** @format */
// components/pages/DataSapi/DataSapiForm.tsx
import { useForm } from "react-hook-form";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { useDataSapiStore } from "@/stores/crud/dataSapiStore";
import { DataSapi } from "@/types";
import { useEffect } from "react";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DataSapi>();

  useEffect(() => {
    if (initialData) {
      setValue("nm_sapi", initialData?.nm_sapi || "");
      setValue("jenkel", initialData?.jenkel || "jantan");
      setValue("umur_bulan", initialData?.umur_bulan || 0);
      setValue("berat_kg", initialData?.berat_kg || 0);
      setValue("status_kesehatan", initialData?.status_kesehatan || "sehat");
      setValue("tgl_registrasi", initialData?.tgl_registrasi || "");
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: Partial<DataSapi>) => {
    const success = initialData?.id
      ? await updateDataSapi(initialData.id, data as DataSapi)
      : await createDataSapi(data as DataSapi);

    if (success) {
      reset();
      onSuccess?.(data as DataSapi);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Nama Sapi"
        placeholder="Masukkan nama sapi"
        {...register("nm_sapi", {
          required: "Nama sapi harus diisi",
        })}
        error={errors.nm_sapi?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Jenis Kelamin"
          required
          options={jenkelOptions}
          {...register("jenkel", {
            required: "Jenis kelamin harus dipilih",
          })}
          error={errors.jenkel?.message}
        />

        <FormSelect
          label="Status Kesehatan"
          required
          options={statusKesehatanOptions}
          {...register("status_kesehatan", {
            required: "Status kesehatan harus dipilih",
          })}
          error={errors.status_kesehatan?.message}
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
          error={errors.umur_bulan?.message}
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
          error={errors.berat_kg?.message}
        />
      </div>

      <FormInput
        label="Tanggal Registrasi"
        type="date"
        required
        {...register("tgl_registrasi", {
          required: "Tanggal registrasi harus diisi",
        })}
        error={errors.tgl_registrasi?.message}
      />

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
