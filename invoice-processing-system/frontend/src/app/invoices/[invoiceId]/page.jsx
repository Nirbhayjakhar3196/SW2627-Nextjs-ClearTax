import Link from "next/link";
import { notFound } from "next/navigation";

import DashboardShell from "../../../components/layout/DashboardShell";
import StatusBadge from "../../../components/invoices/StatusBadge";
import { getInvoiceById, getJobById } from "../../../lib/mock-data";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";

export default async function InvoiceDetailPage({ params }) {
  const { invoiceId } = await params;
  const invoice = getInvoiceById(invoiceId);

  if (!invoice) {
    notFound();
  }

  const relatedJob = getJobById(invoice.jobId);

  return (
    <DashboardShell>
      <div className="app-page page-shell--warm">
        <div className="page-shell">
        <section className="content-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-eyebrow">Invoice Detail</p>
              <h1 className="section-title mt-2">{invoice.id}</h1>
              <p className="section-copy max-w-2xl">
                {invoice.notes}
              </p>
            </div>
            <StatusBadge status={invoice.status} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="mini-metric">
              <p className="mini-metric-label">Vendor</p>
              <p className="mini-metric-value text-[1.2rem]">{invoice.vendor}</p>
            </div>
            <div className="mini-metric">
              <p className="mini-metric-label">Amount</p>
              <p className="mini-metric-value text-[1.2rem]">{formatCurrency(invoice.amount)}</p>
            </div>
            <div className="mini-metric">
              <p className="mini-metric-label">Invoice Date</p>
              <p className="mini-metric-value text-[1.2rem]">{formatDate(invoice.date)}</p>
            </div>
            <div className="mini-metric">
              <p className="mini-metric-label">Match Score</p>
              <p className="mini-metric-value text-[1.2rem]">{invoice.matchScore}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="content-card">
            <p className="section-eyebrow">Record Data</p>
            <h2 className="section-title">Invoice metadata</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="list-item-card">
                <p className="font-sans text-sm text-stone-500">Customer</p>
                <p className="mt-2 font-sans text-base font-semibold text-stone-950">{invoice.customer}</p>
              </div>
              <div className="list-item-card">
                <p className="font-sans text-sm text-stone-500">Due Date</p>
                <p className="mt-2 font-sans text-base font-semibold text-stone-950">{formatDate(invoice.dueDate)}</p>
              </div>
              <div className="list-item-card">
                <p className="font-sans text-sm text-stone-500">Tax</p>
                <p className="mt-2 font-sans text-base font-semibold text-stone-950">{formatCurrency(invoice.tax)}</p>
              </div>
              <div className="list-item-card">
                <p className="font-sans text-sm text-stone-500">Payment Status</p>
                <p className="mt-2 font-sans text-base font-semibold text-stone-950">{invoice.paymentStatus}</p>
              </div>
            </div>
          </article>

          <article className="content-card">
            <p className="section-eyebrow">Source Trace</p>
            <h2 className="section-title">Related processing job</h2>

            <div className="mt-6 list-item-card">
              <p className="font-sans text-sm text-stone-500">Origin method</p>
              <p className="mt-2 font-sans text-base font-semibold text-stone-950">{invoice.method}</p>
            </div>

            {relatedJob ? (
              <div className="mt-4 list-item-card">
                <p className="font-sans text-sm text-stone-500">Job link</p>
                <Link
                  href={`/jobs/${relatedJob.id}`}
                  className="mt-2 inline-block font-sans text-base font-semibold text-[var(--accent)]"
                >
                  {relatedJob.id} • {relatedJob.company}
                </Link>
              </div>
            ) : null}
          </article>
        </section>
        </div>
      </div>
    </DashboardShell>
  );
}
