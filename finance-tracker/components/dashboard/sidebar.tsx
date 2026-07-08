"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  displayName: string;
  email: string | null;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transactions", href: "/transactions" },
  { label: "Analytics", href: "/analytics" },
  { label: "Goals", href: "/goals" },
  { label: "Settings", href: "/settings" },
];

export function DashboardSidebar({ displayName, email }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col justify-between border-b border-[var(--border)] bg-[#fff7f8] p-4 lg:border-b-0 lg:border-r lg:p-5">
      <div>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f4c7cf] text-lg font-semibold text-white">
            FT
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-[#342c28]">
              Finance
            </p>
            <p className="text-sm text-[#8a7a74]">Tracker</p>
          </div>
        </div>

        <nav className="mt-8 space-y-1.5 text-sm">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-3 py-2.5 transition ${
                  active
                    ? "bg-[#f4c7cf] font-medium text-[#3b2f2e]"
                    : "text-[#6f625d] hover:bg-white/80 hover:text-[#342c28]"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs">{active ? "●" : "↗"}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        <form action="/auth/sign-out" method="post">
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-[#f4c7cf] px-3 py-2.5 text-sm font-medium text-[#3b2f2e] transition hover:bg-[#efb8c3]"
          >
            <span>Sign out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
