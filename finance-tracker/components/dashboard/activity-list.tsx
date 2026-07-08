import Link from "next/link";
import type { DashboardActivity } from "@/lib/dashboard/types";

type ActivityListProps = {
  items: DashboardActivity[];
  stretchHeight?: boolean;
  href?: string;
};

export function ActivityList({ items, stretchHeight = false, href }: ActivityListProps) {
  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`flex min-h-0 flex-col rounded-[1.5rem] border border-[var(--border)] bg-white p-4 ${
        stretchHeight ? "h-full" : ""
      } ${href ? "transition hover:bg-[#fffdfd]" : ""}`}
    >
      <div className="flex flex-col">
        <h2 className="text-left text-base font-semibold text-[#342c28]">Recent Activity</h2>
        <div
          className={`mt-3 w-full space-y-2 overflow-y-auto pr-1 ${
            stretchHeight ? "flex-1" : "max-h-[190px]"
          }`}
        >
          {items.map((item, index) => (
            <div
              key={`${item.name}-${item.date}-${item.amount}-${index}`}
              className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
            >
              <div>
                <p className="text-xs font-medium text-[#342c28]">{item.name}</p>
                <p className="text-[10px] text-[#8a7a74]">
                  {item.category} · {item.date}
                </p>
              </div>
              <p className="text-xs font-semibold text-[#342c28]">{item.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
