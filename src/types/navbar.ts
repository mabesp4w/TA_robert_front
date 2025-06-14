/** @format */

// types/navbar.ts
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  subMenu?: NavItem[];
}

export interface NavbarProps {
  currentPath?: string;
  onLoginClick?: () => void;
}
