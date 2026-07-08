import type { SupabaseClient } from "@supabase/supabase-js";

export type GoalRow = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  due_date: string | null;
  created_at?: string;
};

export function goalProgress(goal: GoalRow) {
  if (goal.target_amount <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100)));
}

export async function listGoals(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("goals")
    .select("id,user_id,title,target_amount,current_amount,due_date,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("public.goals")) {
      return [];
    }
    throw error;
  }
  return (data ?? []) as GoalRow[];
}

export async function createGoal(
  supabase: SupabaseClient,
  input: Omit<GoalRow, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("goals")
    .insert(input)
    .select("id,user_id,title,target_amount,current_amount,due_date,created_at")
    .single();

  if (error) throw error;
  return data as GoalRow;
}

export function isMissingGoalsTableError(error: { code?: string; message?: string }) {
  return error.code === "PGRST205" || error.message?.includes("public.goals");
}
