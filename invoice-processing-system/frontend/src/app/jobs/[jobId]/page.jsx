import Link from "next/link";
import { notFound } from "next/navigation";

import JobStatusBadge from "../../../components/jobs/JobStatusBadge";
import JobTimeline from "../../../components/jobs/JobTimeline";
import DashboardShell from "../../../components/layout/DashboardShell";
import { getJobById } from "../../../lib/mock-data";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDateTime } from "../../../utils/formatDate";

export default async function JobDetailPage({ params }) {
  const { jobId } = await params;
  const job = getJobById(jobId);

  if (!job) {
    notFound();
  }

  return (
    <DashboardShell>
      <div className="app-page page-shell--warm">
        <div className="page-shell">
        <section className="content-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-eyebrow">Job Detail</p>
              <h1 className="section-title mt-2">{job.id}</h1>
              <p className="section-copy max-w-2xl">{job.summary}</p>
            </div>
            <JobStatusBadge status={job.status} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="mini-metric">
              <p className="mini-metric-label">Company</p>
              <p className="mini-metric-value text-[1.2rem]">{job.company}</p>
            </div>
            <div className="mini-metric">
              <p className="mini-metric-label">Invoices</p>
              <p className="mini-metric-value text-[1.2rem]">{job.invoices}</p>
            </div>
            <div className="mini-metric">
              <p className="mini-metric-label">Amount</p>
              <p className="mini-metric-value text-[1.2rem]">{formatCurrency(job.amount)}</p>
            </div>
            <div className="mini-metric">
              <p className="mini-metric-label">Confidence</p>
              <p className="mini-metric-value text-[1.2rem]">{job.confidence}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="content-card">
            <p className="section-eyebrow">Ownership</p>
            <h2 className="section-title">Batch context</h2>

            <div className="mt-6 stack-list">
              <div className="list-item-card">
                <p className="font-sans text-sm text-stone-500">Owner</p>
                <p className="mt-2 font-sans text-base font-semibold text-stone-950">{job.owner}</p>
              </div>
              <div className="list-item-card">
                <p className="font-sans text-sm text-stone-500">Priority</p>
                <p className="mt-2 font-sans text-base font-semibold text-stone-950">{job.priority}</p>
              </div>
              <div className="list-item-card">
                <p className="font-sans text-sm text-stone-500">Source</p>
                <p className="mt-2 font-sans text-base font-semibold text-stone-950">{job.source}</p>
              </div>
              <div className="list-item-card">
                <p className="font-sans text-sm text-stone-500">Updated</p>
                <p className="mt-2 font-sans text-base font-semibold text-stone-950">{formatDateTime(job.updatedAt)}</p>
              </div>
            </div>

            <Link href="/jobs" className="secondary-action mt-6">
              Back to Jobs
            </Link>
          </article>

          <JobTimeline timeline={job.timeline} />
        </section>
        </div>
      </div>
    </DashboardShell>
  );
}
