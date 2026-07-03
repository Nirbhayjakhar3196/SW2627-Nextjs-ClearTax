import { Activity, CircleDollarSign, Clock3, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

import OverviewChart from "../../components/dashboard/OverviewChart";
import RecentJobs from "../../components/dashboard/RecentJobs";
import StatCard from "../../components/dashboard/StatCard";

const statCards = [
  {
    title: "Invoices Processed",
    value: "12,480",
    change: "+18.2%",
    trend: "up",
    description: "Compared to last 30 days",
    icon: FileSpreadsheet,
  },
  {
    title: "Processing Accuracy",
    value: "98.6%",
    change: "+1.4%",
    trend: "up",
    description: "OCR and validation confidence",
    icon: Activity,
  },
  {
    title: "Average Turnaround",
    value: "2h 14m",
    change: "-22 min",
    trend: "up",
    description: "Faster than the previous cycle",
    icon: Clock3,
  },
  {
    title: "Recovered Revenue",
    value: "₹8.4L",
    change: "+9.1%",
    trend: "up",
    description: "Detected from flagged mismatches",
    icon: CircleDollarSign,
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(199,99,47,0.12),_transparent_28%),linear-gradient(180deg,_#fbf5ea_0%,_#f4efe5_100%)] px-4 py-6 text-stone-900 md:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[rgba(86,67,43,0.14)] bg-[linear-gradient(140deg,rgba(255,255,255,0.88),rgba(255,244,230,0.68))] p-6 shadow-[0_24px_60px_rgba(65,44,23,0.12)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#9e4b22]">
                Dashboard Overview
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-stone-950 md:text-6xl">
                Keep invoice operations visible before they become blockers.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                Today&apos;s dashboard brings together throughput, accuracy,
                pending reviews, and recent job movement so we can spot issues
                early and keep the processing pipeline moving.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-2 gap-3 rounded-[24px] border border-[rgba(86,67,43,0.12)] bg-white/65 p-4 text-sm text-stone-600 md:min-w-[320px]">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Live Queue
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">128</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  SLA Risk
                </p>
                <p className="mt-1 text-2xl font-semibold text-[#c7632f]">07 Jobs</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Manual Review
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">24</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Team Load
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">82%</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="rounded-full bg-[#c7632f] px-5 py-3 text-sm font-semibold text-[#fff7f0] transition hover:translate-y-[-1px]"
            >
              Upload New Batch
            </Link>
            <Link
              href="/jobs"
              className="rounded-full border border-[rgba(86,67,43,0.14)] bg-white/60 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:translate-y-[-1px]"
            >
              Review Jobs
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <OverviewChart />
          <RecentJobs />
        </section>
      </div>
    </main>
  );
}
