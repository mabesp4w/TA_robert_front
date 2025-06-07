/** @format */

// app/fuzzy/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings,
  Sliders,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/UI/Button";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import {
  parameterFuzzyCRUD,
  fungsiKeanggotaanCRUD,
  aturanFuzzyCRUD,
} from "@/services/fuzzyService";

interface DashboardStats {
  parameters: {
    total: number;
    aktif: number;
    input: number;
    output: number;
  };
  fungsi: {
    total: number;
    aktif: number;
    triangular: number;
    trapezoidal: number;
    gaussian: number;
  };
  aturan: {
    total: number;
    aktif: number;
    rataRataBobot: number;
    penyakitTercakup: number;
  };
}

export default function FuzzyDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all statistics in parallel
      const [paramStats, fungsiStats, aturanStats] = await Promise.all([
        parameterFuzzyCRUD.getStatistik(),
        fungsiKeanggotaanCRUD.getStatistik(),
        aturanFuzzyCRUD.getStatistik(),
      ]);

      setStats({
        parameters: {
          total: paramStats.results?.total_parameter || 0,
          aktif: paramStats.results?.parameter_aktif || 0,
          input: paramStats.results?.distribusi_tipe?.input || 0,
          output: paramStats.results?.distribusi_tipe?.output || 0,
        },
        fungsi: {
          total: fungsiStats.results?.total_fungsi || 0,
          aktif: fungsiStats.results?.fungsi_aktif || 0,
          triangular: fungsiStats.results?.distribusi_tipe_fungsi?.trimf || 0,
          trapezoidal: fungsiStats.results?.distribusi_tipe_fungsi?.trapmf || 0,
          gaussian: fungsiStats.results?.distribusi_tipe_fungsi?.gaussmf || 0,
        },
        aturan: {
          total: aturanStats.results?.total_aturan || 0,
          aktif: aturanStats.results?.aturan_aktif || 0,
          rataRataBobot: aturanStats.results?.statistik_bobot?.rata_rata || 0,
          penyakitTercakup:
            aturanStats.results?.distribusi_penyakit?.length || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  const getSystemHealthStatus = () => {
    if (!stats)
      return { status: "unknown", message: "Tidak dapat memuat data" };

    const hasParameters = stats.parameters.total > 0;
    const hasFungsi = stats.fungsi.total > 0;
    const hasAturan = stats.aturan.total > 0;

    if (hasParameters && hasFungsi && hasAturan) {
      const activeRatio =
        (stats.parameters.aktif + stats.fungsi.aktif + stats.aturan.aktif) /
        (stats.parameters.total + stats.fungsi.total + stats.aturan.total);

      if (activeRatio > 0.8) {
        return { status: "excellent", message: "Sistem berjalan optimal" };
      } else if (activeRatio > 0.6) {
        return { status: "good", message: "Sistem berjalan baik" };
      } else {
        return { status: "warning", message: "Beberapa komponen tidak aktif" };
      }
    } else {
      return { status: "incomplete", message: "Sistem belum lengkap" };
    }
  };

  const systemHealth = getSystemHealthStatus();

  const quickActions = [
    {
      title: "Tambah Parameter",
      description: "Buat parameter fuzzy baru",
      href: "/admin/fuzzy/parameter",
      icon: Settings,
      color: "btn-primary",
    },
    {
      title: "Atur Fungsi",
      description: "Definisikan fungsi keanggotaan",
      href: "/admin/fuzzy/fungsi-keanggotaan",
      icon: Sliders,
      color: "btn-secondary",
    },
    {
      title: "Buat Aturan",
      description: "Tambah aturan inferensi",
      href: "/admin/fuzzy/aturan",
      icon: GitBranch,
      color: "btn-accent",
    },
  ];

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="bg-base-100 rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Status Sistem Fuzzy</h2>
          <div
            className={`badge ${
              systemHealth.status === "excellent"
                ? "badge-success"
                : systemHealth.status === "good"
                ? "badge-success"
                : systemHealth.status === "warning"
                ? "badge-warning"
                : "badge-error"
            }`}
          >
            {systemHealth.status === "excellent" && (
              <CheckCircle className="w-4 h-4 mr-1" />
            )}
            {systemHealth.status === "good" && (
              <CheckCircle className="w-4 h-4 mr-1" />
            )}
            {systemHealth.status === "warning" && (
              <AlertCircle className="w-4 h-4 mr-1" />
            )}
            {systemHealth.status === "incomplete" && (
              <AlertCircle className="w-4 h-4 mr-1" />
            )}
            {systemHealth.message}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Parameters Card */}
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-primary">
              <Settings className="w-8 h-8" />
            </div>
            <div className="stat-title">Parameter Fuzzy</div>
            <div className="stat-value text-primary">
              {stats?.parameters.total || 0}
            </div>
            <div className="stat-desc">
              {stats?.parameters.aktif || 0} aktif dari{" "}
              {stats?.parameters.total || 0} total
            </div>
          </div>

          {/* Functions Card */}
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-secondary">
              <Sliders className="w-8 h-8" />
            </div>
            <div className="stat-title">Fungsi Keanggotaan</div>
            <div className="stat-value text-secondary">
              {stats?.fungsi.total || 0}
            </div>
            <div className="stat-desc">
              {stats?.fungsi.aktif || 0} aktif dari {stats?.fungsi.total || 0}{" "}
              total
            </div>
          </div>

          {/* Rules Card */}
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-accent">
              <GitBranch className="w-8 h-8" />
            </div>
            <div className="stat-title">Aturan Fuzzy</div>
            <div className="stat-value text-accent">
              {stats?.aturan.total || 0}
            </div>
            <div className="stat-desc">
              {stats?.aturan.aktif || 0} aktif dari {stats?.aturan.total || 0}{" "}
              total
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parameter Details */}
        <div className="bg-base-100 rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Detail Parameter</h3>
            <Link href="/fuzzy/parameter">
              <Button size="sm" variant="outline">
                Kelola <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Parameter Input:</span>
              <span className="badge badge-primary">
                {stats?.parameters.input || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Parameter Output:</span>
              <span className="badge badge-secondary">
                {stats?.parameters.output || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Status Aktif:</span>
              <span className="badge badge-success">
                {stats?.parameters.aktif || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Non-aktif:</span>
              <span className="badge badge-error">
                {(stats?.parameters.total || 0) -
                  (stats?.parameters.aktif || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Function Details */}
        <div className="bg-base-100 rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Detail Fungsi</h3>
            <Link href="/fuzzy/fungsi-keanggotaan">
              <Button size="sm" variant="outline">
                Kelola <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Triangular:</span>
              <span className="badge badge-info">
                {stats?.fungsi.triangular || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Trapezoidal:</span>
              <span className="badge badge-warning">
                {stats?.fungsi.trapezoidal || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Gaussian:</span>
              <span className="badge badge-accent">
                {stats?.fungsi.gaussian || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Status Aktif:</span>
              <span className="badge badge-success">
                {stats?.fungsi.aktif || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Overview */}
      <div className="bg-base-100 rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Overview Aturan Fuzzy</h3>
          <Link href="/fuzzy/aturan">
            <Button size="sm" variant="outline">
              Kelola <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="stat-value text-2xl text-primary">
              {stats?.aturan.total || 0}
            </div>
            <div className="stat-desc">Total Aturan</div>
          </div>
          <div className="text-center">
            <div className="stat-value text-2xl text-success">
              {stats?.aturan.aktif || 0}
            </div>
            <div className="stat-desc">Aturan Aktif</div>
          </div>
          <div className="text-center">
            <div className="stat-value text-2xl text-accent">
              {stats?.aturan.rataRataBobot
                ? `${(stats.aturan.rataRataBobot * 100).toFixed(0)}%`
                : "0%"}
            </div>
            <div className="stat-desc">Rata-rata Bobot</div>
          </div>
          <div className="text-center">
            <div className="stat-value text-2xl text-warning">
              {stats?.aturan.penyakitTercakup || 0}
            </div>
            <div className="stat-desc">Penyakit Tercakup</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} href={action.href}>
                <div className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
                  <div className="card-body p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6 text-primary" />
                      <h4 className="font-semibold">{action.title}</h4>
                    </div>
                    <p className="text-sm text-base-content/70">
                      {action.description}
                    </p>
                    <div className="card-actions justify-end mt-3">
                      <Button size="sm" variant="outline">
                        <Plus className="w-4 h-4 mr-1" />
                        Buat
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
