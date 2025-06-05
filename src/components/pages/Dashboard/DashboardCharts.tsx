/** @format */

"use client";

import { DashboardStats } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardChartsProps {
  stats: DashboardStats;
}

const DashboardCharts = ({ stats }: DashboardChartsProps) => {
  // Prepare data for trend chart
  const trendData = stats.trend_pemeriksaan_7_hari.map((item) => ({
    tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    }),
    jumlah: item.jumlah,
  }));

  // Prepare data for status chart
  const statusData = stats.distribusi_status_kesehatan.map((item) => ({
    name: item.status_kesehatan,
    value: item.jumlah,
  }));

  const statusColors = {
    sehat: "#10b981",
    sakit: "#ef4444",
    dalam_pengobatan: "#f59e0b",
    sembuh: "#3b82f6",
  };

  return (
    <div className="space-y-6">
      {/* Trend Pemeriksaan */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Trend Pemeriksaan 7 Hari Terakhir</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tanggal" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Status Kesehatan */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Distribusi Status Kesehatan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        statusColors[entry.name as keyof typeof statusColors] ||
                        "#64748b"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
