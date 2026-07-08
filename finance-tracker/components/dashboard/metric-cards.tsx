import type { DashboardMetric } from "@/lib/dashboard/types";

type MetricCardsProps = {
  metrics: DashboardMetric[];
};

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={`rounded-[1.5rem] border border-[var(--border)] p-4 ${metric.tone}`}
        >
          <p className="text-xs font-medium text-[#342c28]">{metric.label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-[#342c28]">
            {metric.value}
          </p>
          <p className="mt-1.5 text-xs text-[#6f625d]">{metric.note}</p>
        </div>
      ))}
    </div>
  );
}
