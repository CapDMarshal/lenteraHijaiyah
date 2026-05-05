"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/sign-in");
  };

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

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group inline-flex rounded-lg bg-[#d96852] p-0 disabled:opacity-70"
          >
            <span className="inline-flex -translate-x-1 -translate-y-1 items-center justify-center gap-2 rounded-lg bg-black px-6 py-2 text-sm font-semibold text-white transition-transform duration-200 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-active:translate-x-0 group-active:translate-y-0 group-disabled:-translate-x-1 group-disabled:-translate-y-1">
              {isLoggingOut ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Keluar...
                </>
              ) : (
                "Logout"
              )}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
