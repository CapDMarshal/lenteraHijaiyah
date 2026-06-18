import Link from "next/link";

import type { ModuleItem } from "@/data/modul";

type ModuleCardProps = {
  module: ModuleItem;
  index: number;
};

export function ModuleCard({ module, index }: ModuleCardProps) {
  return (
    <Link href={`/modul/${module.slug}`} className="group block w-full">
      <div className="rounded-xl border-[3px] border-stone-900 bg-[#d14a35] p-5 text-left text-white shadow-[3px_3px_0_#111111] transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {/* Staircase/steps icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19h16" />
              <path d="M4 15h4v4" />
              <path d="M8 11h4v4" />
              <path d="M12 7h4v4" />
              <path d="M16 3h4v4" />
            </svg>
            <p className="text-sm font-bold tracking-wide">Langkah {index + 1}</p>
          </div>
          
          <p className="text-base font-bold leading-snug text-white md:text-lg pr-4">{module.title}</p>
          
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                45 Menit
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                200 Halaman
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18" rx="1"></rect><rect x="10" y="8" width="4" height="13" rx="1"></rect><rect x="2" y="13" width="4" height="8" rx="1"></rect></svg>
              Dasar
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
