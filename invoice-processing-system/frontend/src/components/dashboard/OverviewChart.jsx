"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const overviewData = [
  { name: "Mon", processed: 320, flagged: 28 },
  { name: "Tue", processed: 410, flagged: 24 },
  { name: "Wed", processed: 368, flagged: 31 },
  { name: "Thu", processed: 520, flagged: 20 },
  { name: "Fri", processed: 610, flagged: 27 },
  { name: "Sat", processed: 455, flagged: 18 },
  { name: "Sun", processed: 392, flagged: 16 },
];

export default function OverviewChart() {
  return (
    <section className="content-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="section-eyebrow">Throughput Overview</p>
          <h2 className="section-title">Processed vs flagged invoices</h2>
          <p className="section-copy max-w-2xl">
            A weekly trend of total processed invoices alongside the volume that
            needed manual validation or exception review.
          </p>
        </div>

        <div className="mini-metrics text-sm">
          <div className="mini-metric">
            <p className="mini-metric-label">Processed</p>
            <p className="mini-metric-value">3,075</p>
          </div>
          <div className="mini-metric">
            <p className="mini-metric-label">Flagged</p>
            <p className="mini-metric-value">164</p>
          </div>
        </div>
      </div>

      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={overviewData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="processedFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#c7632f" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#c7632f" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="flaggedFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#5b8def" stopOpacity={0.26} />
                <stop offset="95%" stopColor="#5b8def" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="rgba(86,67,43,0.1)" />
            <XAxis
              axisLine={false}
              dataKey="name"
              tickLine={false}
              tick={{ fill: "#6b5f55", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b5f55", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid rgba(86,67,43,0.12)",
                background: "rgba(255,250,243,0.96)",
                boxShadow: "0 18px 40px rgba(58,40,23,0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="processed"
              stroke="#c7632f"
              strokeWidth={3}
              fill="url(#processedFill)"
            />
            <Area
              type="monotone"
              dataKey="flagged"
              stroke="#5b8def"
              strokeWidth={2.5}
              fill="url(#flaggedFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
