import Link from "next/link";
import {
  CircleDollarSign,
  FileSpreadsheet,
  LayoutDashboard,
  ReceiptText,
  Settings,
} from "lucide-react";

const sections = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Uploads", icon: FileSpreadsheet },
  { href: "/jobs", label: "Jobs", icon: ReceiptText },
  { href: "/invoices", label: "Invoices", icon: CircleDollarSign },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      <div className="sidebar__panel">
        <p className="section-eyebrow">Workspace</p>
        <div className="sidebar__nav">
          {sections.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="sidebar__link">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="sidebar__note">
          <p className="section-eyebrow section-eyebrow--cool">Today</p>
          <h3>14 files uploaded</h3>
          <p>3 batches are ready for processing and 19 rows still need review.</p>
        </div>
      </div>
    </aside>
  );
}
