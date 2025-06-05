/** @format */

"use client";

import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface DashboardStatsProps {
  stats: {
    total_sapi: number;
    total_pemeriksaan: number;
    pemeriksaan_hari_ini: number;
    prediksi_akurat: number;
    sapi_perlu_periksa: number;
    akurasi_sistem: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statItems = [
    {
      title: "Total Sapi",
      value: stats.total_sapi,
      icon: UserGroupIcon,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Pemeriksaan",
      value: stats.total_pemeriksaan,
      icon: ClipboardDocumentListIcon,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Pemeriksaan Hari Ini",
      value: stats.pemeriksaan_hari_ini,
      icon: ChartBarIcon,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Akurasi Sistem",
      value: `${stats.akurasi_sistem}%`,
      icon: ChartBarIcon,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Perlu Pemeriksaan",
      value: stats.sapi_perlu_periksa,
      icon: ExclamationTriangleIcon,
      color: stats.sapi_perlu_periksa > 0 ? "text-warning" : "text-success",
      bgColor: stats.sapi_perlu_periksa > 0 ? "bg-warning/10" : "bg-success/10",
    },
  ];

  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
      {statItems.map((item, index) => (
        <div key={index} className="stat">
          <div className="stat-figure">
            <div
              className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center`}
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
          </div>
          <div className="stat-title">{item.title}</div>
          <div className={`stat-value text-2xl ${item.color}`}>
            {typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value}
          </div>
          <div className="stat-desc">
            {item.title === "Perlu Pemeriksaan" && stats.sapi_perlu_periksa > 0
              ? "Perlu perhatian"
              : "Update terbaru"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
