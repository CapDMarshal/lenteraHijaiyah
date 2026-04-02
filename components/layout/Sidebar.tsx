import Link from "next/link";

const modules = [
  { href: "/learning", label: "Pembelajaran Modul" },
  { href: "/quran", label: "Al-Quran Digital" },
  { href: "/hijaiyah", label: "Canvas Huruf Hijaiyah" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  return (
    <aside className="w-full rounded-2xl border border-stone-200 bg-white p-4 md:w-72">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Modules</p>
      <nav className="grid gap-1.5">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="rounded-lg px-3 py-2 text-sm text-stone-700 transition-colors hover:bg-lime-50 hover:text-stone-900"
          >
            {module.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
