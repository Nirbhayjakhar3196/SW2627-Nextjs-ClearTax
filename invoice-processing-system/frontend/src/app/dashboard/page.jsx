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
    <main className="app-page page-shell--warm">
      <div className="page-shell">
        <section className="hero-panel surface-panel surface-panel--hero panel-padding">
          <div className="hero-layout">
            <div className="hero-split">
              <div className="hero-content">
                <p className="eyebrow">Dashboard Overview</p>
                <h1 className="hero-title">
                Keep invoice operations visible before they become blockers.
                </h1>
                <p className="hero-copy">
                  Today&apos;s dashboard brings together throughput, accuracy,
                  pending reviews, and recent job movement so we can spot issues
                  early and keep the processing pipeline moving.
                </p>
              </div>

              <div className="metric-board">
                <div className="metric-item">
                  <p className="metric-label">Live Queue</p>
                  <p className="metric-value">128</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">SLA Risk</p>
                  <p className="metric-value metric-value--accent">07 Jobs</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Manual Review</p>
                  <p className="metric-value">24</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Team Load</p>
                  <p className="metric-value">82%</p>
                </div>
              </div>
            </div>

            <div className="action-row">
            <Link
              href="/upload"
                className="primary-action"
            >
              Upload New Batch
            </Link>
            <Link
              href="/jobs"
                className="secondary-action"
            >
              Review Jobs
            </Link>
          </div>
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
