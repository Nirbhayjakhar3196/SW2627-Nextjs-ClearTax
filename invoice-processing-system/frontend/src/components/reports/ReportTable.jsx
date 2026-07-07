export default function ReportTable({ reports }) {
  return (
    <section className="content-card">
      <div>
        <p className="section-eyebrow">Report Archive</p>
        <h2 className="section-title">Operational exports</h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-[24px] border border-[rgba(30,64,97,0.12)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[rgba(240,248,255,0.92)] text-left text-xs uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-4 py-4 font-semibold">Report</th>
                <th className="px-4 py-4 font-semibold">Period</th>
                <th className="px-4 py-4 font-semibold">Generated</th>
                <th className="px-4 py-4 font-semibold">Owner</th>
                <th className="px-4 py-4 font-semibold">Format</th>
                <th className="px-4 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-t border-[rgba(30,64,97,0.08)] font-sans text-sm text-stone-700"
                >
                  <td className="px-4 py-4 font-semibold text-stone-950">{report.title}</td>
                  <td className="px-4 py-4">{report.period}</td>
                  <td className="px-4 py-4">{report.generatedAt}</td>
                  <td className="px-4 py-4">{report.owner}</td>
                  <td className="px-4 py-4">{report.format}</td>
                  <td className="px-4 py-4">{report.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
