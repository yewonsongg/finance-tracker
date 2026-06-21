import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937,_#050816_58%)] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="mb-6 flex items-center justify-between text-sm text-slate-300">
          <Link href="/" className="font-medium text-cyan-200 hover:text-cyan-100">
            Finance Tracker
          </Link>
          <Link href="/" className="hover:text-white">
            Back to home
          </Link>
        </div>
        {children}
      </section>
    </main>
  );
}
