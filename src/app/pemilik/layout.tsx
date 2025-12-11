/** @format */
import MainLayout from "@/components/Layout/MainLayout";
import { ProtectedRoute } from "@/components/pages/auth/ProtectedRoute";
import { USER_ROLES } from "@/types/auth";

export default function PemilikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      requireAuth={true}
      requiredRoles={[USER_ROLES.PEMILIK]}
    >
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}

