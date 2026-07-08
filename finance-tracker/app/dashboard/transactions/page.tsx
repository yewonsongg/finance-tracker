import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/supabase/profiles";
import type { ProfileRow } from "@/lib/supabase/profiles";
import { buildDashboardData } from "@/lib/dashboard/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ActivityList } from "@/components/dashboard/activity-list";
import { TransactionForm } from "@/components/dashboard/transaction-form";
import { createTransaction, listTransactions, toDashboardActivity } from "@/lib/supabase/transactions";
import { revalidatePath } from "next/cache";

export default async function TransactionsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/auth/sign-in");
  }

  let profile: ProfileRow = {
    id: user.id,
    email: user.email ?? null,
    full_name: null,
    avatar_url: null,
    dashboard_card_visibility: null,
  };

  try {
    profile = await getOrCreateProfile(supabase, user.id, user.email ?? null);
  } catch {
    profile = {
      id: user.id,
      email: user.email ?? null,
      full_name: null,
      avatar_url: null,
      dashboard_card_visibility: null,
    };
  }

  const data = buildDashboardData(profile, user.email ?? null);
  const transactions = await listTransactions(supabase, user.id);
  const activity = transactions.map(toDashboardActivity);

  async function addTransaction(formData: FormData) {
    "use server";

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const currentUser = userData.user;

    if (!currentUser) {
      redirect("/auth/sign-in");
    }

    const title = String(formData.get("title") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const amount = Number(formData.get("amount") ?? "");
    const transactionDate = String(formData.get("transaction_date") ?? "").trim();
    const notesRaw = String(formData.get("notes") ?? "").trim();

    if (!title || !category || !Number.isFinite(amount) || !transactionDate) {
      return;
    }

    await createTransaction(supabase, {
      user_id: currentUser.id,
      title,
      category,
      amount,
      transaction_date: transactionDate,
      notes: notesRaw || null,
    });

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard");
  }

  return (
    <DashboardShell data={data} activeHref="/dashboard/transactions">
      <section className="grid min-h-0 flex-1 items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
        <div className="self-start rounded-[1.75rem] border border-[var(--border)] bg-white p-5">
          <h2 className="text-lg font-semibold text-[#342c28]">Manual Spending Entry</h2>
          <p className="mt-1 text-xs text-[#8a7a74]">
            Enter expenses, income, transfers, or anything you track by hand.
          </p>

          <TransactionForm action={addTransaction} />
        </div>

        <div className="h-full self-stretch min-w-0">
          <ActivityList items={activity.length > 0 ? activity : data.activity} stretchHeight />
        </div>
      </section>
    </DashboardShell>
  );
}
