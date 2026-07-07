const toneByStatus = {
  Matched: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Review: "bg-amber-50 text-amber-700 border-amber-200",
  Mapped: "bg-sky-50 text-sky-700 border-sky-200",
  Processing: "bg-violet-50 text-violet-700 border-violet-200",
  Mismatch: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneByStatus[status] || "bg-stone-100 text-stone-700 border-stone-200"}`}
    >
      {status}
    </span>
  );
}
