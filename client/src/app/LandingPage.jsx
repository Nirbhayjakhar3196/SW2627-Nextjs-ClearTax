"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UploadCloud, Cpu, TrendingUp } from "lucide-react";
import CountUp from "../components/ui/CountUp";
import FeaturesCarousel from "../components/ui/FeaturesCarousel";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

export default function Home() {


  return (
    <div className="app-page page-shell--split relative min-h-screen bg-transparent">
      <Navbar />

      <div className="w-full overflow-x-hidden relative">
        {/* Background Ambient Glowing Blobs */}
        <div className="ambient-glow-1"></div>
        <div className="ambient-glow-2"></div>

        <main className="landing-page relative z-10">
        {/* Hero Panel Section */}
        <motion.section
          className="hero-panel mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-layout">
            <div className="hero-split items-center lg:items-stretch">
              <div className="hero-content flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50/50 border border-indigo-100/50 rounded-full w-fit mb-6"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5a38ef] animate-pulse"></span>
                  <span className="text-xs font-semibold text-[#5a38ef] tracking-wide uppercase">New Release v1.0</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1c1834] max-w-xl mb-6 leading-[1.08] font-outfit">
                  Process Thousands of Invoices in <span className="gradient-text">Minutes</span>
                </h1>

                <p className="text-base md:text-lg text-stone-500 max-w-md mb-8 leading-relaxed font-sans">
                  Upload CSV invoices and process them asynchronously with real-time
                  tracking, review workflows, and reporting built for finance teams.
                </p>

                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#5a38ef] rounded-full hover:bg-[#401fd6] transition-all shadow-md hover:shadow-lg shadow-indigo-500/10" href="/signup">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link className="inline-flex items-center px-7 py-3.5 text-sm font-semibold text-stone-600 bg-white border border-stone-200/80 rounded-full hover:bg-stone-50 transition-all shadow-sm" href="#features">
                      Learn More
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Metric Board */}
              <div className="metric-board lg:ml-8 lg:w-[360px] self-center">
                <div className="metric-item cursor-default flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="metric-label">Daily Throughput</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
                  </div>
                  <p className="metric-value">
                    <CountUp value={25} suffix="k+" />
                  </p>
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </div>

                <div className="metric-item cursor-default flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="metric-label">Success Rate</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                  <p className="metric-value text-emerald-500">
                    <CountUp value={98.6} suffix="%" />
                  </p>
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#10b981] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </div>

                <div className="metric-item cursor-default flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="metric-label">Active Jobs</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                  </div>
                  <p className="metric-value">
                    <CountUp value={128} />
                  </p>
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </div>

                <div className="metric-item cursor-default flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="metric-label">Needs Review</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  </div>
                  <p className="metric-value text-rose-500">
                    <CountUp value={11} />
                  </p>
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Carousel Section */}
        <motion.section
          id="features"
          className="glass-card mb-16 p-10 relative overflow-hidden cursor-default"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-100/10 to-transparent rounded-br-full pointer-events-none"></div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-[#d2543d] mb-3 font-sans">Why choose ClearTax</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 font-outfit">
              Powerful automation for high-volume invoice processing
            </h2>
          </div>
          <FeaturesCarousel />
        </motion.section>

        {/* How It Works Section - Premium Redesign */}
        <motion.section
          id="pricing"
          className="mb-20 relative cursor-default"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Centered Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-[#d2543d] mb-3 font-sans">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-4 font-outfit">
              Three steps to invoice automation
            </h2>
            <p className="text-sm md:text-base text-stone-500 leading-relaxed max-w-lg mx-auto font-sans">
              No complicated setup. No training needed. If your team can format a basic CSV, they can run our batch processing pipeline.
            </p>
          </div>

          {/* Cards container with background line */}
          <div className="workflow-pipeline-container">
            <div className="workflow-pipeline-line" />
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: "Step 01",
                  title: "Upload Batch",
                  description: "Drag and drop high-volume CSV files containing thousands of invoices. Our pipeline instantly verifies headers, structures, and data formats in seconds.",
                  icon: UploadCloud,
                },
                {
                  step: "Step 02",
                  title: "Async Validation",
                  description: "Run multi-threaded schema validation and invoice matching jobs in background queues. Receive real-time progress updates without blocking your workspace.",
                  icon: Cpu,
                },
                {
                  step: "Step 03",
                  title: "Exception Review",
                  description: "Surface discrepancy warnings, GSTIN mismatches, and mathematical errors instantly. Reconcile exceptions with single-click actions and sync clean data directly to ERP ledgers.",
                  icon: TrendingUp,
                },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.article 
                    key={item.step} 
                    className="flex flex-col items-center text-center p-8 bg-white border border-stone-200/50 rounded-3xl shadow-sm relative z-20 group cursor-default"
                    whileHover={{ 
                      y: -8, 
                      boxShadow: "0 20px 40px -10px rgba(210, 84, 61, 0.08)",
                      borderColor: "rgba(210, 84, 61, 0.15)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Icon Squircle */}
                    <div className="w-14 h-14 rounded-2xl bg-orange-50/70 border border-orange-100/50 flex items-center justify-center text-[#d2543d] mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <IconComponent size={24} strokeWidth={1.8} />
                    </div>

                    <span className="text-[11px] font-bold text-[#d2543d] tracking-wider uppercase mb-2 font-sans">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mb-3 font-outfit">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed text-stone-400 font-sans max-w-[240px]">
                      {item.description}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* About Section - Premium Redesign */}
        <motion.section
          id="about"
          className="glass-card p-10 md:p-12 mb-8 relative overflow-hidden cursor-default"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-100/10 to-transparent rounded-br-full pointer-events-none"></div>
          
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 relative z-10">
            {/* Left Column - Business Benefits & Copy */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-5 text-left">
              <p className="text-xs font-bold tracking-widest uppercase text-[#d2543d] font-sans">Why ClearTax</p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 leading-tight font-outfit">
                Why finance operations scale with ClearTax
              </h2>
              <p className="text-sm md:text-base text-stone-500 leading-relaxed font-sans">
                Manual invoice validation and reconciliation drain valuable finance resources, causing audit backlogs and cash flow bottlenecks. ClearTax automates high-volume processing with an enterprise-grade async engine that turns days of data entry into minutes of automated checking.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-stone-800 font-outfit flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d2543d]"></span> 90% Time Saved
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    Eliminate line-by-line spreadsheet reviews. Let our background workers find and flag pricing errors instantly.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-stone-800 font-outfit flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d2543d]"></span> Risk Mitigation
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    Catch GSTIN mismatches, pricing discrepancies, and compliance issues prior to ledger submission.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-stone-800 font-outfit flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d2543d]"></span> Seamless Integration
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    Directly export clean ERP-compatible formats and sync results to SAP, Tally, or custom ledgers.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-stone-800 font-outfit flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d2543d]"></span> Full Transparency
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    Maintains a cryptographic audit trail of all schema mapping validations and user reconciliation actions.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Value in Numbers Card */}
            <div className="md:col-span-5 flex items-center justify-center">
              <div className="w-full bg-[#fcfbfa]/90 border border-stone-200/50 p-8 rounded-3xl shadow-sm text-center space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/40 rounded-bl-full pointer-events-none"></div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-sans">Value in Numbers</h3>
                
                <div className="space-y-1">
                  <p className="text-4xl md:text-5xl font-extrabold text-stone-900 font-outfit leading-none">10x</p>
                  <p className="text-xs font-semibold text-stone-500 font-sans">Faster invoice reconciliation</p>
                </div>
                <div className="w-full h-[1px] bg-stone-200/50" />
                <div className="space-y-1">
                  <p className="text-4xl md:text-5xl font-extrabold text-stone-900 font-outfit leading-none">99.9%</p>
                  <p className="text-xs font-semibold text-stone-500 font-sans">Tax calculation accuracy</p>
                </div>
                <div className="w-full h-[1px] bg-stone-200/50" />
                <div className="space-y-1">
                  <p className="text-4xl md:text-5xl font-extrabold text-[#d2543d] font-outfit leading-none">0%</p>
                  <p className="text-xs font-semibold text-stone-500 font-sans">ERP data entry errors</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
        <Footer />
      </div>
    </div>
  );
}
