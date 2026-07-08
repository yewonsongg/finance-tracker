import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/supabase/profiles";
import type { ProfileRow } from "@/lib/supabase/profiles";
import { buildDashboardData } from "@/lib/dashboard/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SpendingOverview } from "@/components/dashboard/spending-overview";

export default async function AnalyticsPage() {
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

  return (
    <DashboardShell data={data} activeHref="/dashboard/analytics">
      <section className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.85fr)]">
        <div className="min-h-0 w-full self-start">
          <SpendingOverview chartBars={data.chartBars} large />
        </div>

        <div className="flex w-full flex-col gap-3">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[#fff7f8] p-4">
            <h2 className="text-base font-semibold text-[#342c28]">Monthly Summary</h2>
            <div className="mt-3 space-y-2 text-sm text-[#6f625d]">
              <div className="flex items-center justify-between">
                <span>Total Spend</span>
                <span className="font-medium text-[#342c28]">$3,100</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Per Day</span>
                <span className="font-medium text-[#342c28]">$103</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Highest Week</span>
                <span className="font-medium text-[#342c28]">Week 3</span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
            <h2 className="text-base font-semibold text-[#342c28]">Insights</h2>
            <p className="mt-1.5 text-[11px] leading-5 text-[#6f625d]">
              Once transactions are connected, this area can show category trends,
              recurring expenses, and month-over-month comparisons.
            </p>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
