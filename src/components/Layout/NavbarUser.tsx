/** @format */

// components/layout/NavbarUser.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  BarChart3,
  Beef,
  Users,
  Activity,
  LogIn,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { NavItem } from "@/types/navbar";
import { Button } from "@/components/UI/Button";
import { useAuthStore } from "@/stores/auth/authStore";

// Navigation items untuk user yang sudah login
const getNavigationItems = (isAuthenticated: boolean): NavItem[] => {
  if (isAuthenticated) {
    return [
      {
        label: "Dashboard",
        href: "/pemilik",
        icon: BarChart3,
      },
      {
        label: "Data Sapi",
        href: "/sapi",
        icon: Beef,
      },
      {
        label: "Data Pemilik",
        href: "/pemilik-sapi",
        icon: Users,
      },
      {
        label: "Deteksi Penyakit",
        href: "/deteksi-penyakit",
        icon: Activity,
      },
    ];
  }
  return [
    {
      label: "Dashboard",
      href: "/",
      icon: BarChart3,
    },
    {
      label: "Data Sapi",
      href: "/sapi",
      icon: Beef,
    },
    {
      label: "Pemilik",
      href: "/pemilik-sapi",
      icon: Users,
    },
    {
      label: "Deteksi Penyakit",
      href: "/deteksi-penyakit",
      icon: Activity,
    },
  ];
};

export const NavbarUser: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const NavMenuItem: React.FC<{ item: NavItem; isMobile?: boolean }> = ({
    item,
    isMobile = false,
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const hasSubMenu = item.subMenu && item.subMenu.length > 0;
    const isActive = isActivePath(item.href);

    if (hasSubMenu) {
      return (
        <div className={`dropdown ${isMobile ? "dropdown-end" : ""}`}>
          <div
            tabIndex={0}
            role="button"
            className={`btn btn-ghost flex items-center gap-2 ${
              isActive ? "btn-active" : ""
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            <span>{item.label}</span>
            {item.badge && (
              <span className="badge badge-primary badge-sm">{item.badge}</span>
            )}
            <ChevronDown className="w-3 h-3" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300"
          >
            {item.subMenu?.map((subItem) => (
              <li key={subItem.href}>
                <Link
                  href={subItem.href}
                  className={`flex items-center gap-2 ${
                    isActivePath(subItem.href) ? "active" : ""
                  }`}
                  onClick={closeMobileMenu}
                >
                  {subItem.icon && <subItem.icon className="w-4 h-4" />}
                  {subItem.label}
                  {subItem.badge && (
                    <span className="badge badge-primary badge-sm">
                      {subItem.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <Link
        href={item.href}
        className={`btn btn-ghost flex items-center gap-2 ${
          isActive ? "btn-active" : ""
        }`}
        onClick={closeMobileMenu}
      >
        {item.icon && <item.icon className="w-4 h-4" />}
        <span>{item.label}</span>
        {item.badge && (
          <span className="badge badge-primary badge-sm">{item.badge}</span>
        )}
      </Link>
    );
  };

  return (
    <div className="navbar bg-base-100 shadow-md border-b border-base-300 sticky top-0 z-40">
      <div className="navbar-start">
        {/* Mobile menu button */}
        <div className="dropdown lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </div>
          {isMobileMenuOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-64 p-2 shadow-lg border border-base-300"
            >
              {getNavigationItems(isAuthenticated).map((item) => (
                <li key={item.href}>
                  <NavMenuItem item={item} isMobile={true} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logo */}
        <Link href="/" className="btn btn-ghost text-xl font-bold">
          <span className="hidden sm:inline">
            🐄 Sistem Deteksi Penyakit Sapi
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {getNavigationItems(isAuthenticated).map((item) => (
            <li key={item.href}>
              <NavMenuItem item={item} />
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - User menu or Login button */}
      <div className="navbar-end gap-2">
        {isAuthenticated && user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-50 w-56 p-2 shadow-lg border border-base-300 mt-2"
            >
              <li className="menu-title">
                <span>{user.username || user.email}</span>
              </li>
              <li className="menu-title">
                <span className="text-xs text-base-content/60 capitalize">
                  {typeof user.role === 'string' ? user.role : user.role?.name || 'User'}
                </span>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="text-error"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="primary" size="sm" className="gap-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
