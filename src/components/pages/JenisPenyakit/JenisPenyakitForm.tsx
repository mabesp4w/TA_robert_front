/** @format */
// jenis penyakit form
import { useForm } from "react-hook-form";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { useJenisPenyakitStore } from "@/stores/crud/JenisPenyakitStore";
import { JenisPenyakit } from "@/types";
import { useEffect } from "react";

interface JenisPenyakitFormProps {
  initialData?: Partial<JenisPenyakit>;
  onSuccess?: (data: JenisPenyakit) => void;
  onCancel?: () => void;
}

const JenisPenyakitForm = ({
  initialData,
  onSuccess,
  onCancel,
}: JenisPenyakitFormProps) => {
  const { createJenisPenyakit, updateJenisPenyakit, loading } =
    useJenisPenyakitStore();

  console.log({ initialData });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<JenisPenyakit>();

  useEffect(() => {
    if (initialData) {
      setValue("nm_penyakit", initialData?.nm_penyakit || "");
      setValue("deskripsi", initialData?.deskripsi || "");
      setValue("tingkat_bahaya", initialData?.tingkat_bahaya || "ringan");
      setValue("gejala_umum", initialData?.gejala_umum || "");
      setValue("pengobatan", initialData?.pengobatan || "");
      setValue("pencegahan", initialData?.pencegahan || "");
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: Partial<JenisPenyakit>) => {
    const success = initialData?.id
      ? await updateJenisPenyakit(initialData.id, data as JenisPenyakit)
      : await createJenisPenyakit(data as JenisPenyakit);

    if (success) {
      reset();
      onSuccess?.(data as JenisPenyakit);
    }
  };

  const statusOptions = [
    { value: "ringan", label: "Ringan" },
    { value: "sedang", label: "Sedang" },
    { value: "berat", label: "Berat" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Nama Jenis Penyakit"
        placeholder="Masukkan nama jenis penyakit"
        {...register("nm_penyakit", {
          required: "Nama jenis penyakit harus diisi",
        })}
        error={errors.nm_penyakit?.message}
      />

      <FormSelect
        label="Tingkat Bahaya"
        required
        options={statusOptions}
        {...register("tingkat_bahaya", {
          required: "Tingkat bahaya harus dipilih",
        })}
        error={errors.tingkat_bahaya?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Gejala Umum"
          type="text"
          required
          placeholder="Gejala umum"
          {...register("gejala_umum", {
            required: "Gejala umum harus diisi",
          })}
          error={errors.gejala_umum?.message}
        />

        <FormInput
          label="Pengobatan"
          type="text"
          required
          placeholder="Pengobatan"
          {...register("pengobatan", {
            required: "Pengobatan harus diisi",
          })}
          error={errors.pengobatan?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Pencegahan"
          type="text"
          required
          placeholder="Pencegahan"
          {...register("pencegahan", {
            required: "Pencegahan harus diisi",
          })}
          error={errors.pencegahan?.message}
        />

        <FormInput
          label="Deskripsi"
          type="text"
          required
          placeholder="Deskripsi"
          {...register("deskripsi", {
            required: "Deskripsi harus diisi",
          })}
          error={errors.deskripsi?.message}
        />
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

export default JenisPenyakitForm;
