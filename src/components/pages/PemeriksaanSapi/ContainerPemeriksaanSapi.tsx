/** @format */
// container untuk halaman pemeriksaan sapi
"use client";

import { useEffect, useState } from "react";
import { usePemeriksaanSapiStore } from "@/stores/crud/pemeriksaanSapiStore";
import PemeriksaanSapiCard from "@/components/pages/PemeriksaanSapi/PemeriksaanSapiCard";
import Modal from "@/components/UI/Modal";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import {
  PlusIcon,
  FunnelIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { PemeriksaanSapi } from "@/types";
import { useRouter } from "next/navigation";
import PemeriksaanSapiForm from "./PemeriksaanSapiForm";
import PemeriksaanSapiFilters from "./PemeriksaanSapiFilters";
import moment from "moment";

export default function ContainerPemeriksaanSapi() {
  const router = useRouter();
  const {
    pemeriksaanSapis,
    loading,
    deletePemeriksaanSapi,
    fetchPemeriksaanSapis,
    fetchLaporanHarian,
    fetchTrendMingguan,
    laporanHarian,
    trendMingguan,
  } = usePemeriksaanSapiStore();

  const [showForm, setShowForm] = useState(false);
  const [editingPemeriksaanSapi, setEditingPemeriksaanSapi] =
    useState<PemeriksaanSapi | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showLaporanHarian, setShowLaporanHarian] = useState(false);
  const [showTrendMingguan, setShowTrendMingguan] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [filters, setFilters] = useState({
    search: "",
    sapi: "",
    tanggal: "",
    ordering: "-tgl_pemeriksaan",
  });

  useEffect(() => {
    fetchPemeriksaanSapis(filters);
  }, [fetchPemeriksaanSapis, filters]);

  const handleView = (pemeriksaan: PemeriksaanSapi) => {
    router.push(`/admin/pemeriksaan/${pemeriksaan.id}`);
  };

  const handleEdit = (pemeriksaan: PemeriksaanSapi) => {
    setEditingPemeriksaanSapi(pemeriksaan);
    setShowForm(true);
  };

  const handleDelete = async (pemeriksaan: PemeriksaanSapi) => {
    if (
      confirm(
        `Yakin ingin menghapus data pemeriksaan tanggal ${moment(
          pemeriksaan.tgl_pemeriksaan
        ).format("DD/MM/YYYY")}?`
      )
    ) {
      await deletePemeriksaanSapi(pemeriksaan.id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPemeriksaanSapi(null);
    fetchPemeriksaanSapis(filters);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleShowLaporanHarian = () => {
    fetchLaporanHarian(selectedDate);
    setShowLaporanHarian(true);
  };

  const handleShowTrendMingguan = () => {
    fetchTrendMingguan();
    setShowTrendMingguan(true);
  };

  // Group pemeriksaan by date for better visualization
  const groupedPemeriksaan = pemeriksaanSapis.reduce((acc, pemeriksaan) => {
    const date = moment(pemeriksaan.tgl_pemeriksaan).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(pemeriksaan);
    return acc;
  }, {} as Record<string, PemeriksaanSapi[]>);

  // Quick stats
  const todayPemeriksaan = pemeriksaanSapis.filter(
    (p) =>
      moment(p.tgl_pemeriksaan).format("YYYY-MM-DD") ===
      moment().format("YYYY-MM-DD")
  );

  const gejalaCount = pemeriksaanSapis.reduce(
    (acc, p) => {
      if (p.batuk) acc.batuk++;
      if (p.sesak_napas) acc.sesak_napas++;
      if (p.diare) acc.diare++;
      if (p.muntah) acc.muntah++;
      if (p.lemas) acc.lemas++;
      if (p.demam) acc.demam++;
      return acc;
    },
    { batuk: 0, sesak_napas: 0, diare: 0, muntah: 0, lemas: 0, demam: 0 }
  );

  // Calculate average temperature, filtering out invalid values
  const validSuhu = pemeriksaanSapis.filter(
    (p) => typeof p.suhu_tubuh === "number" && !isNaN(p.suhu_tubuh)
  );
  const avgSuhu =
    validSuhu.length > 0
      ? (
          validSuhu.reduce((sum, p) => sum + p.suhu_tubuh, 0) / validSuhu.length
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pemeriksaan Sapi</h1>
          <p className="text-base-content/70 mt-1">
            Kelola data pemeriksaan kesehatan sapi
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input input-sm input-bordered"
            />
          </div>
          <button
            onClick={handleShowLaporanHarian}
            className="btn btn-outline btn-info btn-sm"
          >
            <DocumentChartBarIcon className="h-4 w-4" />
            Laporan Harian
          </button>
          <button
            onClick={handleShowTrendMingguan}
            className="btn btn-outline btn-warning btn-sm"
          >
            <ChartBarIcon className="h-4 w-4" />
            Trend Mingguan
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
            Tambah Pemeriksaan
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Pemeriksaan Hari Ini</div>
          <div className="stat-value text-primary">
            {todayPemeriksaan.length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Pemeriksaan</div>
          <div className="stat-value text-secondary">
            {pemeriksaanSapis.length}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Rata-rata Suhu</div>
          <div className="stat-value text-accent">{avgSuhu}°C</div>
        </div>
        <div className="stat">
          <div className="stat-title">Gejala Demam</div>
          <div className="stat-value text-error">{gejalaCount.demam}</div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <PemeriksaanSapiFilters
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
          {/* Pemeriksaan by Date */}
          {Object.keys(groupedPemeriksaan).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedPemeriksaan)
                .sort(
                  ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
                )
                .map(([date, pemeriksaans]) => (
                  <div key={date} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">
                          {moment(date).format("dddd, DD MMMM YYYY")}
                        </h2>
                        <span className="badge badge-primary">
                          {pemeriksaans.length} pemeriksaan
                        </span>
                      </div>

                      {date === moment().format("YYYY-MM-DD") && (
                        <span className="badge badge-success">Hari Ini</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pemeriksaans.map((pemeriksaan: PemeriksaanSapi) => (
                        <PemeriksaanSapiCard
                          key={pemeriksaan.id}
                          pemeriksaan={pemeriksaan}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentChartBarIcon className="h-16 w-16 mx-auto text-base-content/30 mb-4" />
              <p className="text-base-content/60 text-lg">
                Tidak ada data pemeriksaan
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary mt-4"
              >
                Tambah Pemeriksaan Pertama
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
          setEditingPemeriksaanSapi(null);
        }}
        title={
          editingPemeriksaanSapi
            ? "Edit Pemeriksaan Sapi"
            : "Tambah Pemeriksaan Sapi"
        }
        size="xl"
      >
        <PemeriksaanSapiForm
          initialData={editingPemeriksaanSapi || undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingPemeriksaanSapi(null);
          }}
        />
      </Modal>

      {/* Laporan Harian Modal */}
      <Modal
        isOpen={showLaporanHarian}
        onClose={() => setShowLaporanHarian(false)}
        title={`Laporan Pemeriksaan - ${moment(selectedDate).format(
          "DD MMMM YYYY"
        )}`}
        size="xl"
      >
        {laporanHarian && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Pemeriksaan</div>
                <div className="stat-value text-primary">
                  {laporanHarian.total_pemeriksaan}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Rata-rata Suhu</div>
                <div className="stat-value text-secondary">
                  {isNaN(laporanHarian.statistik_suhu.rata_rata)
                    ? "0"
                    : laporanHarian.statistik_suhu.rata_rata}
                  °C
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Jumlah Demam</div>
                <div className="stat-value text-error">
                  {laporanHarian.statistik_suhu.jumlah_demam}
                </div>
              </div>
            </div>

            {/* Distribusi Gejala */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title">Distribusi Gejala</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(laporanHarian.distribusi_gejala).map(
                    ([gejala, jumlah]) => (
                      <div key={gejala} className="stat bg-base-200 rounded">
                        <div className="stat-title capitalize">
                          {typeof gejala === "string"
                            ? gejala.replace("_", " ")
                            : gejala}
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

            {/* Detail Pemeriksaan */}
            {laporanHarian.pemeriksaan.length > 0 && (
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">
                    Detail Pemeriksaan ({laporanHarian.pemeriksaan.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Sapi</th>
                          <th>Suhu</th>
                          <th>Nafsu Makan</th>
                          <th>Aktivitas</th>
                          <th>Gejala</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanHarian.pemeriksaan.map(
                          (p: any, index: number) => (
                            <tr key={index}>
                              <td>{p.sapi_detail?.nm_sapi || p.sapi}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    p.suhu_tubuh > 39.5
                                      ? "badge-error"
                                      : p.suhu_tubuh < 38.0
                                      ? "badge-info"
                                      : "badge-success"
                                  }`}
                                >
                                  {isNaN(p.suhu_tubuh) ? "0" : p.suhu_tubuh}°C
                                </span>
                              </td>
                              <td>{p.nafsu_makan}/10</td>
                              <td>{p.aktivitas}/10</td>
                              <td>
                                <div className="flex flex-wrap gap-1">
                                  {p.batuk && (
                                    <span className="badge badge-xs badge-error">
                                      Batuk
                                    </span>
                                  )}
                                  {p.demam && (
                                    <span className="badge badge-xs badge-warning">
                                      Demam
                                    </span>
                                  )}
                                  {p.diare && (
                                    <span className="badge badge-xs badge-info">
                                      Diare
                                    </span>
                                  )}
                                  {p.lemas && (
                                    <span className="badge badge-xs badge-secondary">
                                      Lemas
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Trend Mingguan Modal */}
      <Modal
        isOpen={showTrendMingguan}
        onClose={() => setShowTrendMingguan(false)}
        title="Trend Pemeriksaan 7 Hari Terakhir"
        size="xl"
      >
        {trendMingguan && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Seminggu</div>
                <div className="stat-value text-primary">
                  {trendMingguan.total_seminggu}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Rata-rata Harian</div>
                <div className="stat-value text-secondary">
                  {isNaN(trendMingguan.rata_rata_harian)
                    ? "0"
                    : trendMingguan.rata_rata_harian}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Periode</div>
                <div className="stat-value text-sm">
                  {trendMingguan.periode}
                </div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h3 className="card-title">Trend Harian</h3>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Total Pemeriksaan</th>
                        <th>Rata-rata Suhu</th>
                        <th>Gejala Demam</th>
                        <th>Gejala Diare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendMingguan.trend_harian.map(
                        (trend: any, index: number) => (
                          <tr key={index}>
                            <td>{moment(trend.tanggal).format("DD/MM")}</td>
                            <td>
                              <span className="badge badge-primary">
                                {trend.total_pemeriksaan}
                              </span>
                            </td>
                            <td>
                              {isNaN(trend.rata_rata_suhu)
                                ? "0"
                                : trend.rata_rata_suhu}
                              °C
                            </td>
                            <td>
                              <span className="badge badge-error">
                                {trend.jumlah_gejala_demam}
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-warning">
                                {trend.jumlah_gejala_diare}
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
