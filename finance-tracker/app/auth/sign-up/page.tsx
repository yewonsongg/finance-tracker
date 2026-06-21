"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
      },
    });

    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email to confirm your account.");
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#b87d8d]">
          Get started
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#342c28] sm:text-5xl">
          Create your account.
        </h1>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-white/85 p-8 shadow-[0_20px_60px_rgba(190,140,150,0.12)] backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-[#342c28]">Sign up</h2>
        <p className="mt-2 text-sm text-[#8a7a74]">
          Create your account and confirm it from email.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-[#6f625d]">Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[#342c28] outline-none placeholder:text-[#b8aaa2] focus:border-[#e9aebd]"
              required
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-[#6f625d]">Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[#342c28] outline-none placeholder:text-[#b8aaa2] focus:border-[#e9aebd]"
              required
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-2xl bg-[#f4c7cf] px-4 py-3 font-medium text-white transition hover:bg-[#efb8c3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Creating account..." : "Create account"}
          </button>
        </form>

        {message ? (
          <p className="mt-4 rounded-2xl border border-[#e9aebd]/40 bg-[#fff3f6] px-4 py-3 text-sm text-[#7a4d58]">
            {message}
          </p>
        ) : null}

        <p className="mt-6 text-sm text-[#8a7a74]">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-[#b87d8d] hover:text-[#a86a7b]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
