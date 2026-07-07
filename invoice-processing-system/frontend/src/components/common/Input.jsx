export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block font-sans text-sm font-medium text-stone-700">
          {label}
        </label>
      )}

      <input
        className={`w-full rounded-2xl border bg-white/88 px-4 py-3 font-sans text-sm text-stone-900 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(124,108,242,0.14)] ${error ? "border-rose-500" : "border-[rgba(148,163,184,0.24)]"} ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-1 font-sans text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
