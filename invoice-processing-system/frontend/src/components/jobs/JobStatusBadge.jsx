const statusStyles = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Review: "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-sky-50 text-sky-700 border-sky-200",
  Queued: "bg-stone-100 text-stone-700 border-stone-200",
  Pending: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function JobStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status] || "bg-stone-100 text-stone-700 border-stone-200"}`}
    >
      {status}
    </span>
  );
}
