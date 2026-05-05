"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { TopNav } from "@/components/layout/TopNav";
import PublicFooter from "@/components/layout/PublicFooter";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideTopNav = pathname.startsWith("/quran/");

  return (
    <div className="flex min-h-screen flex-col bg-[#F7EDE8]">
      {hideTopNav ? null : <TopNav />}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-1 flex-col gap-6 px-20 py-6">
          <main className="flex-1">{children}</main>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
