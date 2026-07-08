"use client";

import { useMemo, useState } from "react";

type GoalFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function GoalForm({ action }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const isReady = useMemo(() => {
    return (
      title.trim().length > 0 &&
      targetAmount.trim().length > 0 &&
      Number.isFinite(Number(targetAmount)) &&
      Number(targetAmount) > 0
    );
  }, [targetAmount, title]);

  return (
    <form action={action} className="mt-3 grid gap-2.5">
      <input
        name="title"
        placeholder="Goal name"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
      />
      <input
        name="target_amount"
        type="number"
        step="0.01"
        placeholder="Target amount"
        required
        value={targetAmount}
        onChange={(event) => setTargetAmount(event.target.value)}
        className="rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
      />
      <input
        name="current_amount"
        type="number"
        step="0.01"
        placeholder="Current amount"
        value={currentAmount}
        onChange={(event) => setCurrentAmount(event.target.value)}
        className="rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
      />
      <input
        name="due_date"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        className="rounded-2xl border border-[var(--border)] bg-white px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={!isReady}
        className="rounded-2xl bg-[#f4c7cf] px-4 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 enabled:cursor-pointer"
      >
        Save goal
      </button>
    </form>
  );
}
