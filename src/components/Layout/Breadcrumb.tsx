/** @format */

// components/layout/Breadcrumb.tsx
import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  className = "",
}) => {
  const breadcrumbItems = showHome
    ? [{ label: "Beranda", href: "/", icon: Home }, ...items]
    : items;

  return (
    <div className={`breadcrumbs text-sm ${className}`}>
      <ul>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={index}>
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`flex items-center gap-1 ${
                    isLast
                      ? "text-base-content font-medium"
                      : "text-base-content/70"
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Hook untuk generate breadcrumb otomatis dari path
export const useBreadcrumb = (customItems?: BreadcrumbItem[]) => {
  if (customItems) return customItems;

  // Auto-generate dari window.location jika di client
  if (typeof window !== "undefined") {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);

    return pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { label, href };
    });
  }

  return [];
};
