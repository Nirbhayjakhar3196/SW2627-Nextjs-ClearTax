export default function ReportCard({ report }) {
  return (
    <article className="content-card">
      <p className="section-eyebrow">{report.status}</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-950">
        {report.title}
      </h3>
      <p className="mt-2 font-sans text-sm leading-7 text-stone-600">
        {report.insight}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 font-sans text-sm text-stone-500">
        <div>
          <p>Period</p>
          <p className="mt-1 font-semibold text-stone-950">{report.period}</p>
        </div>
        <div>
          <p>Format</p>
          <p className="mt-1 font-semibold text-stone-950">{report.format}</p>
        </div>
      </div>
    </article>
  );
}
