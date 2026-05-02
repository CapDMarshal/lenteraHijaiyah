import type { ReactNode } from "react";

import { TopNav } from "@/components/layout/TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <TopNav />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6 sm:px-8">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
