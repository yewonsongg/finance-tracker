import type { DashboardSection } from "@/lib/dashboard/types";

type SectionListProps = {
  items: DashboardSection[];
};

export function SectionList({ items }: SectionListProps) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-white p-4">
      <h2 className="text-base font-semibold text-[#342c28]">Team / Sections</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2"
          >
            <div>
              <p className="text-xs font-medium text-[#342c28]">{item.name}</p>
              <p className="text-[10px] text-[#8a7a74]">{item.meta}</p>
            </div>
            <span className="text-[#b87d8d]">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
