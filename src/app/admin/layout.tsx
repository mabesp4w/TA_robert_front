/** @format */
import MainLayout from "@/components/Layout/MainLayout";
import { ProtectedRoute } from "@/components/pages/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
