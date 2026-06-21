import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Home() {
  let status = "Not connected yet.";
  let signedInEmail: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    signedInEmail = userData.user?.email ?? null;
    const { error } = await supabase.from("transactions").select("id").limit(1);

    if (!error) {
      status = "Supabase is connected and ready.";
    } else if (error.code === "42P01") {
      status = "Supabase is connected, but the `transactions` table does not exist yet.";
    } else {
      status = `Connected, but query failed: ${error.message}`;
    }
  } catch (error) {
    status =
      error instanceof Error ? error.message : "Supabase environment variables are missing.";
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-black">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 items-center">
        <div className="max-w-2xl rounded-3xl bg-white p-8 shadow-2xl shadow-pink-100 backdrop-blur">
          <h1 className="mt-4 text-center text-xl tracking-tight text-black sm:text-5xl">
            Finance Tracker
          </h1>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/auth/sign-in"
              className="rounded-2xl bg-[#fff8f5] px-4 py-3 text-center text-[#e9aebd] transition hover:bg-[#fffdf8]"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-2xl bg-[#ffd7e2] px-4 py-3 text-center text-white transition hover:bg-[#ffc8d7]"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
