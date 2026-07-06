import Link from "next/link";
import { Bell, Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/jobs", label: "Jobs" },
];

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link href="/" className="brand-mark">
          <span className="brand-mark__badge">CT</span>
          <span>
            <strong>ClearTax</strong>
            <small>Invoice Processing</small>
          </span>
        </Link>

        <nav className="topbar__nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="topbar__nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="topbar__tools">
          <div className="topbar__search">
            <Search className="h-4 w-4" />
            <span>Search invoices</span>
          </div>
          <button type="button" className="topbar__icon-button" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
