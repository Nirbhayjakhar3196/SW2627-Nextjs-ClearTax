import Link from "next/link";
import { FileSpreadsheet, ShieldCheck, UploadCloud, WandSparkles } from "lucide-react";

import CSVPreview from "../../components/upload/CSVPreview";
import DashboardShell from "../../components/layout/DashboardShell";
import UploadDropzone from "../../components/upload/UploadDropzone";
import UploadProgress from "../../components/upload/UploadProgress";

const previewRows = [
  {
    invoiceId: "INV-1048",
    vendor: "Apex Office Supplies",
    invoiceDate: "2026-07-01",
    amount: "₹48,200",
    status: "Ready",
  },
  {
    invoiceId: "INV-1049",
    vendor: "Northwind Traders",
    invoiceDate: "2026-07-01",
    amount: "₹16,980",
    status: "Needs Review",
  },
  {
    invoiceId: "INV-1050",
    vendor: "BluePeak Pharma",
    invoiceDate: "2026-07-02",
    amount: "₹1,24,500",
    status: "Ready",
  },
  {
    invoiceId: "INV-1051",
    vendor: "Zenith Logistics",
    invoiceDate: "2026-07-02",
    amount: "₹32,450",
    status: "Mapped",
  },
];

const uploadJobs = [
  {
    label: "July vendor batch",
    status: "Uploading",
    progress: 72,
    detail: "2.4 MB • 418 rows • mapping vendor and tax columns",
  },
  {
    label: "Quarter close imports",
    status: "Queued",
    progress: 24,
    detail: "1.1 MB • awaiting validation slot",
  },
  {
    label: "Pharma exceptions",
    status: "Validated",
    progress: 100,
    detail: "320 rows • duplicate checks passed",
  },
];

const uploadHighlights = [
  {
    title: "CSV mapped automatically",
    description: "Header detection aligns invoice, vendor, GST, and amount fields.",
    icon: WandSparkles,
  },
  {
    title: "Validation before processing",
    description: "We catch empty cells, malformed dates, and duplicate invoice IDs early.",
    icon: ShieldCheck,
  },
  {
    title: "Batch uploads supported",
    description: "Drag large files here and keep an eye on staged job progress.",
    icon: UploadCloud,
  },
];

export default function UploadPage() {
  return (
    <DashboardShell>
      <main className="app-page page-shell--split">
        <div className="page-shell">
        <section className="hero-panel surface-panel surface-panel--hero panel-padding">
          <div className="hero-layout">
            <div className="hero-split">
              <div className="hero-content">
                <p className="eyebrow">Upload Workspace</p>
                <h1 className="hero-title">
                Bring invoice batches in cleanly before they hit the pipeline.
                </h1>
                <p className="hero-copy">
                  Upload CSVs, validate column mapping, preview parsed invoice rows,
                  and monitor import progress from one place before jobs move into
                  processing.
                </p>
              </div>

              <div className="metric-board">
                <div className="metric-item">
                  <p className="metric-label">Files Today</p>
                  <p className="metric-value">14</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Success Rate</p>
                  <p className="metric-value">96.4%</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Pending Review</p>
                  <p className="metric-value metric-value--accent">19 Rows</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Ready To Process</p>
                  <p className="metric-value">3 Batches</p>
                </div>
              </div>
            </div>

            <div className="action-row">
            <Link
              href="/dashboard"
                className="secondary-action"
            >
              Back To Dashboard
            </Link>
            <Link
              href="/jobs"
                className="primary-action"
            >
              Review Processing Queue
            </Link>
          </div>
          </div>
        </section>

        <section className="section-grid xl:grid-cols-[1.2fr_0.8fr] xl:grid">
          <UploadDropzone />
          <div className="feature-list">
            {uploadHighlights.map(({ title, description, icon: Icon }) => (
              <article key={title} className="feature-item">
                  <div className="feature-icon">
                  <Icon className="h-5 w-5" />
                </div>
                  <div>
                    <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
                    <p className="mt-1 text-sm leading-7 text-stone-600">{description}</p>
                  </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <CSVPreview rows={previewRows} />
          <UploadProgress jobs={uploadJobs} />
        </section>

        <section className="content-card">
          <div className="flex items-start gap-4">
            <div className="panel-icon panel-icon--cool">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="section-eyebrow section-eyebrow--cool">
                Suggested Next Step
              </p>
              <h2 className="section-title">
                Standardize vendor CSV templates next.
              </h2>
              <p className="section-copy max-w-3xl">
                A shared import template will reduce manual review volume and make
                downstream invoice extraction more consistent across vendors.
              </p>
            </div>
          </div>
        </section>
        </div>
      </main>
    </DashboardShell>
  );
}
