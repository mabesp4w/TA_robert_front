/** @format */

import Link from "next/link";
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/authStore";

const Sidebar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { logout } = useAuthStore();

  const menuItems = [
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
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="min-h-screen w-80 bg-base-100 text-base-content">
      <div className="sticky top-0 z-20 bg-base-100 bg-opacity-90 backdrop-blur">
        <div className="navbar px-4">
          <div className="flex-1">
            <Link href="/dashboard" className="btn btn-ghost text-xl font-bold">
              🐄 CattleHealth
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* User Info */}

        {/* Menu Items */}
        <ul className="menu p-0 space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 rounded-lg p-3 transition-colors ${
                  item.active
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="mt-8 pt-4 border-t border-base-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-error hover:bg-error hover:text-error-content rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
