import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="mb-6 flex items-center justify-between text-sm text-[#7d6d66]">
          <Link href="/" className="font-medium text-[#b87d8d] hover:text-[#a86a7b]">
            Finance Tracker
          </Link>
          <Link href="/" className="hover:text-[#3b2f2e]">
            Back to home
          </Link>
        </div>
        {children}
      </section>
    </main>
  );
}
