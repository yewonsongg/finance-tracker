"use client";

import { useMemo, useState } from "react";

type TransactionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function TransactionForm({ action }: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const isReady = useMemo(() => {
    return (
      title.trim().length > 0 &&
      category.trim().length > 0 &&
      Number.isFinite(Number(amount)) &&
      amount.trim().length > 0 &&
      transactionDate.trim().length > 0
    );
  }, [amount, category, title, transactionDate]);

  return (
    <form action={action} className="mt-4 grid gap-3 md:grid-cols-4">
      <input
        name="title"
        placeholder="Title"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
      />
      <input
        name="category"
        placeholder="Category"
        required
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
      />
      <input
        name="amount"
        type="number"
        step="0.01"
        placeholder="Amount"
        required
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
      />
      <input
        name="transaction_date"
        type="date"
        required
        value={transactionDate}
        onChange={(event) => setTransactionDate(event.target.value)}
        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
      />
      <textarea
        name="notes"
        placeholder="Notes"
        className="min-h-[84px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 md:col-span-4"
      />
      <button
        type="submit"
        disabled={!isReady}
        className="rounded-2xl bg-[#f4c7cf] px-4 py-2.5 font-medium text-white transition md:col-span-4 disabled:cursor-not-allowed disabled:opacity-60 enabled:cursor-pointer"
      >
        Save transaction
      </button>
    </form>
  );
}
