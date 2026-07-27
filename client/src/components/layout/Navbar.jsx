"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { APP_ROUTES } from "../../constants/routes";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: APP_ROUTES.HOME, label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "How It Works" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="marketing-nav">
      <motion.div 
        className="marketing-nav__inner"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/" className="brand-mark group">
          <motion.span 
            className="brand-mark__badge"
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            CT
          </motion.span>
          <span className="hidden sm:flex flex-col">
            <strong className="group-hover:text-[#5a38ef] transition-colors duration-300">Bulk Invoice Processing</strong>
            <small>Enterprise automation</small>
          </span>
        </Link>
 
        <nav className="marketing-nav__links hidden md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="marketing-nav__link relative group">
              <span className="relative z-10">{link.label}</span>
              <span className="absolute bottom-1 left-2 right-2 h-[2px] bg-[#5a38ef] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300 z-0"></span>
            </Link>
          ))}
        </nav>
 
        <div className="marketing-nav__actions hidden md:flex">
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
              Get Started Free
            </Link>
          </motion.div>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Link href={APP_ROUTES.NOTIFICATIONS} className="marketing-nav__icon-button" aria-label="Notifications">
              <Bell className="h-4.5 w-4.5 text-stone-500" />
            </Link>
          </motion.div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)} 
            className="marketing-nav__icon-button" 
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-4.5 w-4.5 text-stone-600" /> : <Menu className="h-4.5 w-4.5 text-stone-600" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Drawer Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="marketing-nav__mobile-drawer md:hidden"
          >
            <nav className="flex flex-col space-y-3.5 py-4 border-t border-stone-200/50">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-stone-600 hover:text-[#5a38ef] font-semibold text-sm transition-colors py-1.5 px-2 rounded-xl hover:bg-stone-50"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-[1px] bg-stone-200/50 my-1" />
              <div className="flex items-center justify-between gap-4 pt-1.5">
                <Link 
                  href={APP_ROUTES.LOGIN} 
                  onClick={() => setIsOpen(false)}
                  className="secondary-action w-1/2 text-center text-xs font-semibold py-2 rounded-full"
                >
                  Login
                </Link>
                <Link 
                  href={APP_ROUTES.SIGNUP} 
                  onClick={() => setIsOpen(false)}
                  className="marketing-nav__cta w-1/2 text-center text-xs font-semibold py-2 rounded-full"
                >
                  Get Started Free
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
