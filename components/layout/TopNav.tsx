"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modul", label: "Modul" },
  { href: "/quran", label: "Al-Qur'an Digital" },
  { href: "/hijaiyah", label: "Canvas Hijaiyah" },
  { href: "/profile", label: "Profil" },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="border-b border-stone-200 bg-white/90 px-20 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard" className="inline-flex items-center">
          <Image
            src="/images/logo-wide.png"
            alt="Lentera Hijaiyah"
            width={150}
            height={36}
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 text-md font-semibold text-stone-600 md:flex">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 text-stone-900 transition-colors hover:text-red-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:bg-[#d14a35] after:transition-transform after:duration-200 after:content-[''] ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
