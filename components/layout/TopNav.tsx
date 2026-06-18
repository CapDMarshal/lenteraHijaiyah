"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-stone-200 bg-white/90 px-5 sm:px-10 md:px-20 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard" className="inline-flex items-center relative z-50" onClick={() => setIsOpen(false)}>
          <Image
            src="/images/logo-wide.png"
            alt="Lentera Hijaiyah"
            width={150}
            height={36}
            priority
          />
        </Link>
        
        {/* Desktop Nav */}
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

        {/* Mobile Toggle */}
        <button 
          className="md:hidden relative z-50 p-2 text-stone-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 h-screen w-screen bg-white z-40 flex flex-col pt-24 px-5">
          <nav className="flex flex-col gap-8 text-2xl font-bold mb-10">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`relative w-fit pb-1 text-stone-900 transition-colors hover:text-red-600 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:origin-center after:bg-[#d14a35] after:transition-transform after:duration-200 after:content-[''] ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
