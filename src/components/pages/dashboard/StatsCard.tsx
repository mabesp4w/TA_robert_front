/** @format */

// components/dashboard/StatsCard.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  color = "primary",
  trend,
}) => {
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
    info: "text-info",
  };

  const bgColorClasses = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    success: "bg-success/10",
    warning: "bg-warning/10",
    error: "bg-error/10",
    info: "bg-info/10",
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-base-content/70 mb-1">
              {title}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-base-content">
                {value.toLocaleString()}
              </span>
              {trend && (
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? "text-success" : "text-error"
                  }`}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-base-content/60 mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${bgColorClasses[color]}`}>
            <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
