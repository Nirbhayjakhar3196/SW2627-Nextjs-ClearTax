export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  metrics,
}) {
  return (
    <section className="hero-panel surface-panel surface-panel--hero panel-padding">
      <div className="hero-layout">
        <div className="hero-split">
          <div className="hero-content">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="hero-title">{title}</h1>
            {description ? <p className="hero-copy">{description}</p> : null}
          </div>

          {metrics?.length ? (
            <div className="metric-board">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-item">
                  <p className="metric-label">{metric.label}</p>
                  <p
                    className={`metric-value ${metric.accent ? "metric-value--accent" : ""}`}
                  >
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {actions ? <div className="action-row">{actions}</div> : null}
      </div>
    </section>
  );
}
