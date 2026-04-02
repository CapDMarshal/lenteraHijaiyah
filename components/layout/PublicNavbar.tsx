import Link from "next/link";

export function PublicNavbar() {
  return (
    <header className="bg-[#f4efeb] px-5 py-4 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="grid h-16 w-20 place-items-center rounded-md border border-dashed border-sky-400 bg-white/70 px-4 text-2xl font-black text-stone-900"
          aria-label="Lentera Hijaiyah home"
        >
          L
        </Link>

        <nav className="flex items-center gap-5 text-sm font-semibold sm:text-base">
          <Link href="/" className="text-stone-900 hover:text-red-600">
            Beranda
          </Link>
          <Link href="/about" className="text-stone-900 hover:text-red-600">
            Tentang Kami
          </Link>
        </nav>

        <Link
          href="/sign-in"
          className="rounded-md bg-black px-8 py-2.5 text-sm font-semibold text-white shadow-[4px_4px_0_#d14a35] transition-colors hover:bg-stone-900"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}
