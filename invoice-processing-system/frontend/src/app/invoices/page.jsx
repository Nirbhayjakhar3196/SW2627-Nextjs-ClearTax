import Link from "next/link";

import InvoiceFilter from "../../components/invoices/InvoiceFilter";
import InvoiceTable from "../../components/invoices/InvoiceTable";
import DashboardShell from "../../components/layout/DashboardShell";
import PageHeader from "../../components/common/PageHeader";
import { invoices } from "../../lib/mock-data";

export default function InvoicesPage() {
  return (
    <DashboardShell>
      <div className="app-page page-shell--warm">
        <div className="page-shell">
        <PageHeader
          eyebrow="Invoices"
          title="Keep every invoice visible from import through reconciliation."
          description="Review invoice-level matching health, identify mismatches quickly, and trace each record back to the source job without leaving the workspace."
          metrics={[
            { label: "Invoices Today", value: "418" },
            { label: "Need Review", value: "11", accent: true },
            { label: "Auto Matched", value: "364" },
            { label: "Recovery Value", value: "₹8.4L" },
          ]}
          actions={
            <>
              <Link href="/upload" className="primary-action">
                Upload Source Files
              </Link>
              <Link href="/reports" className="secondary-action">
                Export Summary
              </Link>
            </>
          }
        />

        <InvoiceFilter />
        <InvoiceTable invoices={invoices} />
        </div>
      </div>
    </DashboardShell>
  );
}
