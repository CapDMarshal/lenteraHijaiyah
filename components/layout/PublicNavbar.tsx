"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LinkButton } from "@/components/ui/button";

export function PublicNavbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/about", label: "Tentang Kami" },
  ];

  return (
    <header className="bg-[#f4efeb] px-5 py-4 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" aria-label="Lentera Hijaiyah home" className="inline-flex items-center">
          <Image
            src="/images/logo-horizontal.png"
            alt="Lentera Hijaiyah"
            width={150}
            height={36}
            priority
          />
        </Link>

        <nav className="flex items-center gap-5 text-sm font-semibold sm:text-base">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 text-stone-900 transition-colors hover:text-red-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:bg-[#d14a35] after:transition-transform after:duration-200 after:content-[''] ${
                  isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
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
    </header>
  );
}
