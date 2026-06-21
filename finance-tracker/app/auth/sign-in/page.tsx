"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setPending(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
          Welcome back
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Sign in to your finance tracker.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
          Use your Supabase auth provider to get back into your dashboard and
          continue tracking transactions, balances, and goals.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur">
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="mt-2 text-sm text-slate-400">
          Enter your email and password to authenticate.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300">Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              required
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-slate-300">Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
              required
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-2xl bg-cyan-300 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {message ? (
          <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {message}
          </p>
        ) : null}

        <p className="mt-6 text-sm text-slate-400">
          New here?{" "}
          <Link href="/auth/sign-up" className="text-cyan-200 hover:text-cyan-100">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
