import type { ReactNode } from "react";

import { PublicNavbar } from "@/components/layout/PublicNavbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-stone-50">
      <PublicNavbar />
      {children}
    </main>
  );
}
