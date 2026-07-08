import type { SupabaseClient } from "@supabase/supabase-js";
import type { DashboardActivity } from "@/lib/dashboard/types";

export type TransactionRow = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  amount: number;
  transaction_date: string;
  notes: string | null;
  created_at?: string;
};

function isMissingTransactionsTableError(error: { code?: string; message?: string }) {
  return error.code === "PGRST205" || error.message?.includes("public.transactions");
}

function formatActivityDate(transactionDate: string | null | undefined, createdAt?: string) {
  const value = transactionDate || createdAt;
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatActivityAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function toDashboardActivity(transaction: TransactionRow): DashboardActivity {
  return {
    name: transaction.title,
    category: transaction.category,
    amount: formatActivityAmount(transaction.amount),
    date: formatActivityDate(transaction.transaction_date, transaction.created_at),
  };
}

export async function listTransactions(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("id,user_id,title,category,amount,transaction_date,notes,created_at")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingTransactionsTableError(error)) {
      return [];
    }
    throw error;
  }

  return (data ?? []) as TransactionRow[];
}

export async function createTransaction(
  supabase: SupabaseClient,
  input: Omit<TransactionRow, "id" | "created_at">,
) {
  const { data, error } = await supabase
    .from("transactions")
    .insert(input)
    .select("id,user_id,title,category,amount,transaction_date,notes,created_at")
    .single();

  if (error) {
    if (isMissingTransactionsTableError(error)) {
      return null;
    }

    throw error;
  }

  return data as TransactionRow;
}

export { isMissingTransactionsTableError };
