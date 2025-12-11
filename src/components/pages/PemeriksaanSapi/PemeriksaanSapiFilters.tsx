/** @format */
// components/pages/PemeriksaanSapi/PemeriksaanSapiFilters.tsx

import { useState, useEffect, useMemo } from "react";
import FormInput from "@/components/Forms/FormInput";
import FormSelect from "@/components/Forms/FormSelect";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDataSapiStore } from "@/stores/crud/dataSapiStore";

interface PemeriksaanSapiFiltersProps {
  filters: {
    search: string;
    sapi: string;
    tanggal: string;
    ordering: string;
  };
  onFilterChange: (filters: any) => void;
  onClose: () => void;
  sapiList?: any[];
}

const PemeriksaanSapiFilters = ({
  filters,
  onFilterChange,
  onClose,
  sapiList,
}: PemeriksaanSapiFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const { dataSapi, fetchDataSapis } = useDataSapiStore();

  useEffect(() => {
    // Hanya fetch jika sapiList tidak disediakan
    if (!sapiList || sapiList.length === 0) {
      fetchDataSapis();
    }
  }, [fetchDataSapis, sapiList]);

  // Gunakan useMemo agar reactive terhadap perubahan dataSapi atau sapiList
  const sapiOptions = useMemo(() => {
    const sourceList = sapiList && sapiList.length > 0 ? sapiList : dataSapi;
    return [
      { value: "", label: "Semua Sapi" },
      ...sourceList
        .filter((sapi) => sapi && sapi.id) // Hanya filter sapi yang memiliki ID
        .map((sapi) => ({
          value: sapi.id,
          label: `${sapi.nm_sapi || `Sapi ${sapi.id.slice(0, 8)}`}${
            sapi.jenkel ? ` (${sapi.jenkel})` : ""
          }`,
        })),
    ];
  }, [dataSapi, sapiList]);

  const orderingOptions = [
    { value: "-tgl_pemeriksaan", label: "Terbaru Dulu" },
    { value: "tgl_pemeriksaan", label: "Terlama Dulu" },
    { value: "-suhu_tubuh", label: "Suhu Tertinggi" },
    { value: "suhu_tubuh", label: "Suhu Terendah" },
    { value: "-nafsu_makan", label: "Nafsu Makan Terbaik" },
    { value: "nafsu_makan", label: "Nafsu Makan Terburuk" },
    { value: "-aktivitas", label: "Aktivitas Tertinggi" },
    { value: "aktivitas", label: "Aktivitas Terendah" },
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
      sapi: "",
      tanggal: "",
      ordering: "-tgl_pemeriksaan",
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleDateRange = (range: string) => {
    const today = new Date();
    let startDate = "";

    switch (range) {
      case "today":
        startDate = today.toISOString().split("T")[0];
        break;
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString().split("T")[0];
        break;
      case "month":
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate = monthAgo.toISOString().split("T")[0];
        break;
      default:
        startDate = "";
    }

    handleInputChange("tanggal", startDate);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title">Filter Pemeriksaan Sapi</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormInput
            label="Cari"
            placeholder="Nama sapi atau catatan..."
            value={localFilters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />

          <FormSelect
            label="Sapi"
            options={sapiOptions}
            value={localFilters.sapi}
            onChange={(e) => handleInputChange("sapi", e.target.value)}
          />

          <FormInput
            label="Tanggal Sejak"
            type="date"
            value={localFilters.tanggal}
            onChange={(e) => handleInputChange("tanggal", e.target.value)}
          />

          <FormSelect
            label="Urutkan"
            options={orderingOptions}
            value={localFilters.ordering}
            onChange={(e) => handleInputChange("ordering", e.target.value)}
          />
        </div>

        {/* Quick Date Filters */}
        <div className="divider">Filter Cepat Tanggal</div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDateRange("today")}
            className="btn btn-sm btn-outline"
          >
            Hari Ini
          </button>
          <button
            onClick={() => handleDateRange("week")}
            className="btn btn-sm btn-outline"
          >
            7 Hari Terakhir
          </button>
          <button
            onClick={() => handleDateRange("month")}
            className="btn btn-sm btn-outline"
          >
            30 Hari Terakhir
          </button>
          <button
            onClick={() => handleInputChange("tanggal", "")}
            className="btn btn-sm btn-outline"
          >
            Semua Tanggal
          </button>
        </div>

        {/* Advanced Filters */}
        <div className="divider">Filter Lanjutan</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Hanya Demam (&gt;39.5°C)</span>
              <input
                type="checkbox"
                className="checkbox checkbox-error"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange("ordering", "-suhu_tubuh");
                  }
                }}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Nafsu Makan Buruk (&lt;7)</span>
              <input
                type="checkbox"
                className="checkbox checkbox-warning"
                onChange={() => {
                  // Would need backend support for complex filtering
                }}
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Ada Gejala Klinis</span>
              <input
                type="checkbox"
                className="checkbox checkbox-info"
                onChange={() => {
                  // Would need backend support for complex filtering
                }}
              />
            </label>
          </div>
        </div>

        {/* Parameter Range Filters */}
        <div className="divider">Filter Parameter</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label-text text-sm">Suhu Tubuh (°C)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                step="0.1"
                placeholder="Min"
                className="input input-sm input-bordered flex-1"
                onChange={() => {
                  // Custom range filtering would need backend support
                }}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Max"
                className="input input-sm input-bordered flex-1"
                onChange={() => {
                  // Custom range filtering would need backend support
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="label-text text-sm">Denyut Jantung (BPM)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                className="input input-sm input-bordered flex-1"
                onChange={() => {
                  // Custom range filtering would need backend support
                }}
              />
              <input
                type="number"
                placeholder="Max"
                className="input input-sm input-bordered flex-1"
                onChange={() => {
                  // Custom range filtering would need backend support
                }}
              />
            </div>
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

export default PemeriksaanSapiFilters;
