import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/supabase/profiles";
import type { ProfileRow } from "@/lib/supabase/profiles";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/auth/sign-in");
  }

  let profile: ProfileRow = {
    id: user.id,
    email: user.email ?? null,
    full_name: null,
  };

  try {
    profile = await getOrCreateProfile(supabase, user.id, user.email ?? null);
  } catch {
    profile = {
      id: user.id,
      email: user.email ?? null,
      full_name: null,
    };
  }

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-3 rounded-[2rem] border border-[var(--border)] bg-white/85 p-8 shadow-[0_20px_60px_rgba(190,140,150,0.12)] backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-[#b87d8d]">
            Dashboard
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#342c28]">
            Welcome back{profile.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[#6f625d]">
            This is your starting point for balances, transactions, and account data pulled from Supabase.
          </p>
          <form action="/auth/sign-out" method="post" className="pt-2">
            <button
              type="submit"
              className="rounded-2xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-medium text-[#3b2f2e] transition hover:bg-[#fff7f6]"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-sm text-[#8a7a74]">Signed in as</p>
            <p className="mt-2 text-lg font-medium text-[#342c28]">{profile.email ?? user.email}</p>
          </div>
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-sm text-[#8a7a74]">Account id</p>
            <p className="mt-2 break-all text-lg font-medium text-[#342c28]">{profile.id}</p>
          </div>
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-sm text-[#8a7a74]">Status</p>
            <p className="mt-2 text-lg font-medium text-[#342c28]">Synced with Supabase</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-white/85 p-8 shadow-[0_20px_60px_rgba(190,140,150,0.12)]">
          <h2 className="text-2xl font-semibold text-[#342c28]">Next sections</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f625d]">
            We can add transaction cards, chart summaries, recent activity, and editable profile data here next.
          </p>
        </div>
      </section>
    </main>
  );
}
