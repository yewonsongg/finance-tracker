import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/supabase/profiles";
import type { ProfileRow } from "@/lib/supabase/profiles";
import { buildDashboardData } from "@/lib/dashboard/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { listGoals } from "@/lib/supabase/goals";
import { listTransactions, toDashboardActivity } from "@/lib/supabase/transactions";

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
  const goals = await listGoals(supabase, user.id);
  const transactions = await listTransactions(supabase, user.id);
  const activity = transactions.map(toDashboardActivity);

  return <DashboardShell data={data} goals={goals} activity={activity} />;
}
