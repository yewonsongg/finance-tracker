import Link from "next/link";

type CurrentMonthSpendCardProps = {
  chartBars: number[];
};

const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
const yAxisLabels = [
  { value: 100, label: "100" },
  { value: 50, label: "50" },
  { value: 0, label: "0" },
];

export function CurrentMonthSpendCard({ chartBars }: CurrentMonthSpendCardProps) {
  const maxValue = 100;
  const chartHeight = 210;

  return (
    <Link
      href="/dashboard/analytics"
      className="group block self-start overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white p-4 transition hover:bg-[#fffdfd]"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#342c28]">Current Month Spend</h2>
          <p className="mt-0.5 text-[11px] text-[#8a7a74]">
            Quick visual summary of this month&apos;s spending
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-[1rem] bg-[#fffaf7] p-3">
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="min-w-[760px] rounded-[0.9rem] border border-[#f1e4de] bg-white p-3">
            <div className="flex items-center justify-between text-[11px] text-[#8a7a74]">
              <span>Weekly trend</span>
              <span>USD</span>
            </div>

            <div className="mt-3 grid grid-cols-[44px_1fr] gap-x-3">
              <div className="relative h-[210px] text-right text-[11px] text-[#8a7a74]">
                {yAxisLabels.map(({ value, label }) => {
                  const top = `${100 - (value / maxValue) * 100}%`;
                  return (
                    <div
                      key={label}
                      className="absolute right-0"
                      style={{ top, transform: "translateY(-50%)" }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-[0.75rem] border-l border-b border-[#eadfd9] bg-white">
                <div
                  className="grid items-end gap-6 px-4"
                  style={{
                    gridTemplateColumns: `repeat(${chartBars.length}, minmax(0, 1fr))`,
                    height: `${chartHeight}px`,
                  }}
                >
                  {chartBars.map((value, index) => {
                    const barHeight = Math.max(10, (value / maxValue) * (chartHeight - 34));
                    return (
                      <div key={weekLabels[index] ?? index} className="flex h-full flex-col justify-end">
                        <div className="flex flex-1 items-end justify-center">
                          <div
                            className="w-[78%] rounded-t-[10px] bg-[#f4c7cf]"
                            style={{ height: `${barHeight}px` }}
                            aria-label={`${weekLabels[index] ?? `Week ${index + 1}`}: ${value}`}
                          />
                        </div>
                        <div className="pt-2 text-center text-[11px] text-[#8a7a74]">
                          {weekLabels[index] ?? `Week ${index + 1}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
