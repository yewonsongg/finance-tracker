import Link from "next/link";

type HeaderProps = {
  displayName: string;
  avatarUrl: string | null;
};

export function DashboardHeader({ displayName, avatarUrl }: HeaderProps) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#b87d8d]">
          Dashboard
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#342c28] sm:text-[2.4rem]">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-[#6f625d] sm:text-sm">
          Here&apos;s your quick snapshot of income, spending, and savings.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-3 py-2 transition hover:bg-[#fffdfd]"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${displayName} profile picture`}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-2)] text-xs font-semibold text-[#342c28]">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-[#342c28]">{displayName}</p>
            <p className="text-[11px] text-[#8a7a74]">Account overview</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
