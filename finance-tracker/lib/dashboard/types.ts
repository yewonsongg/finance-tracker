export type DashboardMetric = {
  label: string;
  value: string;
  note: string;
  tone: string;
};

export type DashboardActivity = {
  name: string;
  category: string;
  amount: string;
  date: string;
};

export type DashboardSection = {
  name: string;
  meta: string;
};

export type DashboardData = {
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  metrics: DashboardMetric[];
  activity: DashboardActivity[];
  sections: DashboardSection[];
  chartBars: number[];
  upgradeLabel: string;
  upgradeNote: string;
};
