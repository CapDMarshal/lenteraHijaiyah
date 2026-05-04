"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import PublicFooter from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideShell = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <main className="no-scrollbar flex h-full flex-col overflow-x-hidden overflow-y-auto bg-stone-50">
      {!hideShell ? <PublicNavbar /> : null}
      <div className="flex-1">{children}</div>
      {!hideShell ? <PublicFooter /> : null}
    </main>
  );
}
