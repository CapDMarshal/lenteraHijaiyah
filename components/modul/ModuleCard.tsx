import Link from "next/link";

import type { ModuleItem } from "@/data/modul";

type ModuleCardProps = {
  module: ModuleItem;
  index: number;
};

export function ModuleCard({ module, index }: ModuleCardProps) {
  return (
    <Link href={`/modul/${module.slug}`} className="group block">
      <div className="rounded-xl border-2 border-white bg-[#d14a35] px-4 py-3 text-white shadow-[4px_4px_0_#111111] transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/80">Langkah {index + 1}</p>
          <p className="text-sm font-semibold text-white">{module.title}</p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/90">
            <span>{module.durationMinutes} menit</span>
            <span>{module.pages} halaman</span>
            <span>{module.level}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
