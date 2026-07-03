import { CheckCircle2, Clock3, PauseCircle, SearchCheck } from "lucide-react";
import Link from "next/link";

const jobs = [
  {
    id: "JOB-4821",
    company: "Aster Retail Pvt Ltd",
    status: "Completed",
    count: "132 invoices",
    time: "3 min ago",
    owner: "Aarav",
  },
  {
    id: "JOB-4819",
    company: "Northwind Traders",
    status: "Review",
    count: "48 invoices",
    time: "12 min ago",
    owner: "Mira",
  },
  {
    id: "JOB-4816",
    company: "Zenith Logistics",
    status: "Processing",
    count: "211 invoices",
    time: "19 min ago",
    owner: "Rohan",
  },
  {
    id: "JOB-4812",
    company: "BluePeak Pharma",
    status: "Queued",
    count: "86 invoices",
    time: "31 min ago",
    owner: "Diya",
  },
];

const statusConfig = {
  Completed: {
    icon: CheckCircle2,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Review: {
    icon: SearchCheck,
    tone: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Processing: {
    icon: Clock3,
    tone: "bg-sky-50 text-sky-700 border-sky-200",
  },
  Queued: {
    icon: PauseCircle,
    tone: "bg-stone-100 text-stone-700 border-stone-200",
  },
};

export default function RecentJobs() {
  return (
    <section className="rounded-[28px] border border-[rgba(86,67,43,0.14)] bg-white/80 p-6 shadow-[0_18px_40px_rgba(58,40,23,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9e4b22]">
            Recent Jobs
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
            Queue activity
          </h2>
        </div>

        <Link
          href="/jobs"
          className="rounded-full border border-[rgba(86,67,43,0.14)] px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          View all
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {jobs.map((job) => {
          const { icon: Icon, tone } = statusConfig[job.status];

          return (
            <article
              key={job.id}
              className="rounded-2xl border border-[rgba(86,67,43,0.1)] bg-[rgba(255,250,243,0.72)] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-stone-950">{job.company}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-500">
                    <span>{job.id}</span>
                    <span className="text-stone-300">•</span>
                    <span>{job.count}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {job.status}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-stone-500">
                <span>Assigned to {job.owner}</span>
                <span>{job.time}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
