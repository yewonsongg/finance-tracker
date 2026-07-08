import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/supabase/profiles";
import type { ProfileRow } from "@/lib/supabase/profiles";
import { buildDashboardData } from "@/lib/dashboard/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function SettingsPage() {
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
    avatar_url: null,
    dashboard_card_visibility: null,
  };

  try {
    profile = await getOrCreateProfile(supabase, user.id, user.email ?? null);
  } catch {
    profile = {
      id: user.id,
      email: user.email ?? null,
      full_name: null,
      avatar_url: null,
      dashboard_card_visibility: null,
    };
  }

  const data = buildDashboardData(profile, user.email ?? null);
  const visibility = profile.dashboard_card_visibility ?? {
    totalBalance: true,
    monthlyIncome: true,
    monthlySpend: true,
    savingsRate: true,
  };

  async function saveSettings(formData: FormData) {
    "use server";

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) {
      redirect("/auth/sign-in");
    }

    const fullName = String(formData.get("full_name") ?? "").trim() || null;
    const avatarUrl = String(formData.get("avatar_url") ?? "").trim() || null;

    const dashboardCardVisibility = {
      totalBalance: formData.get("total_balance") === "on",
      monthlyIncome: formData.get("monthly_income") === "on",
      monthlySpend: formData.get("monthly_spend") === "on",
      savingsRate: formData.get("savings_rate") === "on",
    };

    await supabase.from("profiles").upsert({
      id: currentUser.id,
      email: currentUser.email ?? null,
      full_name: fullName,
      avatar_url: avatarUrl,
      dashboard_card_visibility: dashboardCardVisibility,
      updated_at: new Date().toISOString(),
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
  }

  return (
    <DashboardShell data={data} activeHref="/dashboard/settings">
      <section className="grid gap-3 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-white p-5">
          <h2 className="text-lg font-semibold text-[#342c28]">Profile</h2>
          <p className="mt-2 text-xs text-[#6f625d]">
            Update your name and profile picture here.
          </p>

          <form action={saveSettings} className="mt-4 grid gap-3">
            <label className="grid gap-1.5 text-sm text-[#342c28]">
              <span className="text-xs font-medium text-[#6f625d]">Name</span>
              <input
                name="full_name"
                defaultValue={profile.full_name ?? ""}
                placeholder="Your name"
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
              />
            </label>
            <label className="grid gap-1.5 text-sm text-[#342c28]">
              <span className="text-xs font-medium text-[#6f625d]">Profile picture URL</span>
              <input
                name="avatar_url"
                defaultValue={profile.avatar_url ?? ""}
                placeholder="https://..."
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-2xl bg-[#f4c7cf] px-4 py-2.5 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-[#efb8c3]"
            >
              Save profile
            </button>
          </form>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[#fff7f8] p-5">
          <h2 className="text-lg font-semibold text-[#342c28]">Dashboard Cards</h2>
          <p className="mt-2 text-xs text-[#6f625d]">
            Choose which of the four top cards appear on your dashboard.
          </p>

          <form action={saveSettings} className="mt-4 grid gap-3">
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]">
              <span>Total Balance</span>
              <input type="checkbox" name="total_balance" defaultChecked={visibility.totalBalance} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]">
              <span>Monthly Income</span>
              <input type="checkbox" name="monthly_income" defaultChecked={visibility.monthlyIncome} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]">
              <span>Monthly Spend</span>
              <input type="checkbox" name="monthly_spend" defaultChecked={visibility.monthlySpend} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]">
              <span>Savings Rate</span>
              <input type="checkbox" name="savings_rate" defaultChecked={visibility.savingsRate} />
            </label>
            <button
              type="submit"
              className="w-fit rounded-2xl bg-[#f4c7cf] px-4 py-2.5 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-[#efb8c3]"
            >
              Save dashboard cards
            </button>
          </form>
        </div>
      </section>
    </DashboardShell>
  );
}
