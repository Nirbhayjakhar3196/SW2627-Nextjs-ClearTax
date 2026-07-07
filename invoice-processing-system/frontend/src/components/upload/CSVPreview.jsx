const statusTone = {
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Needs Review": "bg-amber-50 text-amber-700 border-amber-200",
  Mapped: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function CSVPreview({ rows = [] }) {
  return (
    <section className="content-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-eyebrow">CSV Preview</p>
          <h2 className="section-title">Parsed rows before import</h2>
          <p className="section-copy">
            Review a sample of parsed invoice rows so date, amount, and vendor
            mapping issues can be caught before batch submission.
          </p>
        </div>

        <div className="mini-metrics text-sm">
          <div className="mini-metric">
            <p className="mini-metric-label">Rows detected</p>
            <p className="mini-metric-value">418</p>
          </div>
          <div className="mini-metric">
            <p className="mini-metric-label">Issues found</p>
            <p className="mini-metric-value" style={{ color: "var(--accent)" }}>11</p>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[rgba(124,108,242,0.14)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[rgba(247,245,255,0.92)] text-left text-xs uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-4 py-4 font-semibold">Invoice ID</th>
                <th className="px-4 py-4 font-semibold">Vendor</th>
                <th className="px-4 py-4 font-semibold">Invoice Date</th>
                <th className="px-4 py-4 font-semibold">Amount</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((row) => (
                <tr
                  key={row.invoiceId}
                  className="border-t border-[rgba(124,108,242,0.08)] text-sm text-stone-700"
                >
                  <td className="px-4 py-4 font-semibold text-stone-950">
                    {row.invoiceId}
                  </td>
                  <td className="px-4 py-4">{row.vendor}</td>
                  <td className="px-4 py-4">{row.invoiceDate}</td>
                  <td className="px-4 py-4">{row.amount}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        statusTone[row.status] || statusTone.Ready
                      }`}
                    >
                      {row.status}
                    </span>
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
