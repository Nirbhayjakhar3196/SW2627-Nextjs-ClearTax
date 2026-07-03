export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero-panel">
        <p className="eyebrow">Phase 1 • Foundation</p>
        <h1>Invoice operations, organized from one workspace.</h1>
        <p className="hero-copy">
          This is the base shell for the ClearTax invoice processing frontend.
          We&apos;re keeping the work inside <code>src/</code> for now so the app
          router foundation is stable before building the rest of the screens.
        </p>

        <div className="hero-actions">
          <a className="primary-action" href="/dashboard">
            Open Dashboard
          </a>
          <a className="secondary-action" href="/upload">
            Go To Upload
          </a>
        </div>
      </section>

      <section className="foundation-grid" aria-label="Foundation overview">
        <article className="foundation-card">
          <span>Layout</span>
          <h2>Shared app wrapper</h2>
          <p>
            The root layout now resolves styles from <code>src/app</code> and
            provides the global shell for all upcoming routes.
          </p>
        </article>

        <article className="foundation-card">
          <span>Page</span>
          <h2>Focused entry screen</h2>
          <p>
            The home page acts as a stable launch point while the dashboard,
            upload flow, jobs, and invoice routes are built out.
          </p>
        </article>

        <article className="foundation-card">
          <span>Styles</span>
          <h2>Global design tokens</h2>
          <p>
            Colors, spacing, typography, and surface styles now live in one
            place so later components stay consistent.
          </p>
        </article>
      </section>
    </main>
  );
}
