/** @format */
// container untuk halaman pemeriksaan sapi - khusus pemilik
"use client";

import { useEffect, useState } from "react";
import { usePemeriksaanSapiStore } from "@/stores/crud/pemeriksaanSapiStore";
import { useAuthStore } from "@/stores/auth/authStore";
import { pemilikCRUD } from "@/services/crudService";
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
import { PemeriksaanSapi, DataSapi, Pemilik } from "@/types";
import { useRouter } from "next/navigation";
import PemeriksaanSapiForm from "./PemeriksaanSapiForm";
import PemeriksaanSapiFilters from "./PemeriksaanSapiFilters";
import moment from "moment";
import toast from "react-hot-toast";

export default function ContainerPemeriksaanSapiPemilik() {
  const router = useRouter();
  const { user } = useAuthStore();
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
  const [sapiList, setSapiList] = useState<DataSapi[]>([]);
  const [loadingPemilik, setLoadingPemilik] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    sapi: "",
    tanggal: "",
    ordering: "-tgl_pemeriksaan",
  });

  // Fetch pemilik profile dan daftar sapi
  useEffect(() => {
    const fetchPemilikData = async () => {
      if (!user) return;

      try {
        setLoadingPemilik(true);
        const pemilikResponse = await pemilikCRUD.getMyProfile();
        // Extract Pemilik dari DetailResponse
        const pemilikData: Pemilik | null = pemilikResponse.results || null;
        const currentPemilikId = pemilikData?.id;

        if (!currentPemilikId) {
          console.error("Pemilik ID not found");
          setLoadingPemilik(false);
          return;
        }

        // Ambil daftar sapi milik pemilik
        const sapiResponse = await pemilikCRUD.getDaftarSapi(currentPemilikId);
        const sapiData = sapiResponse.results?.daftar_sapi || 
                        sapiResponse.results || 
                        sapiResponse || 
                        [];
        setSapiList(Array.isArray(sapiData) ? sapiData : []);
      } catch (error: any) {
        console.error("Error fetching pemilik data:", error);
        toast.error("Gagal mengambil data pemilik");
      } finally {
        setLoadingPemilik(false);
      }
    };

    fetchPemilikData();
  }, [user]);

  // Fetch pemeriksaan - filter berdasarkan sapi milik pemilik
  useEffect(() => {
    if (sapiList.length > 0) {
      // Fetch pemeriksaan untuk semua sapi milik pemilik
      // Kita akan filter di frontend karena API mungkin tidak support filter multiple sapi
      fetchPemeriksaanSapis({
        ...filters,
        // Jika ada filter sapi spesifik, gunakan itu, jika tidak ambil semua
        sapi: filters.sapi || undefined,
      });
    }
  }, [fetchPemeriksaanSapis, filters, sapiList]);

  // Filter pemeriksaan hanya untuk sapi milik pemilik
  const filteredPemeriksaan = pemeriksaanSapis.filter((pemeriksaan) => {
    // Cek apakah sapi dari pemeriksaan ada di daftar sapi milik pemilik
    const sapiId = typeof pemeriksaan.sapi === 'string' 
      ? pemeriksaan.sapi 
      : (pemeriksaan.sapi as any)?.id || (pemeriksaan.sapi_detail as any)?.id;
    
    return sapiList.some((sapi) => sapi.id === sapiId);
  });

  const handleView = (pemeriksaan: PemeriksaanSapi) => {
    router.push(`/pemilik/pemeriksaan/${pemeriksaan.id}`);
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
      // Refresh list
      if (sapiList.length > 0) {
        fetchPemeriksaanSapis(filters);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPemeriksaanSapi(null);
    if (sapiList.length > 0) {
      fetchPemeriksaanSapis(filters);
    }
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
  const groupedPemeriksaan = filteredPemeriksaan.reduce((acc, pemeriksaan) => {
    const date = moment(pemeriksaan.tgl_pemeriksaan).format("YYYY-MM-DD");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(pemeriksaan);
    return acc;
  }, {} as Record<string, PemeriksaanSapi[]>);

  // Quick stats
  const todayPemeriksaan = filteredPemeriksaan.filter(
    (p) =>
      moment(p.tgl_pemeriksaan).format("YYYY-MM-DD") ===
      moment().format("YYYY-MM-DD")
  );

  const gejalaCount = filteredPemeriksaan.reduce(
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

  // Calculate average temperature
  const validSuhu = filteredPemeriksaan.filter(
    (p) => typeof p.suhu_tubuh === "number" && !isNaN(p.suhu_tubuh)
  );
  const avgSuhu =
    validSuhu.length > 0
      ? (
          validSuhu.reduce((sum, p) => sum + p.suhu_tubuh, 0) / validSuhu.length
        ).toFixed(1)
      : "0";

  if (loadingPemilik) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pemeriksaan Sapi</h1>
          <p className="text-base-content/70 mt-1">
            Kelola data pemeriksaan kesehatan sapi Anda
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
            disabled={sapiList.length === 0}
          >
            <PlusIcon className="h-4 w-4" />
            Tambah Pemeriksaan
          </button>
        </div>
      </div>

      {sapiList.length === 0 && (
        <div className="alert alert-warning">
          <span>Anda belum memiliki sapi. Silakan tambah sapi terlebih dahulu.</span>
          <button
            onClick={() => router.push("/pemilik/sapi")}
            className="btn btn-sm btn-primary"
          >
            Tambah Sapi
          </button>
        </div>
      )}

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
            {filteredPemeriksaan.length}
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
          sapiList={sapiList}
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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pemeriksaans.map((pemeriksaan) => (
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
              <p className="text-base-content/60 text-lg">
                Belum ada data pemeriksaan
              </p>
              {sapiList.length > 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary mt-4"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Tambah Pemeriksaan Pertama
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      {showForm && (
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
          size="lg"
        >
          <PemeriksaanSapiForm
            initialData={editingPemeriksaanSapi || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingPemeriksaanSapi(null);
            }}
            sapiList={sapiList}
            disableSapiSelect={false}
          />
        </Modal>
      )}

      {/* Laporan Harian Modal */}
      {showLaporanHarian && laporanHarian && (
        <Modal
          isOpen={showLaporanHarian}
          onClose={() => setShowLaporanHarian(false)}
          title={`Laporan Harian - ${moment(selectedDate).format("DD MMMM YYYY")}`}
          size="xl"
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Sapi</th>
                    <th>Waktu</th>
                    <th>Suhu</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanHarian.results?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.sapi?.nm_sapi || item.sapi?.no_sapi || "-"}</td>
                      <td>
                        {moment(item.tgl_pemeriksaan).format("HH:mm")}
                      </td>
                      <td>{item.suhu_tubuh}°C</td>
                      <td>
                        <span className="badge badge-sm">
                          {item.status_pemeriksaan || "completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {/* Trend Mingguan Modal */}
      {showTrendMingguan && trendMingguan && (
        <Modal
          isOpen={showTrendMingguan}
          onClose={() => setShowTrendMingguan(false)}
          title="Trend Pemeriksaan Mingguan"
          size="xl"
        >
          <div className="space-y-4">
            {trendMingguan.results && (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>Jumlah Pemeriksaan</th>
                      <th>Rata-rata Suhu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendMingguan.results.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>{moment(item.tanggal).format("DD MMM YYYY")}</td>
                        <td>{item.jumlah_pemeriksaan}</td>
                        <td>{item.rata_rata_suhu}°C</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

