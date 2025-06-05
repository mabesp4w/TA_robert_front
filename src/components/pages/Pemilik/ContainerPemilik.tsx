/** @format */
// container untuk halaman pemilik
"use client";

import { useEffect, useState } from "react";
import { usePemilikStore } from "@/stores/crud/pemilikStore";
import PemilikCard from "@/components/pages/Pemilik/PemilikCard";
import Modal from "@/components/UI/Modal";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import {
  PlusIcon,
  FunnelIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Pemilik } from "@/types";
import { useRouter } from "next/navigation";
import PemilikForm from "./PemilikForm";
import PemilikFilters from "./PemilikFilters";

export default function ContainerPemilik() {
  const router = useRouter();
  const {
    pemiliks,
    loading,
    deletePemilik,
    nonaktifkanPemilik,
    aktifkanPemilik,
    fetchPemiliks,
    fetchStatistikUmum,
    fetchPemilikPerluPerhatian,
    statistikUmum,
    pemilikPerluPerhatian,
  } = usePemilikStore();

  const [showForm, setShowForm] = useState(false);
  const [editingPemilik, setEditingPemilik] = useState<Pemilik | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStatistik, setShowStatistik] = useState(false);
  const [showPerluPerhatian, setShowPerluPerhatian] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    jenis_pemilik: "",
    status_aktif: undefined as boolean | undefined,
    ordering: "-tgl_registrasi",
  });

  useEffect(() => {
    fetchPemiliks(filters);
  }, [fetchPemiliks, filters]);

  const handleView = (pemilik: Pemilik) => {
    router.push(`/admin/pemilik/${pemilik.id}`);
  };

  const handleEdit = (pemilik: Pemilik) => {
    setEditingPemilik(pemilik);
    setShowForm(true);
  };

  const handleDelete = async (pemilik: Pemilik) => {
    if (
      confirm(`Yakin ingin menghapus pemilik ${pemilik.nm_pemilik || "ini"}?`)
    ) {
      await deletePemilik(pemilik.id);
    }
  };

  const handleToggleStatus = async (pemilik: Pemilik) => {
    const action = pemilik.status_aktif ? "nonaktifkan" : "aktifkan";
    if (confirm(`Yakin ingin ${action} pemilik ${pemilik.nm_pemilik}?`)) {
      if (pemilik.status_aktif) {
        await nonaktifkanPemilik(pemilik.id);
      } else {
        await aktifkanPemilik(pemilik.id);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPemilik(null);
    fetchPemiliks(filters);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleShowStatistik = () => {
    fetchStatistikUmum();
    setShowStatistik(true);
  };

  const handleShowPerluPerhatian = () => {
    fetchPemilikPerluPerhatian();
    setShowPerluPerhatian(true);
  };

  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case "tinggi":
  //       return "text-error";
  //     case "sedang":
  //       return "text-warning";
  //     case "rendah":
  //       return "text-info";
  //     default:
  //       return "text-base-content";
  //   }
  // };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return "badge-error";
      case "sedang":
        return "badge-warning";
      case "rendah":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Data Pemilik</h1>
          <p className="text-base-content/70 mt-1">
            Kelola data pemilik sapi dalam sistem
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleShowPerluPerhatian}
            className="btn btn-outline btn-warning btn-sm"
          >
            <ExclamationTriangleIcon className="h-4 w-4" />
            Perlu Perhatian
          </button>
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
            Tambah Pemilik
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <PemilikFilters
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
          {/* Pemilik Grid */}
          {pemiliks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pemiliks.map((pemilik: Pemilik) => (
                <PemilikCard
                  key={pemilik.id}
                  pemilik={pemilik}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-base-content/60 text-lg">
                Tidak ada data pemilik
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-4"
              >
                Tambah Pemilik Pertama
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
          setEditingPemilik(null);
        }}
        title={editingPemilik ? "Edit Data Pemilik" : "Tambah Data Pemilik"}
        size="xl"
      >
        <PemilikForm
          initialData={editingPemilik || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingPemilik(null);
          }}
        />
      </Modal>

      {/* Statistik Modal */}
      <Modal
        isOpen={showStatistik}
        onClose={() => setShowStatistik(false)}
        title="Statistik Umum Pemilik"
        size="xl"
      >
        {statistikUmum && (
          <div className="space-y-6">
            {/* Total Pemilik */}
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Pemilik</div>
                <div className="stat-value text-primary">
                  {statistikUmum.total_pemilik}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Aktif</div>
                <div className="stat-value text-success">
                  {statistikUmum.pemilik_aktif}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Non-Aktif</div>
                <div className="stat-value text-error">
                  {statistikUmum.pemilik_nonaktif}
                </div>
              </div>
            </div>

            {/* Distribusi Jenis */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Distribusi Jenis Pemilik</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(statistikUmum.distribusi_jenis).map(
                    ([jenis, jumlah]) => (
                      <div key={jenis} className="stat bg-base-200 rounded-lg">
                        <div className="stat-title capitalize">{jenis}</div>
                        <div className="stat-value text-sm">
                          {jumlah as number}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Total Sapi */}
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Sapi Seluruh Pemilik</div>
                <div className="stat-value text-accent">
                  {statistikUmum.total_sapi_seluruh_pemilik}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Rata-rata Max Sapi</div>
                <div className="stat-value text-warning">
                  {statistikUmum.rata_rata_max_sapi_per_pemilik}
                </div>
              </div>
            </div>

            {/* Pemilik Hampir Penuh */}
            {statistikUmum.pemilik_hampir_penuh_kapasitas.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Pemilik Hampir Penuh Kapasitas</h3>
                  <div className="space-y-2">
                    {statistikUmum.pemilik_hampir_penuh_kapasitas.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-base-200 rounded"
                        >
                          <span>{item.pemilik.nm_pemilik}</span>
                          <span className="badge badge-warning">
                            {item.persentase_kapasitas}%
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Perlu Perhatian Modal */}
      <Modal
        isOpen={showPerluPerhatian}
        onClose={() => setShowPerluPerhatian(false)}
        title="Pemilik yang Perlu Perhatian"
        size="xl"
      >
        {pemilikPerluPerhatian.length > 0 ? (
          <div className="space-y-4">
            {pemilikPerluPerhatian.map((item: any, index: number) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="card-title">{item.pemilik.nm_pemilik}</h3>
                      <p className="text-sm text-base-content/70">
                        {item.pemilik.kd_pemilik} - {item.pemilik.jenis_pemilik}
                      </p>
                    </div>
                    <div
                      className={`badge ${getPriorityBadge(
                        item.tingkat_prioritas
                      )} badge-lg`}
                    >
                      Prioritas {item.tingkat_prioritas}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Masalah:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {item.masalah.map((masalah: string, i: number) => (
                        <li key={i} className="text-sm">
                          {masalah}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <span className="text-sm">
                      Kapasitas: {item.persentase_kapasitas}%
                    </span>
                    <button
                      onClick={() => handleView(item.pemilik)}
                      className="btn btn-sm btn-primary"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/60">
              Tidak ada pemilik yang perlu perhatian khusus
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
