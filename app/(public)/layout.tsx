import type { ReactNode } from "react";

import PublicFooter from "@/components/layout/PublicFooter";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <main className="no-scrollbar flex h-full flex-col overflow-x-hidden overflow-y-auto bg-stone-50">
      <PublicNavbar />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </main>
  );
}
