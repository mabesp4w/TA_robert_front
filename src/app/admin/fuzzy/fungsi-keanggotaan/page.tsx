/** @format */

// app/fuzzy/fungsi-keanggotaan/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, RotateCcw, BarChart3 } from "lucide-react";
import { Button } from "@/components/UI/Button";
import FungsiTable from "@/components/Fuzzy/fungsi-keanggotaan/FungsiTable";
import FungsiModal from "@/components/Fuzzy/fungsi-keanggotaan/FungsiModal";
import { useFungsiStore } from "@/stores/crud/fungsiStore";

export default function FungsiKeanggotaanPage() {
  const {
    fungsiList,
    loading,
    pagination,
    filters,
    statistik,
    loadingStatistik,
    parameterChoices,
    fetchFungsiList,
    fetchStatistik,
    fetchParameterChoices,
    deleteFungsi,
    openModal,
    setFilters,
    resetFilters,
  } = useFungsiStore();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [showStatistik, setShowStatistik] = useState(false);

  useEffect(() => {
    fetchFungsiList();
    fetchParameterChoices();
  }, [filters, fetchFungsiList, fetchParameterChoices]);

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

  const handleEdit = (fungsi: any) => {
    openModal(true, fungsi);
  };

  const handleDelete = async (id: string) => {
    await deleteFungsi(id);
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
              Fungsi Keanggotaan
            </h1>
            <p className="text-base-content/70 mt-1">
              Kelola fungsi keanggotaan untuk setiap parameter fuzzy
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
              Tambah Fungsi
            </Button>
          </div>
        </div>

        {/* Statistik Card */}
        {showStatistik && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Fungsi</div>
              <div className="stat-value text-primary">
                {loadingStatistik ? "..." : statistik?.total_fungsi || 0}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Fungsi Aktif</div>
              <div className="stat-value text-success">
                {loadingStatistik ? "..." : statistik?.fungsi_aktif || 0}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Triangular</div>
              <div className="stat-value text-info">
                {loadingStatistik
                  ? "..."
                  : statistik?.distribusi_tipe_fungsi?.trimf || 0}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Trapezoidal</div>
              <div className="stat-value text-warning">
                {loadingStatistik
                  ? "..."
                  : statistik?.distribusi_tipe_fungsi?.trapmf || 0}
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
                  placeholder="Cari fungsi keanggotaan..."
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

            {/* Parameter Filter */}
            <select
              className="select select-bordered w-56"
              value={filters.parameter}
              onChange={(e) =>
                setFilters({ parameter: e.target.value, page: 1 })
              }
            >
              <option value="">Semua Parameter</option>
              {parameterChoices.map((param) => (
                <option key={param.id} value={param.id}>
                  {param.nama_parameter} ({param.tipe})
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              className="select select-bordered w-48"
              value={filters.tipe_fungsi}
              onChange={(e) =>
                setFilters({ tipe_fungsi: e.target.value, page: 1 })
              }
            >
              <option value="">Semua Tipe Fungsi</option>
              <option value="trimf">Triangular</option>
              <option value="trapmf">Trapezoidal</option>
              <option value="gaussmf">Gaussian</option>
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
        <FungsiTable
          data={fungsiList}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {pagination && pagination.count > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                Menampilkan {fungsiList.length} dari {pagination.count} data
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
        {!loading && fungsiList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-base-content/50 mb-4">
              {filters.search ||
              filters.parameter ||
              filters.tipe_fungsi ||
              filters.aktif !== null
                ? "Tidak ada fungsi keanggotaan yang sesuai dengan filter"
                : "Belum ada fungsi keanggotaan"}
            </div>
            {!filters.search &&
              !filters.parameter &&
              !filters.tipe_fungsi &&
              filters.aktif === null && (
                <Button variant="primary" onClick={handleAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Fungsi Pertama
                </Button>
              )}
          </div>
        )}
      </div>

      {/* Modal */}
      <FungsiModal />
    </div>
  );
}
