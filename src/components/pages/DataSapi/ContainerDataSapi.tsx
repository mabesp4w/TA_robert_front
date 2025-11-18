/** @format */
// container untuk halaman data sapi
"use client";

import { useEffect, useState } from "react";
import { useDataSapiStore } from "@/stores/crud/dataSapiStore";
import DataSapiCard from "@/components/pages/DataSapi/DataSapiCard";
import Modal from "@/components/UI/Modal";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import {
  PlusIcon,
  FunnelIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { DataSapi } from "@/types";
import { useRouter } from "next/navigation";
import DataSapiForm from "./DataSapiForm";
import DataSapiFilters from "./DataSapiFilters";

export default function ContainerDataSapi() {
  const router = useRouter();
  const {
    dataSapi,
    loading,
    deleteDataSapi,
    fetchDataSapis,
    fetchStatistikPopulasi,
    statistik,
  } = useDataSapiStore();

  const [showForm, setShowForm] = useState(false);
  const [editingDataSapi, setEditingDataSapi] = useState<DataSapi | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStatistik, setShowStatistik] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    jenkel: "",
    status_kesehatan: "",
    ordering: "-tgl_registrasi",
  });

  useEffect(() => {
    fetchDataSapis(filters);
  }, [fetchDataSapis, filters]);

  const handleView = (sapi: DataSapi) => {
    router.push(`/admin/data-sapi/${sapi.id}`);
  };

  const handleEdit = (sapi: DataSapi) => {
    // Gunakan data yang sudah ada di list, tidak perlu fetch ulang
    setEditingDataSapi(sapi);
    setShowForm(true);
  };

  const handleDelete = async (sapi: DataSapi) => {
    if (confirm(`Yakin ingin menghapus data sapi ${sapi.nm_sapi || "ini"}?`)) {
      await deleteDataSapi(sapi.id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingDataSapi(null);
    fetchDataSapis(filters);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleShowStatistik = () => {
    fetchStatistikPopulasi();
    setShowStatistik(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Data Sapi</h1>
          <p className="text-base-content/70 mt-1">
            Kelola data sapi dalam sistem
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleShowStatistik}
            className="btn btn-outline btn-sm"
          >
            <ChartBarIcon className="h-4 w-4" />
            Statistik
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline btn-sm"
          >
            <FunnelIcon className="h-4 w-4" />
            Filter
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Tambah Sapi
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <DataSapiFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Data Sapi Grid */}
          {dataSapi.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataSapi.map((sapi: DataSapi) => (
                <DataSapiCard
                  key={sapi.id}
                  sapi={sapi}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-base-content/60 text-lg">
                Tidak ada data sapi
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-4"
              >
                Tambah Sapi Pertama
              </button>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingDataSapi(null);
        }}
        title={editingDataSapi ? "Edit Data Sapi" : "Tambah Data Sapi"}
        size="lg"
      >
        <DataSapiForm
          initialData={editingDataSapi || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingDataSapi(null);
          }}
        />
      </Modal>

      {/* Statistik Modal */}
      <Modal
        isOpen={showStatistik}
        onClose={() => setShowStatistik(false)}
        title="Statistik Populasi Sapi"
        size="xl"
      >
        {statistik && (
          <div className="space-y-6">
            {/* Total Sapi */}
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Sapi</div>
                <div className="stat-value text-primary">
                  {statistik.total_sapi}
                </div>
              </div>
            </div>

            {/* Distribusi Kelamin */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Distribusi Kelamin</h3>
                <div className="stats">
                  <div className="stat">
                    <div className="stat-title">Jantan</div>
                    <div className="stat-value text-info">
                      {statistik.distribusi_kelamin.jantan}
                    </div>
                    <div className="stat-desc">
                      {statistik.distribusi_kelamin.persentase_jantan}%
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Betina</div>
                    <div className="stat-value text-secondary">
                      {statistik.distribusi_kelamin.betina}
                    </div>
                    <div className="stat-desc">
                      {statistik.distribusi_kelamin.persentase_betina}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Kesehatan */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Distribusi Status Kesehatan</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(statistik.distribusi_status_kesehatan).map(
                    ([status, jumlah]) => (
                      <div key={status} className="stat bg-base-200 rounded-lg">
                        <div className="stat-title capitalize">
                          {status.replace("_", " ")}
                        </div>
                        <div className="stat-value text-sm">
                          {jumlah as number}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Rata-rata */}
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Rata-rata Umur</div>
                <div className="stat-value text-accent">
                  {statistik.rata_rata_umur_bulan}
                </div>
                <div className="stat-desc">bulan</div>
              </div>
              <div className="stat">
                <div className="stat-title">Rata-rata Berat</div>
                <div className="stat-value text-warning">
                  {statistik.rata_rata_berat_kg}
                </div>
                <div className="stat-desc">kg</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
