"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, FileSpreadsheet, TimerReset, Workflow, ArrowRight } from "lucide-react";

import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

const features = [
  {
    title: "Bulk Uploads",
    description: "Import high-volume CSV invoice batches without slowing down finance operations.",
    icon: FileSpreadsheet,
    color: "blue",
  },
  {
    title: "Async Processing",
    description: "Track jobs in real time while parsing, validation, and matching run in the background.",
    icon: Workflow,
    color: "purple",
  },
  {
    title: "Faster Reviews",
    description: "Surface mismatches and exceptions early so teams spend less time reconciling manually.",
    icon: TimerReset,
    color: "emerald",
  },
  {
    title: "Enterprise Visibility",
    description: "Keep reporting, invoice status, and audit trails in one secure workspace.",
    icon: CheckCircle2,
    color: "rose",
  },
];

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18,
      },
    },
  };

  return (
    <div className="app-page page-shell--split relative min-h-screen overflow-hidden bg-[#faf9ff]">
      {/* Background Ambient Glowing Blobs */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <Navbar />

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
                  <p className="metric-value">25k+</p>
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </div>
                
                <div className="metric-item cursor-default flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="metric-label">Success Rate</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                  <p className="metric-value text-emerald-500">98.6%</p>
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#10b981] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </div>
                
                <div className="metric-item cursor-default flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="metric-label">Active Jobs</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                  </div>
                  <p className="metric-value">128</p>
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </div>
                
                <div className="metric-item cursor-default flex flex-col justify-between relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-1">
                    <p className="metric-label">Needs Review</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  </div>
                  <p className="metric-value text-rose-500">11</p>
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-rose-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Feature Bento Grid Section */}
        <motion.section 
          id="features" 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10" 
          aria-label="Features"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map(({ title, description, icon: Icon }) => (
            <motion.article 
              key={title} 
              variants={itemVariants}
              className="glass-card p-7 flex flex-col gap-3 relative overflow-hidden group cursor-default"
            >
              <div className="feature-icon w-11 h-11 mb-2 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-[#5a38ef] group-hover:bg-[#5a38ef] group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-stone-900 font-outfit">{title}</h2>
              <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
            </motion.article>
          ))}
        </motion.section>

        {/* How It Works Grid Section */}
        <motion.section 
          id="pricing" 
          className="glass-card mb-16 p-10 relative overflow-hidden cursor-default"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-100/30 to-transparent rounded-bl-full pointer-events-none"></div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#5a38ef] mb-8 font-sans">Workflow Pipeline</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["1. Upload batch", "Drop in large CSV invoice files from your finance team or vendor partners."],
              ["2. Async validation", "Run schema checks, pricing validations, and math checks in background queues."],
              ["3. Exception review", "Reconcile flagged items, exports clean reports, and trigger ledger syncing."],
            ].map(([title, description]) => (
              <article key={title} className="flex flex-col gap-3 group">
                <h3 className="text-lg font-bold text-stone-900 font-outfit group-hover:text-[#5a38ef] transition-colors">{title}</h3>
                <p className="text-sm leading-relaxed text-stone-500">{description}</p>
              </article>
            ))}
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section 
          id="about" 
          className="glass-card p-10 mb-8 relative overflow-hidden cursor-default"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-100/20 to-transparent rounded-br-full pointer-events-none"></div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#ff8c70] mb-3 font-sans">About</p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 mb-4 max-w-xl font-outfit">A clean, high-performance way to manage invoice automation.</h2>
          <p className="text-base text-stone-500 leading-relaxed max-w-2xl">
            This dashboard is designed for operations and finance teams that need
            spacious UI, reliable status visibility, and fast movement from upload to reporting.
          </p>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
