/** @format */

import { NavbarUser } from "@/components/Layout/NavbarUser";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-base-200">
      <NavbarUser />
      <section className="container mx-auto">{children}</section>
    </main>
  );
}
