/** @format */

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/authStore";

// Types
interface SubMenuItem {
  title: string;
  href: string;
  active: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  active: boolean;
  children?: SubMenuItem[];
}

// Subcomponents
const MenuItemComponent: React.FC<{
  item: MenuItem;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ item, isExpanded, onToggle }) => {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li>
      <div className="flex flex-col">
        {hasChildren ? (
          <button
            onClick={onToggle}
            className={`flex items-center justify-between w-full text-left rounded-lg px-3 py-2 transition-colors ${
              item.active
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200"
            }`}
            aria-expanded={isExpanded}
            aria-controls={`submenu-${item.href}`}
          >
            <div className="flex items-center space-x-3">
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.title}</span>
            </div>
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0" />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
              item.active
                ? "bg-primary text-primary-content"
                : "hover:bg-base-200"
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{item.title}</span>
          </Link>
        )}

        {/* Submenu */}
        {hasChildren && (
          <div
            id={`submenu-${item.href}`}
            className={`overflow-hidden transition-all duration-200 ease-in-out ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="ml-6 mt-1 space-y-1 border-l-2 border-base-300 pl-4">
              {item.children?.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                      child.active
                        ? "bg-primary text-primary-content font-medium"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }`}
                  >
                    {child.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { logout } = useAuthStore();

  // State for expanded menu items
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Memoized menu items to prevent unnecessary re-renders
  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        title: "Dashboard",
        icon: HomeIcon,
        href: "/admin/dashboard",
        active: pathName === "/admin/dashboard",
      },
      {
        title: "Jenis Penyakit",
        icon: UserGroupIcon,
        href: "/admin/jenis-penyakit",
        active: pathName.startsWith("/admin/jenis-penyakit"),
      },
      {
        title: "Pemilik",
        icon: UserGroupIcon,
        href: "/admin/pemilik",
        active: pathName.startsWith("/admin/pemilik"),
      },
      {
        title: "Data Sapi",
        icon: UserGroupIcon,
        href: "/admin/sapi",
        active: pathName.startsWith("/admin/sapi"),
      },
      {
        title: "Pemeriksaan",
        icon: ClipboardDocumentListIcon,
        href: "/admin/pemeriksaan",
        active: pathName.startsWith("/admin/pemeriksaan"),
      },
      {
        title: "Fuzzy Mamdani",
        icon: BeakerIcon,
        href: "/admin/fuzzy",
        active: pathName.startsWith("/admin/fuzzy"),
        children: [
          {
            title: "Parameter Fuzzy",
            href: "/admin/fuzzy/parameter",
            active: pathName.startsWith("/admin/fuzzy/parameter"),
          },
          {
            title: "Fungsi Keanggotaan",
            href: "/admin/fuzzy/fungsi-keanggotaan",
            active: pathName.startsWith("/admin/fuzzy/fungsi-keanggotaan"),
          },
          {
            title: "Aturan Fuzzy",
            href: "/admin/fuzzy/aturan",
            active: pathName.startsWith("/admin/fuzzy/aturan"),
          },
          {
            title: "Analisa",
            href: "/admin/fuzzy/analisa",
            active: pathName.startsWith("/admin/fuzzy/analisa"),
          },
        ],
      },
    ],
    [pathName]
  );

  // Auto-expand menu items that have active children
  useMemo(() => {
    const newExpandedItems = new Set<string>();
    menuItems.forEach((item) => {
      if (item.children?.some((child) => child.active)) {
        newExpandedItems.add(item.href);
      }
    });
    setExpandedItems(newExpandedItems);
  }, [menuItems]);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(href)) {
        newSet.delete(href);
      } else {
        newSet.add(href);
      }
      return newSet;
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className="min-h-screen w-80 bg-base-100 text-base-content shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-base-100 bg-opacity-90 backdrop-blur border-b border-base-300">
        <div className="navbar px-4">
          <div className="flex-1">
            <Link
              href="/admin/dashboard"
              className="btn btn-ghost text-xl font-bold hover:scale-105 transition-transform"
            >
              🐄 CattleHealth
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="p-4 h-[calc(90vh-4rem)] overflow-y-auto">
        {/* Menu Items */}
        <nav>
          <ul className="space-y-2" role="list">
            {menuItems.map((item) => (
              <MenuItemComponent
                key={item.href}
                item={item}
                isExpanded={expandedItems.has(item.href)}
                onToggle={() => toggleExpanded(item.href)}
              />
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-8 pt-4 border-t border-base-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-error hover:bg-error hover:text-error-content rounded-lg transition-all duration-200 hover:scale-[0.98] active:scale-95"
            aria-label="Logout from application"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
