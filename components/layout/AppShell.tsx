"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { TopNav } from "@/components/layout/TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideTopNav = pathname.startsWith("/quran/");

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {hideTopNav ? null : <TopNav />}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6 sm:px-8">
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
