/** @format */
// components/pages/DataSapi/DataSapiFilters.tsx

import { useState } from "react";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DataSapiFiltersProps {
  filters: {
    search: string;
    jenkel: string;
    status_kesehatan: string;
    ordering: string;
  };
  onFilterChange: (filters: any) => void;
  onClose: () => void;
}

const DataSapiFilters = ({
  filters,
  onFilterChange,
  onClose,
}: DataSapiFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const jenkelOptions = [
    { value: "", label: "Semua Jenis Kelamin" },
    { value: "jantan", label: "Jantan" },
    { value: "betina", label: "Betina" },
  ];

  const statusKesehatanOptions = [
    { value: "", label: "Semua Status Kesehatan" },
    { value: "sehat", label: "Sehat" },
    { value: "sakit", label: "Sakit" },
    { value: "dalam_pengobatan", label: "Dalam Pengobatan" },
    { value: "sembuh", label: "Sembuh" },
  ];

  const orderingOptions = [
    { value: "-tgl_registrasi", label: "Terbaru Dulu" },
    { value: "tgl_registrasi", label: "Terlama Dulu" },
    { value: "nm_sapi", label: "Nama A-Z" },
    { value: "-nm_sapi", label: "Nama Z-A" },
    { value: "umur_bulan", label: "Umur Termuda" },
    { value: "-umur_bulan", label: "Umur Tertua" },
    { value: "berat_kg", label: "Berat Teringan" },
    { value: "-berat_kg", label: "Berat Terberat" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: "",
      jenkel: "",
      status_kesehatan: "",
      ordering: "-tgl_registrasi",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">Filter Data Sapi</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormInput
            label="Cari Nama Sapi"
            placeholder="Masukkan nama sapi..."
            value={localFilters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />

          <FormSelect
            label="Jenis Kelamin"
            options={jenkelOptions}
            value={localFilters.jenkel}
            onChange={(e) => handleInputChange("jenkel", e.target.value)}
          />

          <FormSelect
            label="Status Kesehatan"
            options={statusKesehatanOptions}
            value={localFilters.status_kesehatan}
            onChange={(e) =>
              handleInputChange("status_kesehatan", e.target.value)
            }
          />

          <FormSelect
            label="Urutkan"
            options={orderingOptions}
            value={localFilters.ordering}
            onChange={(e) => handleInputChange("ordering", e.target.value)}
          />
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

export default DataSapiFilters;
