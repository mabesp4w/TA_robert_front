/** @format */

// components/layout/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BarChart3,
  Beef,
  Users,
  Activity,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { NavItem } from "@/types/navbar";
import { Button } from "@/components/UI/Button";

const navigationItems: NavItem[] = [
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
    href: "/pemilik",
    icon: Users,
  },
  {
    label: "Monitoring",
    href: "/monitoring",
    icon: Activity,
    badge: "New",
  },
];

export const NavbarUser: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
              {navigationItems.map((item) => (
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
          {navigationItems.map((item) => (
            <li key={item.href}>
              <NavMenuItem item={item} />
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Login button */}
      <div className="navbar-end gap-2">
        {/* Theme toggle (optional) */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-50 w-32 p-2 shadow-lg border border-base-300"
          >
            <li>
              <button className="text-sm">🌞 Light</button>
            </li>
            <li>
              <button className="text-sm">🌙 Dark</button>
            </li>
          </ul>
        </div>

        {/* Login Button */}
        <Link href="/login">
          <Button variant="primary" size="sm" className="gap-2">
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
