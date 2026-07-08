import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/supabase/profiles";
import type { ProfileRow } from "@/lib/supabase/profiles";
import { buildDashboardData } from "@/lib/dashboard/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

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
    currentMonthSpend: true,
    latestGoals: true,
    quickReminders: true,
    recentActivity: true,
  };

  async function saveProfile(formData: FormData) {
    "use server";

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) {
      redirect("/auth/sign-in");
    }

    const fullName = String(formData.get("full_name") ?? "").trim() || null;
    const avatarUrl = String(formData.get("avatar_url") ?? "").trim() || null;

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("dashboard_card_visibility")
      .eq("id", currentUser.id)
      .maybeSingle();

    await supabase.from("profiles").upsert({
      id: currentUser.id,
      email: currentUser.email ?? null,
      full_name: fullName,
      avatar_url: avatarUrl,
      dashboard_card_visibility:
        existingProfile?.dashboard_card_visibility ?? {
          currentMonthSpend: true,
          latestGoals: true,
          quickReminders: true,
          recentActivity: true,
      },
      updated_at: new Date().toISOString(),
    }).select("id");

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
  }

  async function saveDashboardCards(formData: FormData) {
    "use server";

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) {
      redirect("/auth/sign-in");
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("full_name,avatar_url")
      .eq("id", currentUser.id)
      .maybeSingle();

    const dashboardCardVisibility = {
      currentMonthSpend: formData.get("current_month_spend") === "on",
      latestGoals: formData.get("latest_goals") === "on",
      quickReminders: formData.get("quick_reminders") === "on",
      recentActivity: formData.get("recent_activity") === "on",
    };

    await supabase.from("profiles").upsert({
      id: currentUser.id,
      email: currentUser.email ?? null,
      full_name: existingProfile?.full_name ?? null,
      avatar_url: existingProfile?.avatar_url ?? null,
      dashboard_card_visibility: dashboardCardVisibility,
      updated_at: new Date().toISOString(),
    }).select("id");

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

          <form action={saveProfile} className="mt-4 grid gap-3">
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

          <form action={saveDashboardCards} className="mt-4 grid gap-3">
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]">
              <span>Current Month Spend</span>
              <input
                type="checkbox"
                name="current_month_spend"
                defaultChecked={visibility.currentMonthSpend}
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]">
              <span>Latest Goals</span>
              <input type="checkbox" name="latest_goals" defaultChecked={visibility.latestGoals} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]">
              <span>Quick Reminders</span>
              <input type="checkbox" name="quick_reminders" defaultChecked={visibility.quickReminders} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]">
              <span>Recent Activity</span>
              <input type="checkbox" name="recent_activity" defaultChecked={visibility.recentActivity} />
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
