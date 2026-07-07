"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ShieldCheck } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { login } from "../../services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async () => {
    await login();
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="app-page page-shell--split">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center">
        <section className="grid w-full gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="hero-panel surface-panel surface-panel--hero panel-padding">
            <div className="hero-layout">
              <div className="feature-icon">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="eyebrow">Secure Sign In</p>
                <h1 className="hero-title">Access the invoice operations workspace.</h1>
                <p className="hero-copy">
                  Sign in to continue monitoring uploads, jobs, invoice reviews, and reporting.
                </p>
              </div>
            </div>
          </article>

          <article className="content-card">
            <p className="section-eyebrow">Login</p>
            <h2 className="section-title">Welcome back</h2>
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <Input label="Email" placeholder="name@company.com" {...register("email")} />
              <Input label="Password" type="password" placeholder="Enter your password" {...register("password")} />
              <div className="flex items-center justify-between font-sans text-sm text-stone-500">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" {...register("remember")} />
                  Remember Me
                </label>
                <span>Forgot Password</span>
              </div>
              <div className="action-row">
                <Button type="submit">Login</Button>
              </div>
            </form>
            <p className="mt-6 font-sans text-sm text-stone-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-[var(--accent-strong)]">
                Signup
              </Link>
            </p>
          </article>
        </section>
      </div>
    </div>
  );
}
