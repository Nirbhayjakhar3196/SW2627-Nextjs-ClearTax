"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
        <motion.section 
          className="hero-panel mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="hero-layout">
            <div className="hero-split">
              <div className="hero-content">
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#2d264b] max-w-lg mb-4 leading-[1.1]">Process Thousands of Invoices in Minutes</h1>
                <p className="text-lg text-stone-500 max-w-md mb-8 leading-relaxed">
                  Upload CSV invoices and process them asynchronously with real-time
                  tracking, review workflows, and reporting built for finance teams.
                </p>
                <div className="flex gap-4">
                  <Link className="px-6 py-2.5 text-sm font-medium text-white bg-[#2d264b] rounded-full hover:bg-stone-800 transition-all shadow-sm" href="/signup">
                    Get Started
                  </Link>
                  <Link className="px-6 py-2.5 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-all" href="#features">
                    Learn More
                  </Link>
                </div>
              </div>

              <div className="metric-board lg:ml-8">
                <div className="metric-item hover:-translate-y-1 transition-transform cursor-default">
                  <p className="metric-label">Daily Throughput</p>
                  <p className="metric-value">25k+</p>
                </div>
                <div className="metric-item hover:-translate-y-1 transition-transform cursor-default">
                  <p className="metric-label">Success Rate</p>
                  <p className="metric-value metric-value--accent">98.6%</p>
                </div>
                <div className="metric-item hover:-translate-y-1 transition-transform cursor-default">
                  <p className="metric-label">Active Jobs</p>
                  <p className="metric-value">128</p>
                </div>
                <div className="metric-item hover:-translate-y-1 transition-transform cursor-default">
                  <p className="metric-label">Needs Review</p>
                  <p className="metric-value">11</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          id="features" 
          className="grid md:grid-cols-3 gap-6 mb-16 relative z-10" 
          aria-label="Features"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {features.slice(0, 3).map(({ title, description, icon: Icon }) => (
            <motion.article 
              key={title} 
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
              className="glass-card p-6 flex flex-col gap-3"
            >
              <div className="feature-icon w-10 h-10 mb-2">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-stone-900">{title}</h2>
              <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
            </motion.article>
          ))}
        </motion.section>

        <section id="pricing" className="content-card mb-16 p-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#9670f8] mb-6">How It Works</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              ["1. Upload", "Drop in large CSV invoice files from your team or vendors."],
              ["2. Process", "Run async parsing, validation, and matching across the batch."],
              ["3. Review", "Resolve flagged exceptions and export clean reports."],
            ].map(([title, description]) => (
              <article key={title} className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-stone-900">{title}</h3>
                <p className="text-sm leading-relaxed text-stone-500">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="content-card p-8 mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#ffb4a2] mb-3">About</p>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 mb-4">A cleaner way to manage invoice-heavy workflows.</h2>
          <p className="text-base text-stone-500 leading-relaxed max-w-2xl">
            This dashboard is designed for operations and finance teams that need
            spacious UI, reliable status visibility, and fast movement from upload to reporting.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
