"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ArrowLeft, Key } from "lucide-react";
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

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Reset code must be exactly 6 digits"),
});

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function LoginPage() {
  const router = useRouter();
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const [view, setView] = useState("login"); // "login" | "forgot" | "verify-otp" | "reset"
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    setError: setErrorLogin,
    formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    setError: setErrorForgot,
    formState: { errors: errorsForgot, isSubmitting: isSubmittingForgot },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    setError: setErrorOtp,
    formState: { errors: errorsOtp, isSubmitting: isSubmittingOtp },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    setError: setErrorReset,
    formState: { errors: errorsReset, isSubmitting: isSubmittingReset },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onLoginSubmit = async (data) => {
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
      setErrorLogin("root", { message });
    }
  };

  const onForgotSubmit = async (data) => {
    try {
      const response = await axios.post("/auth/forgot-password", data);
      if (response.data.success) {
        setResetEmail(data.email);
        toast.success("Verification code sent!", {
          description: "Please check your email for the 6-digit verification code.",
        });
        setView("verify-otp");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to request password reset.";
      toast.error("Request failed", { description: message });
      setErrorForgot("root", { message });
    }
  };

  const onOtpSubmit = async (data) => {
    try {
      const response = await axios.post("/auth/verify-otp", {
        email: resetEmail,
        otp: data.otp,
      });
      if (response.data.success) {
        setResetOtp(data.otp);
        toast.success("Code verified!", {
          description: "Verification successful. Please enter your new password.",
        });
        setView("reset");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Verification failed. Invalid or expired code.";
      toast.error("Verification failed", { description: message });
      setErrorOtp("root", { message });
    }
  };

  const onResetSubmit = async (data) => {
    try {
      const response = await axios.post("/auth/reset-password", {
        email: resetEmail,
        otp: resetOtp,
        newPassword: data.password,
      });
      if (response.data.success) {
        toast.success("Password reset successful!", {
          description: "You can now sign in with your new password.",
        });
        setView("login");
        setResetEmail("");
        setResetOtp("");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Password reset failed.";
      toast.error("Reset failed", { description: message });
      setErrorReset("root", { message });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcff] flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full glass-card p-10 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/"
          className="inline-flex items-center text-[13px] font-medium text-stone-500 hover:text-[#9670f8] transition-colors mb-6 group self-start"
        >
          <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        {view === "login" && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f7f5ff] text-[#9670f8] mb-6 shadow-sm border border-white">
                <Lock size={26} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900">Welcome Back</h2>
              <p className="text-stone-500 mt-3 text-sm">Sign in to manage your bulk invoices</p>
            </div>

            {errorsLogin.root && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {errorsLogin.root.message}
              </div>
            )}

            <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-6" noValidate>
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="you@company.com"
                error={errorsLogin.email?.message}
                {...registerLogin("email")}
              />

              <div className="space-y-2">
                <Input
                  label="Password"
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                  error={errorsLogin.password?.message}
                  {...registerLogin("password")}
                />
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-xs font-semibold text-[#9670f8] hover:text-[#7d56e0] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                loading={isSubmittingLogin}
                icon={!isSubmittingLogin ? ArrowRight : undefined}
                className="w-full mt-8"
              >
                {isSubmittingLogin ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="mt-8 text-center text-[13px] font-medium text-stone-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#9670f8] hover:text-[#7d56e0] transition-colors font-semibold ml-1">
                Sign up
              </Link>
            </p>
          </>
        )}

        {view === "forgot" && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f7f5ff] text-[#9670f8] mb-6 shadow-sm border border-white">
                <Mail size={26} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900">Forgot Password</h2>
              <p className="text-stone-500 mt-3 text-sm">Enter your email and we will send you a reset code</p>
            </div>

            {errorsForgot.root && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {errorsForgot.root.message}
              </div>
            )}

            <form onSubmit={handleSubmitForgot(onForgotSubmit)} className="space-y-6" noValidate>
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="you@company.com"
                error={errorsForgot.email?.message}
                {...registerForgot("email")}
              />

              <Button
                type="submit"
                loading={isSubmittingForgot}
                icon={!isSubmittingForgot ? ArrowRight : undefined}
                className="w-full mt-8"
              >
                {isSubmittingForgot ? "Sending code..." : "Send Reset Code"}
              </Button>
            </form>

            <p className="mt-8 text-center text-[13px] font-medium text-stone-600">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-[#9670f8] hover:text-[#7d56e0] transition-colors font-semibold ml-1"
              >
                Sign in
              </button>
            </p>
          </>
        )}

        {view === "verify-otp" && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f7f5ff] text-[#9670f8] mb-6 shadow-sm border border-white">
                <Key size={26} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900">Verify Code</h2>
              <p className="text-stone-500 mt-3 text-sm">Enter the 6-digit reset code sent to your email ({resetEmail})</p>
            </div>

            {errorsOtp.root && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {errorsOtp.root.message}
              </div>
            )}

            <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-6" noValidate>
              <Input
                label="Verification Code (OTP)"
                type="text"
                icon={Mail}
                placeholder="6-digit code"
                error={errorsOtp.otp?.message}
                {...registerOtp("otp")}
              />

              <Button
                type="submit"
                loading={isSubmittingOtp}
                icon={!isSubmittingOtp ? ArrowRight : undefined}
                className="w-full mt-8"
              >
                {isSubmittingOtp ? "Verifying..." : "Verify Code"}
              </Button>
            </form>

            <p className="mt-8 text-center text-[13px] font-medium text-stone-600">
              Did not receive the code?{" "}
              <button
                type="button"
                onClick={() => setView("forgot")}
                className="text-[#9670f8] hover:text-[#7d56e0] transition-colors font-semibold ml-1"
              >
                Resend Code
              </button>
            </p>
          </>
        )}

        {view === "reset" && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f7f5ff] text-[#9670f8] mb-6 shadow-sm border border-white">
                <Lock size={26} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900">Reset Password</h2>
              <p className="text-stone-500 mt-3 text-sm">Set your new password below</p>
            </div>

            {errorsReset.root && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                {errorsReset.root.message}
              </div>
            )}

            <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-6" noValidate>
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errorsReset.password?.message}
                {...registerReset("password")}
              />

              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errorsReset.confirmPassword?.message}
                {...registerReset("confirmPassword")}
              />

              <Button
                type="submit"
                loading={isSubmittingReset}
                icon={!isSubmittingReset ? ArrowRight : undefined}
                className="w-full mt-8"
              >
                {isSubmittingReset ? "Resetting password..." : "Reset Password"}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
