import Link from "next/link";
import { FileSpreadsheet, ShieldCheck, UploadCloud, WandSparkles } from "lucide-react";

import CSVPreview from "../../components/upload/CSVPreview";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(91,141,239,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(199,99,47,0.12),_transparent_26%),linear-gradient(180deg,_#fbf5ea_0%,_#f4efe5_100%)] px-4 py-6 text-stone-900 md:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-[32px] border border-[rgba(86,67,43,0.14)] bg-[linear-gradient(140deg,rgba(255,255,255,0.88),rgba(255,244,230,0.68))] p-6 shadow-[0_24px_60px_rgba(65,44,23,0.12)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#9e4b22]">
                Upload Workspace
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-stone-950 md:text-6xl">
                Bring invoice batches in cleanly before they hit the pipeline.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">
                Upload CSVs, validate column mapping, preview parsed invoice rows,
                and monitor import progress from one place before jobs move into
                processing.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-2 gap-3 rounded-[24px] border border-[rgba(86,67,43,0.12)] bg-white/65 p-4 text-sm text-stone-600 md:min-w-[340px]">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Files Today
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">14</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Success Rate
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">96.4%</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Pending Review
                </p>
                <p className="mt-1 text-2xl font-semibold text-[#c7632f]">19 Rows</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
                  Ready To Process
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">3 Batches</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-[rgba(86,67,43,0.14)] bg-white/60 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:translate-y-[-1px]"
            >
              Back To Dashboard
            </Link>
            <Link
              href="/jobs"
              className="rounded-full bg-[#c7632f] px-5 py-3 text-sm font-semibold text-[#fff7f0] transition hover:translate-y-[-1px]"
            >
              Review Processing Queue
            </Link>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <UploadDropzone />
          <div className="grid gap-4">
            {uploadHighlights.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-[24px] border border-[rgba(86,67,43,0.14)] bg-[rgba(255,250,243,0.88)] p-5 shadow-[0_18px_40px_rgba(58,40,23,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(199,99,47,0.12)] text-[#9e4b22]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
                    <p className="mt-1 text-sm leading-7 text-stone-600">{description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <CSVPreview rows={previewRows} />
          <UploadProgress jobs={uploadJobs} />
        </section>

        <section className="rounded-[28px] border border-[rgba(86,67,43,0.14)] bg-white/80 p-6 shadow-[0_18px_40px_rgba(58,40,23,0.08)]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(91,141,239,0.14)] text-[#315ea8]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#315ea8]">
                Suggested Next Step
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
                Standardize vendor CSV templates next.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">
                A shared import template will reduce manual review volume and make
                downstream invoice extraction more consistent across vendors.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
