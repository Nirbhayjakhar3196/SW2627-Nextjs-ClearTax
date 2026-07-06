import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero-panel">
        <div className="hero-layout">
          <p className="eyebrow">ClearTax Workspace</p>
          <h1 className="hero-title">Invoice operations, organized from one workspace.</h1>
          <p className="hero-copy">
            The foundation, dashboard, and upload flow now share one visual
            system so the product already feels coherent before the remaining
            modules are built.
          </p>

          <div className="hero-actions">
            <Link className="primary-action" href="/dashboard">
              Open Dashboard
            </Link>
            <Link className="secondary-action" href="/upload">
              Go To Upload
            </Link>
          </div>
        </div>
      </section>

      <section className="foundation-grid" aria-label="Foundation overview">
        <article className="foundation-card">
          <span>Layout</span>
          <h2>Shared shell</h2>
          <p>Common surfaces, spacing, and action styles now connect the screens.</p>
        </article>

        <article className="foundation-card">
          <span>Page</span>
          <h2>Landing Page</h2>
          <p>The home page now routes cleanly into the operational dashboard and upload flow.</p>
        </article>

        <article className="foundation-card">
          <span>Styles</span>
          <h2>Global design tokens</h2>
          <p>Colors, spacing, typography, buttons, metrics, and panels are aligned.</p>
        </article>
      </section>
    </main>
  );
}
