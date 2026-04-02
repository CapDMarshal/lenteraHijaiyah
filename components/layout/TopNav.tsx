import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quran", label: "Quran" },
  { href: "/learning", label: "Learning" },
  { href: "/hijaiyah", label: "Hijaiyah" },
  { href: "/profile", label: "Profile" },
];

export function TopNav() {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/dashboard" className="text-base font-semibold tracking-tight text-stone-900">
          Lentera Hijaiyah
        </Link>
        <nav className="hidden gap-4 text-sm text-stone-600 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-stone-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
