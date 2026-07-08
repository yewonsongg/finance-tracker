import Link from "next/link";
import type { GoalRow } from "@/lib/supabase/goals";

type DashboardGoalsPreviewProps = {
  goals: GoalRow[];
};

export function DashboardGoalsPreview({ goals }: DashboardGoalsPreviewProps) {
  const latestGoals = goals.slice(0, 3);

  return (
    <Link
      href="/dashboard/goals"
      className="group block rounded-[1.75rem] border border-[var(--border)] bg-[#f8fbff] p-5 transition hover:bg-[#f6faff]"
    >
      <h2 className="text-lg font-semibold text-[#342c28]">Latest Goals</h2>
      <p className="mt-1 text-xs text-[#8a7a74]">Your most recent saved goals from the goals page</p>

      <div className="mt-4 max-h-[150px] space-y-2.5 overflow-y-auto pr-1">
        {latestGoals.length > 0 ? (
          latestGoals.map((goal) => (
            <div
              key={goal.id}
              className="rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{goal.title}</p>
                  <p className="mt-0.5 text-[11px] text-[#8a7a74]">
                    {goal.current_amount} / {goal.target_amount}
                    {goal.due_date ? ` · Due ${goal.due_date}` : ""}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#b87d8d]">
                  {goal.target_amount > 0
                    ? `${Math.min(100, Math.max(0, Math.round((goal.current_amount / goal.target_amount) * 100)))}%`
                    : "0%"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-[#e9aebd]/40 bg-white px-3 py-3 text-sm text-[#7a4d58]">
            No saved goals yet. Add one on the Goals page to see it here.
          </div>
        )}
      </div>
    </Link>
  );
}
