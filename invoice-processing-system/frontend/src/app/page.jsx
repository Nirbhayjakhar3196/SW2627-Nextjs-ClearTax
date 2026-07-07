import Link from "next/link";
import { CheckCircle2, FileSpreadsheet, TimerReset, Workflow } from "lucide-react";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const features = [
  {
    title: "Bulk Uploads",
    description: "Import high-volume CSV invoice batches without slowing down finance operations.",
    icon: FileSpreadsheet,
  },
  {
    title: "Async Processing",
    description: "Track jobs in real time while parsing, validation, and matching run in the background.",
    icon: Workflow,
  },
  {
    title: "Faster Reviews",
    description: "Surface mismatches and exceptions early so teams spend less time reconciling manually.",
    icon: TimerReset,
  },
  {
    title: "Enterprise Visibility",
    description: "Keep reporting, invoice status, and audit trails in one secure workspace.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  return (
    <div className="app-page page-shell--split">
      <Navbar />
      <main className="landing-page">
        <section className="hero-panel">
          <div className="hero-layout">
            <div className="hero-split">
              <div className="hero-content">
                <h1 className="hero-title">Process Thousands of Invoices in Minutes</h1>
                <p className="hero-copy">
                  Upload CSV invoices and process them asynchronously with real-time
                  tracking, review workflows, and reporting built for finance teams.
                </p>
                <div className="hero-actions">
                  <Link className="primary-action" href="/signup">
                    Get Started
                  </Link>
                  <Link className="secondary-action" href="#features">
                    Learn More
                  </Link>
                </div>
              </div>

              <div className="metric-board">
                <div className="metric-item">
                  <p className="metric-label">Daily Throughput</p>
                  <p className="metric-value">25k+</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Success Rate</p>
                  <p className="metric-value metric-value--accent">98.6%</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Active Jobs</p>
                  <p className="metric-value">128</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Needs Review</p>
                  <p className="metric-value">11</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="foundation-grid" aria-label="Features">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="foundation-card">
              <div className="feature-icon">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4">{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </section>

        <section id="pricing" className="content-card">
          <p className="section-eyebrow">How It Works</p>
          <div className="foundation-grid mt-6">
            {[
              ["1. Upload", "Drop in large CSV invoice files from your team or vendors."],
              ["2. Process", "Run async parsing, validation, and matching across the batch."],
              ["3. Review", "Resolve flagged exceptions and export clean reports."],
            ].map(([title, description]) => (
              <article key={title} className="list-item-card">
                <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
                <p className="mt-2 font-sans text-sm leading-7 text-stone-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="content-card">
          <p className="section-eyebrow">About</p>
          <h2 className="section-title">A cleaner way to manage invoice-heavy finance workflows.</h2>
          <p className="section-copy max-w-3xl">
            This SaaS dashboard is designed for operations and finance teams that need
            spacious UI, reliable status visibility, and fast movement from upload to reporting.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
