"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/auth/signup", data);
      if (response.data.success) {
        toast.success("Account created!", {
          description: "You can now sign in with your credentials.",
        });
        router.push("/login?registered=true");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "An error occurred during signup";
      toast.error("Signup failed", { description: message });
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
            <User size={26} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">Create Account</h2>
          <p className="text-stone-500 mt-3 text-sm">Get started with ClearTax Invoice Processing</p>
        </div>

        {errors.root && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Input
            label="Full Name"
            type="text"
            icon={User}
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />

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
            {isSubmitting ? "Creating account..." : "Sign up"}
          </Button>
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
