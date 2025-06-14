/** @format */

// components/dashboard/Dashboard.tsx
"use client";

import React, { useEffect } from "react";
import {
  Users,
  Beef,
  Activity,
  Heart,
  AlertTriangle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { useDashboardStore } from "@/stores/api/dashboard";
import { StatsCard } from "./StatsCard";
import { DistributionChart } from "./DistributionChart";
import { TopOwners } from "./TopOwners";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { Button } from "@/components/UI/Button";

export const Dashboard: React.FC = () => {
  const { data, loading, error, fetchDashboardData, refreshData } =
    useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Error!</h3>
            <div className="text-xs">{error}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshData}
            loading={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-info">
          <AlertTriangle className="w-6 h-6" />
          <span>Data tidak tersedia</span>
        </div>
      </div>
    );
  }

  const { ringkasan } = data;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-base-content/70 mt-1">
            Ringkasan data dan statistik peternakan sapi
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <Calendar className="w-4 h-4" />
            <span>
              Terakhir diperbarui: {formatLastUpdated(data.last_updated)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            loading={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pemilik Aktif"
          value={ringkasan.total_pemilik_aktif}
          icon={Users}
          color="primary"
          description="Pemilik yang terdaftar"
        />
        <StatsCard
          title="Total Sapi Hidup"
          value={ringkasan.total_sapi_hidup}
          icon={Beef}
          color="success"
          description="Sapi yang masih hidup"
        />
        <StatsCard
          title="Sapi Sehat"
          value={ringkasan.sapi_sehat}
          icon={Heart}
          color="success"
          description="Kondisi kesehatan baik"
        />
        <StatsCard
          title="Sapi Sakit"
          value={ringkasan.sapi_sakit}
          icon={AlertTriangle}
          color="error"
          description="Memerlukan perhatian"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard
          title="Sapi Jantan"
          value={ringkasan.total_sapi_jantan}
          icon={Activity}
          color="info"
        />
        <StatsCard
          title="Sapi Betina"
          value={ringkasan.total_sapi_betina}
          icon={Activity}
          color="secondary"
        />
        <StatsCard
          title="Jenis Penyakit"
          value={ringkasan.total_jenis_penyakit}
          icon={AlertTriangle}
          color="warning"
        />
        <StatsCard
          title="Dalam Pengobatan"
          value={ringkasan.sapi_dalam_pengobatan}
          icon={Activity}
          color="warning"
        />
        <StatsCard
          title="Sapi Sembuh"
          value={ringkasan.sapi_sembuh}
          icon={Heart}
          color="success"
        />
        <StatsCard
          title="Sapi Mati"
          value={ringkasan.sapi_mati}
          icon={AlertTriangle}
          color="error"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopOwners data={data.top_pemilik} />
        <DistributionChart
          title="Distribusi Status Kesehatan"
          data={data.distribusi_status_kesehatan}
          dataKey="status_kesehatan"
          type="pie"
          colors={["#ef4444", "#10b981"]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart
          title="Distribusi Jenis Pemilik"
          data={data.distribusi_jenis_pemilik}
          dataKey="jenis_pemilik"
          type="bar"
          colors={["#2563eb", "#10b981", "#f59e0b"]}
        />
        <DistributionChart
          title="Distribusi Tingkat Bahaya"
          data={data.distribusi_tingkat_bahaya}
          dataKey="tingkat_bahaya"
          type="pie"
          colors={["#ef4444", "#f59e0b", "#10b981"]}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart
          title="Distribusi Jenis Kelamin"
          data={data.distribusi_jenis_kelamin}
          dataKey="jenkel"
          type="pie"
          colors={["#2563eb", "#8b5cf6"]}
        />
        {/* Age Distribution */}
        <DistributionChart
          title="Distribusi Umur Sapi"
          data={data.distribusi_umur_sapi}
          dataKey="kelompok_umur"
          type="bar"
          colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
        />
        {/* <TrendChart data={data.trend_registrasi} type="line" /> */}
      </div>
    </div>
  );
};
