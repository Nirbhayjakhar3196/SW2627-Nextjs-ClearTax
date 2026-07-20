"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import axios from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/auth/login", data);
      if (response.data.success) {
        setCredentials(response.data.user, response.data.token);
        toast.success("Welcome back!", {
          description: "You have been signed in successfully.",
        });
        router.push("/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      toast.error("Sign in failed", { description: message });
      setError("root", { message });
    }
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
            <Lock size={26} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">Welcome Back</h2>
          <p className="text-stone-500 mt-3 text-sm">Sign in to manage your bulk invoices</p>
        </div>

        {errors.root && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            icon={!isSubmitting ? ArrowRight : undefined}
            className="w-full mt-8"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-8 text-center text-[13px] font-medium text-stone-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#9670f8] hover:text-[#7d56e0] transition-colors font-semibold ml-1">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
