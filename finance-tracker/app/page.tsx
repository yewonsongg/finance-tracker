import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  let status = "Not connected yet.";

  try {
    const supabase = await createSupabaseServerClient();
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937,_#050816_58%)] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
            Supabase setup
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Finance Tracker is wired for Supabase.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            This starter checks your connection on the server and is ready for
            auth, database queries, and realtime once you add your Supabase
            project details.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm text-slate-400">Connection status</p>
            <p className="mt-2 text-lg font-medium text-cyan-200">{status}</p>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-medium text-white">Env vars</p>
              <p className="mt-2">
                Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-medium text-white">Next step</p>
              <p className="mt-2">
                Create a `transactions` table or update the query to match your schema.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
