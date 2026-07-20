"use client";

import { Loader2 } from "lucide-react";

export default function Button({
  children,
  loading = false,
  disabled,
  variant = "primary",
  icon: Icon,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-all outline-none";

  const variants = {
    primary:
      "bg-stone-900 text-white hover:bg-stone-800 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300 shadow-sm",
    ghost:
      "text-stone-600 hover:text-stone-900 hover:bg-stone-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-md",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} py-3 px-6 rounded-xl text-[15px] ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin mr-2" />
          {children}
        </>
      ) : (
        <>
          {Icon && <Icon size={18} className="mr-2" />}
          {children}
        </>
      )}
    </button>
  );
}
