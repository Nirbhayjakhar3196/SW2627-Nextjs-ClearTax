"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // MOCK DATA STANDIN
    setTimeout(() => {
      if (name && email && password) {
        setUser({ name, email });
        router.push("/login");
      } else {
        setError("Please fill out all fields");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fcfcff] flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full glass-card p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f7f5ff] text-[#9670f8] mb-6 shadow-sm border border-white">
            <User size={26} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">Create Account</h2>
          <p className="text-stone-500 mt-3 text-sm">Get started with ClearTax Invoice Processing</p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[13px] font-semibold text-stone-700 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#9670f8] transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9670f8] focus:border-transparent transition-all outline-none text-stone-900 bg-white shadow-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-stone-700 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#9670f8] transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9670f8] focus:border-transparent transition-all outline-none text-stone-900 bg-white shadow-sm"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-stone-700 uppercase tracking-wider mb-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#9670f8] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#9670f8] focus:border-transparent transition-all outline-none text-stone-900 bg-white shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full primary-action mt-8 flex justify-center items-center py-3.5 text-[15px]"
          >
            <span>{loading ? "Creating account..." : "Sign up"}</span>
            {!loading && <ArrowRight size={18} className="ml-2" />}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] font-medium text-stone-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[#9670f8] hover:text-[#7d56e0] transition-colors font-semibold ml-1">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
