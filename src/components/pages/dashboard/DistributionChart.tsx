/** @format */

// components/dashboard/DistributionChart.tsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DistribusiData } from "@/types/dashboard";

interface DistributionChartProps {
  title: string;
  data: DistribusiData[];
  type?: "pie" | "bar";
  dataKey: keyof DistribusiData;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#2563eb", // primary
  "#10b981", // success
  "#f59e0b", // warning
  "#ef4444", // error
  "#64748b", // secondary
  "#3b82f6", // info
  "#8b5cf6", // purple
  "#06b6d4", // cyan
];

export const DistributionChart: React.FC<DistributionChartProps> = ({
  title,
  data,
  type = "pie",
  dataKey,
  colors = DEFAULT_COLORS,
}) => {
  const formatLabel = (value: string) => {
    return value
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const chartData = data.map((item) => ({
    ...item,
    name: formatLabel(item[dataKey] as string),
    label: `${formatLabel(item[dataKey] as string)} (${item.persentase.toFixed(
      1
    )}%)`,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-base-100 p-3 rounded-lg shadow-lg border border-base-300">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary">
            Jumlah: <span className="font-bold">{data.jumlah}</span>
          </p>
          <p className="text-secondary">
            Persentase:{" "}
            <span className="font-bold">{data.persentase.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body">
        <h3 className="card-title text-lg font-semibold mb-4">{title}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {type === "pie" ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="jumlah"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="jumlah" fill={colors[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
