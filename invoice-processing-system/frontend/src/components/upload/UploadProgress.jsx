const statusTone = {
  Uploading: "text-[var(--accent-strong)] bg-[rgba(124,108,242,0.12)]",
  Queued: "text-stone-700 bg-stone-100",
  Validated: "text-emerald-700 bg-emerald-50",
};

export default function UploadProgress({ jobs = [] }) {
  return (
    <section className="content-card">
      <div>
        <p className="section-eyebrow">Upload Progress</p>
        <h2 className="section-title">Current batch status</h2>
        <p className="section-copy">
          Track staged imports while files upload, validate, and prepare for
          processing jobs.
        </p>
      </div>

      <div className="mt-6 stack-list">
        {jobs.map((job) => (
          <article key={job.label} className="list-item-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-stone-950">
                  {job.label}
                </h3>
                <p className="mt-1 text-sm leading-7 text-stone-500">
                  {job.detail}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  statusTone[job.status] || statusTone.Queued
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                <span>Progress</span>
                <span>{job.progress}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-[rgba(148,163,184,0.14)]">
                <div
                  className="h-2.5 rounded-full bg-[linear-gradient(90deg,#8c7bfd_0%,#5c48dc_100%)]"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
