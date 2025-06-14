/** @format */

// app/dashboard/page.tsx
import React from "react";
import { Dashboard } from "@/components/pages/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-base-200">
      <Dashboard />
    </main>
  );
}

// Metadata untuk SEO (optional)
export const metadata = {
  title: "Dashboard | Manajemen Sapi",
  description: "Dashboard untuk monitoring dan analisis data peternakan sapi",
};
