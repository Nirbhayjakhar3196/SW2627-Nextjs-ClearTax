"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { APP_ROUTES } from "../../constants/routes";
import { motion } from "framer-motion";

const navLinks = [
  { href: APP_ROUTES.HOME, label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  return (
    <motion.header 
      className="marketing-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="marketing-nav__inner">
        <Link href="/" className="brand-mark group">
          <motion.span 
            className="brand-mark__badge"
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            CT
          </motion.span>
          <span>
            <strong className="group-hover:text-[#5a38ef] transition-colors duration-300">Bulk Invoice Processing</strong>
            <small>Enterprise automation</small>
          </span>
        </Link>

        <nav className="marketing-nav__links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="marketing-nav__link relative group">
              <span className="relative z-10">{link.label}</span>
              <span className="absolute bottom-1 left-2 right-2 h-[2px] bg-[#5a38ef] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 z-0"></span>
            </Link>
          ))}
        </nav>

        <div className="marketing-nav__actions">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={APP_ROUTES.NOTIFICATIONS} className="marketing-nav__icon-button" aria-label="Notifications">
              <Bell className="h-4 w-4 text-stone-500 hover:text-[#5a38ef] transition-colors" />
            </Link>
          </motion.div>
          <Link href={APP_ROUTES.LOGIN} className="marketing-nav__ghost">
            Login
          </Link>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link href={APP_ROUTES.SIGNUP} className="marketing-nav__cta">
              Sign Up
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
