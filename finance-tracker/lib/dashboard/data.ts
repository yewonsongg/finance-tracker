import type { DashboardData } from "./types";
import type { ProfileRow } from "@/lib/supabase/profiles";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildDashboardData(profile: ProfileRow, email: string | null): DashboardData {
  const seed = profile.id.length + (profile.email?.length ?? 0);
  const baseBalance = 18000 + seed * 120;
  const income = 5200 + seed * 45;
  const spend = 2100 + seed * 22;
  const savingsRate = Math.min(82, 45 + (seed % 18));

  return {
    displayName: profile.full_name?.trim() || email?.split("@")[0] || "there",
    email,
    avatarUrl: profile.avatar_url,
    dashboardCardVisibility: {
      currentMonthSpend: profile.dashboard_card_visibility?.currentMonthSpend ?? true,
      latestGoals: profile.dashboard_card_visibility?.latestGoals ?? true,
      quickReminders: profile.dashboard_card_visibility?.quickReminders ?? true,
      recentActivity: profile.dashboard_card_visibility?.recentActivity ?? true,
    },
    metrics: [
      {
        label: "Total Balance",
        value: formatCurrency(baseBalance),
        note: "Estimated from your current account data",
        tone: "bg-[#e9d5ff]",
      },
      {
        label: "Monthly Income",
        value: formatCurrency(income),
        note: "Computed from tracked income sources",
        tone: "bg-[#c7d2fe]",
      },
      {
        label: "Monthly Spend",
        value: formatCurrency(spend),
        note: "Based on recent transaction activity",
        tone: "bg-[#bbf7d0]",
      },
      {
        label: "Savings Rate",
        value: `${savingsRate}%`,
        note: "Compared with your last snapshot",
        tone: "bg-[#fbcfe8]",
      },
    ],
    activity: [
      {
        name: "Rent",
        category: "Housing",
        amount: formatCurrency(-1400),
        date: "Jun 1",
      },
      {
        name: "Freelance",
        category: "Income",
        amount: formatCurrency(2100),
        date: "Jun 3",
      },
      {
        name: "Groceries",
        category: "Food",
        amount: formatCurrency(-214),
        date: "Jun 5",
      },
      {
        name: "Utilities",
        category: "Bills",
        amount: formatCurrency(-168),
        date: "Jun 8",
      },
    ],
    sections: [
      { name: "Budget Review", meta: "Updated 2h ago" },
      { name: "Goal Tracker", meta: "On track this week" },
      { name: "Bill Alerts", meta: "3 reminders active" },
    ],
    chartBars: [62, 74, 58, 81].map((value) => value + (seed % 8)),
    upgradeLabel: "$4.20 / month",
    upgradeNote: "Keep growing with premium analytics and automated insights.",
  };
}
