"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Completed", value: 54, color: "#0f9f6e" },
  { name: "Review", value: 16, color: "#d97706" },
  { name: "Processing", value: 22, color: "#2563eb" },
  { name: "Queued", value: 8, color: "#78716c" },
];

export default function ProcessingChart() {
  return (
    <section className="content-card">
      <div>
        <p className="section-eyebrow">Distribution</p>
        <h2 className="section-title">Current processing mix</h2>
        <p className="section-copy">
          The queue is weighted toward completed and active processing batches.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stack-list">
          {data.map((entry) => (
            <div key={entry.name} className="list-item-card">
              <div className="flex items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-3 w-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-medium text-stone-700">{entry.name}</span>
                </div>
                <span className="font-semibold text-stone-950">{entry.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
