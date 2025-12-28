/** @format */
// jenis penyakit form
import { useForm } from "react-hook-form";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { useJenisPenyakitStore } from "@/stores/crud/JenisPenyakitStore";
import { JenisPenyakit } from "@/types";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/services/baseURL";

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

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.gambar_url || 
    (initialData?.gambar ? `${BASE_URL}${initialData.gambar}` : null)
  );

  console.log({ initialData });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<JenisPenyakit>();

  useEffect(() => {
    if (initialData) {
      setValue("nm_penyakit", initialData?.nm_penyakit || "");
      setValue("deskripsi", initialData?.deskripsi || "");
      setValue("tingkat_bahaya", initialData?.tingkat_bahaya || "ringan");
      setValue("gejala_umum", initialData?.gejala_umum || "");
      setValue("pengobatan", initialData?.pengobatan || "");
      setValue("pencegahan", initialData?.pencegahan || "");
      // Set preview image dari gambar_url atau gambar
      if (initialData.gambar_url) {
        setPreviewImage(initialData.gambar_url);
      } else if (initialData.gambar) {
        setPreviewImage(`${BASE_URL}${initialData.gambar}`);
      }
    }
  }, [initialData, setValue]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Partial<JenisPenyakit>) => {
    // Jika ada gambar yang dipilih, gunakan FormData
    if (selectedImage) {
      const formData = new FormData();
      formData.append("nm_penyakit", data.nm_penyakit || "");
      formData.append("deskripsi", data.deskripsi || "");
      formData.append("tingkat_bahaya", data.tingkat_bahaya || "ringan");
      formData.append("gejala_umum", data.gejala_umum || "");
      if (data.pengobatan) formData.append("pengobatan", data.pengobatan);
      if (data.pencegahan) formData.append("pencegahan", data.pencegahan);
      formData.append("gambar", selectedImage);

      const success = initialData?.id
        ? await updateJenisPenyakit(initialData.id, formData as any)
        : await createJenisPenyakit(formData as any);

      if (success) {
        reset();
        setSelectedImage(null);
        setPreviewImage(null);
        onSuccess?.(data as JenisPenyakit);
      }
    } else {
      // Jika tidak ada gambar baru, kirim data biasa
    const success = initialData?.id
      ? await updateJenisPenyakit(initialData.id, data as JenisPenyakit)
      : await createJenisPenyakit(data as JenisPenyakit);

    if (success) {
      reset();
      onSuccess?.(data as JenisPenyakit);
      }
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

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="label">
          <span className="label-text">Gambar Penyakit</span>
        </label>
        <div className="flex flex-col gap-4">
          {previewImage && (
            <div className="relative w-full max-w-xs">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border-2 border-base-300"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full max-w-xs"
          />
          <p className="text-sm text-base-content/70">
            Format: JPG, PNG, atau GIF. Maksimal 5MB.
          </p>
        </div>
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
