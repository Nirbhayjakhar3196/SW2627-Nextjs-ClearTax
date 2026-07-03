import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  change,
  trend = "up",
  description,
  icon: Icon,
}) {
  const changeTone =
    trend === "up"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <article className="rounded-[24px] border border-[rgba(86,67,43,0.14)] bg-[rgba(255,250,243,0.88)] p-5 shadow-[0_18px_40px_rgba(58,40,23,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-stone-950">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(199,99,47,0.12)] text-[#9e4b22]">
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${changeTone}`}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          {change}
        </span>
        <p className="text-sm text-stone-500">{description}</p>
      </div>
    </article>
  );
}
