/** @format */

"use client";

import { DashboardStats } from "@/types";
import Alert from "@/components/UI/Alert";

interface AlertsPanelProps {
  alerts: DashboardStats["alerts"];
}

const AlertsPanel = ({ alerts }: AlertsPanelProps) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Peringatan & Notifikasi</h2>
      {alerts.map((alert, index) => (
        <Alert key={index} type={alert.type} title={alert.title}>
          <p>{alert.message}</p>
          {alert.action && (
            <p className="text-sm mt-2 font-medium">Tindakan: {alert.action}</p>
          )}
        </Alert>
      ))}
    </div>
  );
};

export default AlertsPanel;
