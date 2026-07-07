import Link from "next/link";

import PageHeader from "../../components/common/PageHeader";
import ProcessingChart from "../../components/dashboard/ProcessingChart";
import JobsTable from "../../components/jobs/JobsTable";
import DashboardShell from "../../components/layout/DashboardShell";
import { jobs } from "../../lib/mock-data";

export default function JobsPage() {
  return (
    <DashboardShell>
      <div className="app-page page-shell--warm">
        <div className="page-shell">
        <PageHeader
          eyebrow="Jobs Workspace"
          title="Track the queue before exceptions spill into finance operations."
          description="Jobs give the team a batch-level view of uploads, validation progress, manual review routing, and final reconciliation movement."
          metrics={[
            { label: "Active Jobs", value: "18" },
            { label: "Need Review", value: "6", accent: true },
            { label: "Completed Today", value: "54" },
            { label: "Avg. Turnaround", value: "2h 14m" },
          ]}
          actions={
            <>
              <Link href="/upload" className="primary-action">
                Upload Another Batch
              </Link>
              <Link href="/reports" className="secondary-action">
                View Reports
              </Link>
            </>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <JobsTable jobs={jobs} />
          <ProcessingChart />
        </section>
        </div>
      </div>
    </DashboardShell>
  );
}
