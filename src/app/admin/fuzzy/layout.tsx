/** @format */

// app/fuzzy/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import {
  Settings,
  Sliders,
  GitBranch,
  BarChart3,
  ChevronRight,
} from "lucide-react";

interface FuzzyLayoutProps {
  children: ReactNode;
}

export default function FuzzyLayout({ children }: FuzzyLayoutProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/admin/fuzzy",
      icon: BarChart3,
      description: "Overview sistem fuzzy",
    },
    {
      name: "Parameter Fuzzy",
      href: "/admin/fuzzy/parameter",
      icon: Settings,
      description: "Kelola parameter input & output",
    },
    {
      name: "Fungsi Keanggotaan",
      href: "/admin/fuzzy/fungsi-keanggotaan",
      icon: Sliders,
      description: "Atur fungsi keanggotaan",
    },
    {
      name: "Aturan Fuzzy",
      href: "/admin/fuzzy/aturan",
      icon: GitBranch,
      description: "Kelola rules inferensi",
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/admin/fuzzy") {
      return pathname === "/admin/fuzzy";
    }
    return pathname.startsWith(href);
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Fuzzy System", href: "/admin/fuzzy" }];

    if (segments.length > 1) {
      const currentNav = navigationItems.find(
        (item) =>
          item.href.includes(segments[segments.length - 1]) ||
          (segments.length > 2 &&
            item.href.includes(segments[segments.length - 2]))
      );

      if (currentNav && currentNav.href !== "/admin/fuzzy") {
        breadcrumbs.push({
          name: currentNav.name,
          href: currentNav.href,
        });
      }
    }

    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-6 py-4">
          {/* Breadcrumbs */}
          <div className="text-sm breadcrumbs mb-4">
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              {getBreadcrumbs().map((crumb, index) => (
                <li key={index}>
                  <Link
                    href={crumb.href}
                    className={
                      index === getBreadcrumbs().length - 1
                        ? "text-primary font-semibold"
                        : ""
                    }
                  >
                    {crumb.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-base-content">
                Sistem Fuzzy Logic
              </h1>
              <p className="text-base-content/70 mt-1">
                Sistem diagnosis penyakit sapi menggunakan fuzzy logic
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-base-100 rounded-lg border p-4">
              <h3 className="font-semibold mb-4 text-base-content">
                Menu Fuzzy
              </h3>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveLink(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-primary text-primary-content"
                            : "text-base-content hover:bg-base-200"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div
                          className={`text-xs ${
                            isActive
                              ? "text-primary-content/80"
                              : "text-base-content/60"
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-base-100 rounded-lg border p-4 mt-4">
              <h4 className="font-semibold mb-3 text-base-content">
                Quick Info
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/70">Status Sistem:</span>
                  <span className="badge badge-success badge-sm">Aktif</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Mode:</span>
                  <span className="text-base-content">Mamdani</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/70">Defuzzifikasi:</span>
                  <span className="text-base-content">Centroid</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
