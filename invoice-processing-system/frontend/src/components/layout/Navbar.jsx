import Link from "next/link";
import { Bell } from "lucide-react";
import { APP_ROUTES } from "../../constants/routes";

const navLinks = [
  { href: APP_ROUTES.HOME, label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="marketing-nav">
      <div className="marketing-nav__inner">
        <Link href="/" className="brand-mark">
          <span className="brand-mark__badge">CT</span>
          <span>
            <strong>Bulk Invoice Processing</strong>
            <small>Enterprise automation</small>
          </span>
        </Link>

        <nav className="marketing-nav__links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="marketing-nav__link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="marketing-nav__actions">
          <Link href={APP_ROUTES.NOTIFICATIONS} className="marketing-nav__icon-button" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Link>
          <Link href={APP_ROUTES.LOGIN} className="marketing-nav__ghost">
            Login
          </Link>
          <Link href={APP_ROUTES.SIGNUP} className="marketing-nav__cta">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
