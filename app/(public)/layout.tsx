"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import PublicFooter from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideShell = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <main className="no-scrollbar flex flex-col overflow-x-hidden bg-[#F7EDE8]">
      {!hideShell ? <PublicNavbar /> : null}
      <div className={`flex-1 ${!hideShell ? "pt-[98px]" : ""}`}>{children}</div>
      {!hideShell ? <PublicFooter /> : null}
    </main>
  );
}
