export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  disabled = false,
  ...props
}) {
  const variants = {
    primary: "primary-action border-none",
    secondary: "secondary-action",
    ghost:
      "inline-flex min-h-[3.25rem] items-center justify-center rounded-full px-5 py-3 font-semibold text-stone-700 transition hover:bg-white/70",
    danger:
      "inline-flex min-h-[3.25rem] items-center justify-center rounded-full bg-rose-600 px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(225,29,72,0.18)] transition hover:translate-y-[-1px]",
  };

  return (
    <button
      className={`disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
