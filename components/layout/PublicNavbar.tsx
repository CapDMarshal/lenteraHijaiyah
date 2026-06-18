"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LinkButton } from "@/components/ui/button";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/about", label: "Tentang Kami" },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-[90] bg-[#F7EDE8]/90 px-5 sm:px-10 md:px-20 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" aria-label="Lentera Hijaiyah home" className="inline-flex items-center relative z-50">
          <Image
            src="/images/logo-horizontal.png"
            alt="Lentera Hijaiyah"
            width={150}
            height={36}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-5">
          <nav className="flex items-center gap-5 text-sm font-semibold sm:text-base">
            {links.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

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

          <LinkButton href="/sign-in" variant="ink" size="nav">
            Masuk
          </LinkButton>
        </div>

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
        <div className="fixed inset-0 top-0 left-0 h-screen w-screen bg-[#F7EDE8] z-40 flex flex-col pt-24 px-5">
          <nav className="flex flex-col gap-8 text-2xl font-bold mb-10">
            {links.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

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
          
          <LinkButton href="/sign-in" variant="ink" size="hero" className="w-full text-center" frontClassName="w-full" onClick={() => setIsOpen(false)}>
            Masuk
          </LinkButton>
        </div>
      )}
    </header>
  );
}
