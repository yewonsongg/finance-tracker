import type { DashboardData } from "@/lib/dashboard/types";
import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { MetricCards } from "./metric-cards";
import { CurrentMonthSpendCard } from "./current-month-spend-card";
import { DashboardGoalsPreview } from "./dashboard-goals-preview";
import { DailyNote } from "./daily-note";
import { ActivityList } from "./activity-list";
import type { DashboardActivity } from "@/lib/dashboard/types";
import type { GoalRow } from "@/lib/supabase/goals";
import type { ReactNode } from "react";

type DashboardShellProps = {
  data: DashboardData;
  activity?: DashboardActivity[];
  goals?: GoalRow[];
  children?: ReactNode;
};

export function DashboardShell({ data, activity, goals = [], children }: DashboardShellProps) {
  const cardVisibility = data.dashboardCardVisibility;

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden px-2 py-0">
      <section className="mx-auto my-[20px] grid h-[calc(100vh-40px)] w-full max-w-[1380px] overflow-hidden rounded-[1.5rem] bg-white/80 shadow-[0_20px_80px_rgba(190,140,150,0.12)] backdrop-blur-sm lg:grid-cols-[200px_1fr]">
        <DashboardSidebar displayName={data.displayName} email={data.email} />

        <div className="flex min-w-0 flex-col gap-2.5 overflow-hidden p-[20px]">
          <DashboardHeader displayName={data.displayName} avatarUrl={data.avatarUrl} />
          {children ?? (
            <section className="grid min-h-0 flex-1 items-start gap-2 overflow-hidden xl:grid-cols-[1.75fr_0.9fr]">
              <div className="min-h-0 space-y-2 overflow-hidden">
                <MetricCards metrics={data.metrics} />

                <div className="grid items-start gap-2 overflow-hidden 2xl:grid-cols-[1.45fr_0.95fr]">
                  {cardVisibility.currentMonthSpend !== false ? (
                    <CurrentMonthSpendCard chartBars={data.chartBars} />
                  ) : null}

                  <div className="space-y-2">
                    {cardVisibility.latestGoals !== false ? <DashboardGoalsPreview goals={goals} /> : null}
                    {cardVisibility.quickReminders !== false ? (
                      <DailyNote note="Use this area for reminders, alerts, or a simple summary of today&apos;s finances." />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-2 overflow-hidden xl:max-h-full">
                {cardVisibility.recentActivity !== false ? (
                  <ActivityList items={activity ?? data.activity} href="/dashboard/transactions" />
                ) : null}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
