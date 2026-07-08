type UpgradeCardProps = {
  label: string;
  note: string;
};

export function UpgradeCard({ label, note }: UpgradeCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-[var(--border)] bg-[#d8f4f1] p-5">
      <p className="text-xs font-medium text-[#2f4a47]">Upgrade</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#2f4a47]">
        {label}
      </h2>
      <p className="mt-2 text-xs text-[#55706d]">{note}</p>
      <button className="mt-4 rounded-2xl bg-[#f4c7cf] px-4 py-2.5 text-sm font-medium text-white">
        Upgrade now
      </button>
    </div>
  );
}
