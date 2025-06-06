/** @format */

// app/fuzzy/aturan/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Plus, Search, RotateCcw, BarChart3 } from "lucide-react";
import { Button } from "@/components/UI/Button";
import AturanTable from "@/components/Fuzzy/aturan/AturanTable";
import AturanModal from "@/components/Fuzzy/aturan/AturanModal";
import TestRuleModal from "@/components/Fuzzy/aturan/TestRuleModal";
import { useAturanStore } from "@/stores/crud/aturanStore";

export default function AturanFuzzyPage() {
  const {
    aturanList,
    loading,
    pagination,
    filters,
    statistik,
    loadingStatistik,
    penyakitChoices,
    fetchAturanList,
    fetchStatistik,
    fetchPenyakitChoices,
    deleteAturan,
    openModal,
    openTestModal,
    setFilters,
    resetFilters,
  } = useAturanStore();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [showStatistik, setShowStatistik] = useState(false);

  useEffect(() => {
    fetchAturanList();
    fetchPenyakitChoices();
  }, [filters, fetchAturanList, fetchPenyakitChoices]);

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

  const handleEdit = (aturan: any) => {
    openModal(true, aturan);
  };

  const handleDelete = async (id: string) => {
    await deleteAturan(id);
  };

  const handleTest = (aturan: any) => {
    openTestModal(aturan);
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
              Aturan Fuzzy
            </h1>
            <p className="text-base-content/70 mt-1">
              Kelola aturan-aturan untuk sistem inferensi fuzzy
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
              Tambah Aturan
            </Button>
          </div>
        </div>

        {/* Statistik Card */}
        {showStatistik && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Total Aturan</div>
              <div className="stat-value text-primary">
                {loadingStatistik ? "..." : statistik?.total_aturan || 0}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Aturan Aktif</div>
              <div className="stat-value text-success">
                {loadingStatistik ? "..." : statistik?.aturan_aktif || 0}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Rata-rata Bobot</div>
              <div className="stat-value text-info">
                {loadingStatistik
                  ? "..."
                  : statistik?.statistik_bobot?.rata_rata
                  ? `${(statistik.statistik_bobot.rata_rata * 100).toFixed(0)}%`
                  : "0%"}
              </div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Penyakit Tercakup</div>
              <div className="stat-value text-warning">
                {loadingStatistik
                  ? "..."
                  : statistik?.distribusi_penyakit?.length || 0}
              </div>
            </div>
          </div>
        )}

        {/* Distribusi Penyakit */}
        {showStatistik && statistik?.distribusi_penyakit && (
          <div className="bg-base-100 rounded-lg border p-4 mb-6">
            <h3 className="font-semibold mb-3">
              Distribusi Aturan per Penyakit
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {statistik.distribusi_penyakit.slice(0, 6).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-base-200 rounded"
                >
                  <span className="text-sm font-medium truncate">
                    {item.penyakit}
                  </span>
                  <span className="badge badge-primary">
                    {item.jumlah_aturan}
                  </span>
                </div>
              ))}
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
                  placeholder="Cari aturan..."
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

            {/* Penyakit Filter */}
            <select
              className="select select-bordered w-56"
              value={filters.penyakit}
              onChange={(e) =>
                setFilters({ penyakit: e.target.value, page: 1 })
              }
            >
              <option value="">Semua Penyakit</option>
              {penyakitChoices.map((penyakit) => (
                <option key={penyakit.id} value={penyakit.id}>
                  {penyakit.nm_penyakit}
                </option>
              ))}
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
        <AturanTable
          data={aturanList}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTest={handleTest}
        />

        {/* Pagination */}
        {pagination && pagination.count > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-base-content/70">
                Menampilkan {aturanList.length} dari {pagination.count} data
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
        {!loading && aturanList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-base-content/50 mb-4">
              {filters.search || filters.penyakit || filters.aktif !== null
                ? "Tidak ada aturan yang sesuai dengan filter"
                : "Belum ada aturan fuzzy"}
            </div>
            {!filters.search && !filters.penyakit && filters.aktif === null && (
              <Button variant="primary" onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Aturan Pertama
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AturanModal />
      <TestRuleModal />
    </div>
  );
}
