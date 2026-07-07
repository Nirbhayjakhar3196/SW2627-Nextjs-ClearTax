"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { signup } from "../../services/auth.service";

export default function SignupPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async () => {
    await signup();
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="app-page page-shell--split">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-xl items-center justify-center">
        <article className="content-card w-full">
          <p className="section-eyebrow">Signup</p>
          <h1 className="section-title">Create your workspace account</h1>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Full Name" {...register("name")} />
            <Input label="Email" type="email" {...register("email")} />
            <Input label="Password" type="password" {...register("password")} />
            <Input label="Confirm Password" type="password" {...register("confirmPassword")} />
            <div className="action-row">
              <Button type="submit">Signup</Button>
            </div>
          </form>
          <p className="mt-6 font-sans text-sm text-stone-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--accent-strong)]">
              Login
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}
