export default function JobTimeline({ timeline = [] }) {
  return (
    <section className="content-card">
      <div>
        <p className="section-eyebrow">Timeline</p>
        <h2 className="section-title">Job progression</h2>
      </div>

      <div className="mt-6 space-y-4">
        {timeline.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`mt-1 inline-flex h-3 w-3 rounded-full ${
                  item.state === "done"
                    ? "bg-emerald-500"
                    : item.state === "active"
                      ? "bg-[var(--accent)]"
                      : "bg-stone-300"
                }`}
              />
              {index < timeline.length - 1 ? (
                <span className="mt-2 h-full w-px bg-[rgba(30,64,97,0.12)]" />
              ) : null}
            </div>

            <div className="pb-5">
              <p className="font-sans text-sm font-semibold text-stone-950">
                {item.label}
              </p>
              <p className="mt-1 font-sans text-sm text-stone-500">{item.at}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
