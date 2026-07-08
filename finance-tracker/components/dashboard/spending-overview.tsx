type SpendingOverviewProps = {
  chartBars: number[];
  large?: boolean;
};

const weekLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];
const yAxisLabels = [
  { value: 100, label: "100" },
  { value: 50, label: "50" },
  { value: 0, label: "0" },
];

export function SpendingOverview({ chartBars, large = false }: SpendingOverviewProps) {
  const width = large ? 1300 : 700;
  const height = large ? 860 : 220;
  const paddingX = large ? 84 : 32;
  const paddingY = large ? 72 : 24;

  const minValue = 0;
  const maxValue = 100;
  const safeWidth = width - paddingX * 2;
  const safeHeight = height - paddingY * 2;
  const step = chartBars.length > 0 ? safeWidth / chartBars.length : 0;
  const barWidth = chartBars.length > 0 ? step * 0.5 : 0;
  const xAxisY = height - paddingY;

  return (
    <div
      className={`rounded-[1.5rem] border border-[var(--border)] bg-white p-4 ${
        large ? "flex flex-col" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${large ? "text-lg" : "text-base"} font-semibold text-[#342c28]`}>
            Spending Overview
          </h2>
          <p className={`mt-0.5 ${large ? "text-xs" : "text-[11px]"} text-[#8a7a74]`}>
            Monthly transaction trends
          </p>
        </div>
      </div>

      <div
        className={`mt-3 rounded-[1rem] bg-[#fffaf7] p-3 ${
          large ? "overflow-hidden" : ""
        }`}
      >
        <div className="flex flex-col text-[15px] leading-none">
          <div className="flex items-center justify-between px-1 text-[#8a7a74]">
            <span>Monthly spend</span>
            <span>USD</span>
          </div>
          <div className={`relative mt-2 overflow-hidden ${large ? "h-[420px]" : "h-[160px]"}`}>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="block h-full w-full"
              preserveAspectRatio="none"
              aria-label="Monthly spending bar chart"
              role="img"
              fontSize="18"
            >
              <g aria-hidden="true">
                <line x1={paddingX} y1={paddingY} x2={paddingX} y2={xAxisY} stroke="#eadfd9" strokeWidth="2" />
                <line x1={paddingX} y1={xAxisY} x2={width - paddingX} y2={xAxisY} stroke="#eadfd9" strokeWidth="2" />

                {yAxisLabels.map(({ value, label }) => {
                  const normalized = (value - minValue) / (maxValue - minValue);
                  const y = paddingY + (1 - normalized) * safeHeight;
                  return (
                    <g key={label}>
                      <line x1={paddingX - 6} y1={y} x2={paddingX} y2={y} stroke="#eadfd9" strokeWidth="2" />
                      <text x={paddingX - 14} y={y + 6} textAnchor="end" fill="#8a7a74" fontSize="23">
                        {label}
                      </text>
                    </g>
                  );
                })}

                {weekLabels.map((week, index) => {
                  const x = paddingX + index * step + step / 2;
                  return (
                    <g key={week}>
                      <line x1={x} y1={xAxisY} x2={x} y2={xAxisY + 6} stroke="#eadfd9" strokeWidth="2" />
                      <text x={x} y={height - 6} textAnchor="middle" fill="#8a7a74" fontSize="23">
                        {week}
                      </text>
                    </g>
                  );
                })}
              </g>

              {chartBars.map((value, index) => {
                const normalized = (value - minValue) / (maxValue - minValue);
                const barHeight = normalized * safeHeight;
                const x = paddingX + index * step + (step - barWidth) / 2;
                const y = height - paddingY - barHeight;
                return (
                  <g key={index}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={large ? 12 : 8}
                      fill="#f4c7cf"
                      opacity="0.95"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
