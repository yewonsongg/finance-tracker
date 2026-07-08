import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/supabase/profiles";
import type { ProfileRow } from "@/lib/supabase/profiles";
import { buildDashboardData } from "@/lib/dashboard/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { GoalForm } from "@/components/dashboard/goal-form";
import { createGoal, goalProgress, isMissingGoalsTableError, listGoals } from "@/lib/supabase/goals";

export default async function GoalsPage() {
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

  async function addGoal(formData: FormData) {
    "use server";

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) {
      redirect("/auth/sign-in");
    }

    const title = String(formData.get("title") ?? "").trim();
    const targetAmount = Number(formData.get("target_amount") ?? "");
    const currentAmountRaw = String(formData.get("current_amount") ?? "0").trim();
    const currentAmount = Number(currentAmountRaw || 0);
    const dueDateRaw = String(formData.get("due_date") ?? "").trim();
    const dueDate = dueDateRaw ? dueDateRaw : null;

    if (!title || !Number.isFinite(targetAmount) || targetAmount <= 0) {
      return;
    }

    try {
      await createGoal(supabase, {
        user_id: currentUser.id,
        title,
        target_amount: targetAmount,
        current_amount: Number.isFinite(currentAmount) ? currentAmount : 0,
        due_date: dueDate,
      });
      revalidatePath("/dashboard/goals");
      revalidatePath("/dashboard");
    } catch (error) {
      if (isMissingGoalsTableError(error as { code?: string; message?: string })) {
        return;
      }

      throw error;
    }
  }

  const goals = await listGoals(supabase, user.id);
  const goalsTableReady = goals.length > 0;
  const data = buildDashboardData(profile, user.email ?? null);

  return (
    <DashboardShell data={data}>
      <section className="grid min-h-0 gap-3 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
            <h2 className="text-base font-semibold text-[#342c28]">Your Goals</h2>
            <p className="mt-1 text-[11px] text-[#8a7a74]">
              Track savings targets, payoffs, and other manual goals.
            </p>

            {!goalsTableReady ? (
              <div className="mt-3 rounded-2xl border border-[#e9aebd]/40 bg-[#fff7f8] p-3 text-xs text-[#7a4d58]">
                No saved goals yet.
              </div>
            ) : null}

            <div className="mt-3 space-y-2">
              {goals.map((goal) => {
                const progress = goalProgress(goal);

                return (
                  <div
                    key={goal.id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#342c28]">{goal.title}</p>
                        <p className="mt-0.5 text-[10px] text-[#8a7a74]">
                          {goal.current_amount} / {goal.target_amount}
                          {goal.due_date ? ` · Due ${goal.due_date}` : ""}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-[#342c28]">{progress}%</p>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[#f4c7cf]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {goals.length === 0 ? (
                <p className="text-sm text-[#8a7a74]">No goals yet. Add your first one below.</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[#fff7f8] p-4">
            <h2 className="text-base font-semibold text-[#342c28]">Create a Goal</h2>
            <GoalForm action={addGoal} />
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
            <h2 className="text-base font-semibold text-[#342c28]">How progress works</h2>
            <p className="mt-1 text-[11px] leading-5 text-[#6f625d]">
              Progress is calculated as current amount divided by target amount.
              You can update the current amount later as you save more.
            </p>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
