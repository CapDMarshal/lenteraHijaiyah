import Link from "next/link";

import { LinkButton } from "@/components/ui/button";

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

        <LinkButton href="/sign-in" variant="ink" size="nav">
          Masuk
        </LinkButton>
      </div>
    </header>
  );
}
