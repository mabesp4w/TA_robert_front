/** @format */
// components/pages/Pemilik/PemilikFilters.tsx

import { useState } from "react";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface PemilikFiltersProps {
  filters: {
    search: string;
    jenis_pemilik: string;
    status_aktif: boolean | undefined;
    ordering: string;
  };
  onFilterChange: (filters: any) => void;
  onClose: () => void;
}

const PemilikFilters = ({
  filters,
  onFilterChange,
  onClose,
}: PemilikFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const jenisPemilikOptions = [
    { value: "", label: "Semua Jenis Pemilik" },
    { value: "perorangan", label: "Perorangan" },
    { value: "kelompok", label: "Kelompok" },
    { value: "koperasi", label: "Koperasi" },
    { value: "perusahaan", label: "Perusahaan" },
  ];

  const statusAktifOptions = [
    { value: "", label: "Semua Status" },
    { value: "true", label: "Aktif" },
    { value: "false", label: "Non-Aktif" },
  ];

  const orderingOptions = [
    { value: "-tgl_registrasi", label: "Terbaru Dulu" },
    { value: "tgl_registrasi", label: "Terlama Dulu" },
    { value: "nm_pemilik", label: "Nama A-Z" },
    { value: "-nm_pemilik", label: "Nama Z-A" },
    { value: "kd_pemilik", label: "Kode A-Z" },
    { value: "-kd_pemilik", label: "Kode Z-A" },
    { value: "max_sapi", label: "Kapasitas Terendah" },
    { value: "-max_sapi", label: "Kapasitas Tertinggi" },
  ];

  const handleInputChange = (field: string, value: string) => {
    let processedValue: any = value;

    // Convert status_aktif string to boolean
    if (field === "status_aktif") {
      processedValue = value === "" ? undefined : value === "true";
    }

    setLocalFilters((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: "",
      jenis_pemilik: "",
      status_aktif: undefined as boolean | undefined,
      ordering: "-tgl_registrasi",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">Filter Data Pemilik</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormInput
            label="Cari Pemilik"
            placeholder="Nama, kode, email, atau HP..."
            value={localFilters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />

          <FormSelect
            label="Jenis Pemilik"
            options={jenisPemilikOptions}
            value={localFilters.jenis_pemilik}
            onChange={(e) => handleInputChange("jenis_pemilik", e.target.value)}
          />

          <FormSelect
            label="Status"
            options={statusAktifOptions}
            value={
              localFilters.status_aktif === undefined
                ? ""
                : localFilters.status_aktif.toString()
            }
            onChange={(e) => handleInputChange("status_aktif", e.target.value)}
          />

          <FormSelect
            label="Urutkan"
            options={orderingOptions}
            value={localFilters.ordering}
            onChange={(e) => handleInputChange("ordering", e.target.value)}
          />
        </div>

        {/* Advanced Filters */}
        <div className="divider">Filter Lanjutan</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Hanya Kapasitas `80%</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                onChange={() => {
                  // This would need additional logic in the backend
                  // For now, just show the UI
                }}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Ada Sapi Sakit</span>
              <input
                type="checkbox"
                className="checkbox checkbox-warning"
                onChange={() => {
                  // This would need additional logic in the backend
                }}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Perlu Perhatian</span>
              <input
                type="checkbox"
                className="checkbox checkbox-error"
                onChange={() => {
                  // This would need additional logic in the backend
                }}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleResetFilters}
            className="btn btn-outline btn-sm"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="btn btn-primary btn-sm"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default PemilikFilters;
