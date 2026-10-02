"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Moon,
  Search,
  ChevronDown,
  ArrowLeftRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { UserCard } from "@/components/layout/user-card";

interface SidebarContentProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onNavigate?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function SidebarContent({
  isDark,
  setIsDark,
  onNavigate,
  showCloseButton,
  onClose,
}: SidebarContentProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard" || pathname === "/",
    },
    {
      title: "Factures",
      href: "/invoices",
      icon: FileText,
      active: pathname.startsWith("/invoices"),
      badge: "V1",
    },
    {
      title: "Clients",
      href: "/clients",
      icon: Users,
      active: pathname.startsWith("/clients"),
    },
    {
      title: "Transactions",
      href: "/dashboard#transactions",
      icon: ArrowLeftRight,
      active: false,
    },
  ];

  return (
    <>
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="flex items-center gap-3 group"
          >
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z"
                  fill="currentColor"
                  opacity="0.9"
                />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight dark:text-white">
                RDSH
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                FACTURE RDSH
              </p>
            </div>
          </Link>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Search Bar matching screenshot */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full h-10 pl-9 pr-9 text-xs rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
            />
            <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded dark:bg-slate-800 dark:border-slate-700">
              ⌘F
            </kbd>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="px-3 py-3">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            MENU
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    item.active
                      ? "bg-slate-100 text-slate-900 font-semibold shadow-xs dark:bg-slate-900 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        item.active
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section with Settings, Dark Mode, Profile */}
      <div className="p-3 border-t border-slate-100 space-y-1.5 dark:border-slate-900">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3.5 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900"
        >
          <HelpCircle className="h-4 w-4 text-slate-400" />
          <span>Help and Support</span>
        </Link>

        <Link
          href="/settings"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-3.5 py-2 text-sm rounded-xl transition-colors",
            pathname.startsWith("/settings")
              ? "bg-slate-100 text-slate-900 font-semibold dark:bg-slate-900 dark:text-white"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900"
          )}
        >
          <Settings className="h-4 w-4 text-slate-400" />
          <span>Settings</span>
        </Link>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-3.5 py-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <Moon className="h-4 w-4 text-slate-400" />
            <span>Dark Mode</span>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setIsDark(checked)}
          />
        </div>

        {/* Dynamic User Card with SignOut Dropdown */}
        <div className="pt-2">
          <UserCard />
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Close mobile menu whenever pathname changes
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock scroll on body when mobile menu is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 no-print">
        <Link
          href="/dashboard"
          onClick={handleNavigate}
          className="flex items-center gap-2.5 group"
        >
          <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z"
                fill="currentColor"
                opacity="0.9"
              />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight dark:text-white">
              RDSH
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          ) : (
            <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          )}
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-all duration-300 md:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-over Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-950 z-50 shadow-2xl flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out md:hidden no-print",
          mobileOpen
            ? "translate-x-0 opacity-100 visible"
            : "-translate-x-full opacity-0 invisible"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
      >
        <SidebarContent
          isDark={isDark}
          setIsDark={setIsDark}
          onNavigate={handleNavigate}
          showCloseButton
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/90 bg-white flex-col justify-between h-screen sticky top-0 shrink-0 z-30 dark:bg-slate-950 dark:border-slate-800 no-print">
        <SidebarContent isDark={isDark} setIsDark={setIsDark} />
      </aside>
    </>
  );
}
