/** @format */

// app/fuzzy/parameter/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, RotateCcw, BarChart3 } from "lucide-react";
import { Button } from "@/components/UI/Button";
import ParameterTable from "@/components/Fuzzy/parameter/ParameterTable";
import ParameterModal from "@/components/Fuzzy/parameter/ParameterModal";
import { useParameterStore } from "@/stores/crud/parameterStore";

export default function ParameterFuzzyPage() {
  const {
    parameters,
    loading,
    pagination,
    filters,
    statistik,
    loadingStatistik,
    fetchParameters,
    fetchStatistik,
    deleteParameter,
    openModal,
    setFilters,
    resetFilters,
  } = useParameterStore();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [showStatistik, setShowStatistik] = useState(false);

  useEffect(() => {
    fetchParameters();
  }, [filters, fetchParameters]);

  useEffect(() => {
    if (showStatistik && !statistik) {
      fetchStatistik();
    }
  }, [showStatistik, statistik, fetchStatistik]);

  const handleSearch = () => {
    setFilters({ search: searchInput, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    resetFilters();
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleEdit = (parameter: any) => {
    openModal(true, parameter);
  };

  const handleDelete = async (id: string) => {
    await deleteParameter(id);
  };

  const handleAdd = () => {
    openModal(false);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Parameter Fuzzy
            </h1>
            <p className="text-base-content/70 mt-1">
              Kelola parameter input dan output untuk sistem fuzzy
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStatistik(!showStatistik)}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistik
            </Button>
            <Button variant="primary" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Parameter
            </Button>
          </div>
        </div>

        {/* Statistik Card */}
        {showStatistik && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Parameter</div>
              <div className="stat-value text-primary">
                {loadingStatistik ? "..." : statistik?.total_parameter || 0}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Parameter Aktif</div>
              <div className="stat-value text-success">
                {loadingStatistik ? "..." : statistik?.parameter_aktif || 0}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Parameter Input</div>
              <div className="stat-value text-info">
                {loadingStatistik
                  ? "..."
                  : statistik?.distribusi_tipe?.input || 0}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Parameter Output</div>
              <div className="stat-value text-warning">
                {loadingStatistik
                  ? "..."
                  : statistik?.distribusi_tipe?.output || 0}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-base-100 rounded-lg border p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="join w-full">
                <input
                  type="text"
                  className="input input-bordered join-item flex-1"
                  placeholder="Cari parameter..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  className="join-item"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Type Filter */}
            <select
              className="select select-bordered w-48"
              value={filters.tipe}
              onChange={(e) => setFilters({ tipe: e.target.value, page: 1 })}
            >
              <option value="">Semua Tipe</option>
              <option value="input">Input</option>
              <option value="output">Output</option>
            </select>

            {/* Status Filter */}
            <select
              className="select select-bordered w-48"
              value={filters.aktif === null ? "" : filters.aktif.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({
                  aktif: value === "" ? null : value === "true",
                  page: 1,
                });
              }}
            >
              <option value="">Semua Status</option>
              <option value="true">Aktif</option>
              <option value="false">Non-aktif</option>
            </select>

            {/* Reset Filters */}
            <Button variant="ghost" onClick={handleResetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded-lg border overflow-hidden">
        <ParameterTable
          data={parameters}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {pagination && pagination.count > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                Menampilkan {parameters.length} dari {pagination.count} data
              </div>
              <div className="join">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={!pagination.previous || loading}
                  className="join-item"
                >
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="join-item">
                  {filters.page}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={!pagination.next || loading}
                  className="join-item"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && parameters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-base-content/50 mb-4">
              {filters.search || filters.tipe || filters.aktif !== null
                ? "Tidak ada parameter yang sesuai dengan filter"
                : "Belum ada parameter fuzzy"}
            </div>
            {!filters.search && !filters.tipe && filters.aktif === null && (
              <Button variant="primary" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Parameter Pertama
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <ParameterModal />
    </div>
  );
}
