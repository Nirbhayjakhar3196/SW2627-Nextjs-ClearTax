import Link from "next/link";

import PageHeader from "../../components/common/PageHeader";
import ReportCard from "../../components/reports/ReportCard";
import ReportTable from "../../components/reports/ReportTable";
import DashboardShell from "../../components/layout/DashboardShell";
import { reports } from "../../lib/mock-data";

export default function ReportsPage() {
  return (
    <DashboardShell>
      <div className="app-page page-shell--split">
        <div className="page-shell">
        <PageHeader
          eyebrow="Reports"
          title="Turn operational activity into exports the team can act on."
          description="The reporting area gathers weekly summaries, mismatch recovery snapshots, and vendor SLA breakdowns in one place for finance and ops."
          metrics={[
            { label: "Ready Exports", value: "12" },
            { label: "Pending Drafts", value: "3", accent: true },
            { label: "Shared This Week", value: "9" },
            { label: "Most Used Format", value: "PDF" },
          ]}
          actions={
            <>
              <Link href="/dashboard" className="secondary-action">
                Back to Dashboard
              </Link>
              <Link href="/invoices" className="primary-action">
                Inspect Invoices
              </Link>
            </>
          }
        />

        <section className="grid gap-6 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </section>

        <ReportTable reports={reports} />
        </div>
      </div>
    </DashboardShell>
  );
}
