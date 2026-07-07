"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CircleDollarSign,
  FileSpreadsheet,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  UserRound,
} from "lucide-react";
import { logout } from "../../services/auth.service";

const sections = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Uploads", icon: FileSpreadsheet },
  { href: "/jobs", label: "Jobs", icon: ReceiptText },
  { href: "/invoices", label: "Invoices", icon: CircleDollarSign },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      <div className="sidebar__panel">
        <p className="section-eyebrow">Workspace</p>
        <div className="sidebar__nav">
          {sections.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar__link ${pathname?.startsWith(href) ? "sidebar__link--active" : ""}`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <button type="button" className="sidebar__link sidebar__link--button" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>

        <div className="sidebar__note">
          <p className="section-eyebrow section-eyebrow--cool">Signed In</p>
          <h3>Priya Nair</h3>
          <p>Operations Lead handling uploads, reviews, and reporting for the invoice queue.</p>
        </div>
      </div>
    </aside>
  );
}
