type AnalysisPanelProps = {
  items: string[];
};

export function AnalysisPanel({ items }: AnalysisPanelProps) {
  return (
    <div className="rounded-[1.75rem] border border-[var(--border)] bg-[#f8fbff] p-5">
      <h2 className="text-lg font-semibold text-[#342c28]">More Analysis</h2>
      <p className="mt-1 text-xs text-[#8a7a74]">
        Extra signals and quick actions
      </p>
      <div className="mt-4 space-y-2.5">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[#342c28]"
          >
            <span>{item}</span>
            <span className="text-[#b87d8d]">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
