import Link from "next/link";

import JobStatusBadge from "./JobStatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDate";

export default function JobsTable({ jobs }) {
  return (
    <section className="content-card">
      <div>
        <p className="section-eyebrow">Jobs Queue</p>
        <h2 className="section-title">Batch processing jobs</h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[rgba(30,64,97,0.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[rgba(240,248,255,0.92)] text-left text-xs uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-4 py-4 font-semibold">Job</th>
                <th className="px-4 py-4 font-semibold">Owner</th>
                <th className="px-4 py-4 font-semibold">Invoices</th>
                <th className="px-4 py-4 font-semibold">Amount</th>
                <th className="px-4 py-4 font-semibold">Updated</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t border-[rgba(30,64,97,0.08)] font-sans text-sm text-stone-700"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-semibold text-stone-950 hover:text-[var(--accent)]"
                    >
                      {job.id}
                    </Link>
                    <p className="mt-1 text-stone-500">{job.company}</p>
                  </td>
                  <td className="px-4 py-4">{job.owner}</td>
                  <td className="px-4 py-4">{job.invoices}</td>
                  <td className="px-4 py-4">{formatCurrency(job.amount)}</td>
                  <td className="px-4 py-4">{formatDateTime(job.updatedAt)}</td>
                  <td className="px-4 py-4">
                    <JobStatusBadge status={job.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
