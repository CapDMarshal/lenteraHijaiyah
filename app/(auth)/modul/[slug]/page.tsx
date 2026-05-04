"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { ModulePdfReader } from "@/components/modul/ModulePdfReader";
import { moduleCategories, type ModuleItem } from "@/data/modul";

const lastReadKey = "modul:lastRead";

type FlatModule = ModuleItem & { categoryLabel: string };

export default function ModulDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const flatModules = useMemo(() => {
    return moduleCategories.flatMap((category) =>
      category.modules.map((module) => ({ ...module, categoryLabel: category.label })),
    );
  }, []);

  const currentIndex = flatModules.findIndex((module) => module.slug === slug);
  const moduleItem = currentIndex >= 0 ? flatModules[currentIndex] : null;
  const previousModule = currentIndex > 0 ? flatModules[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 ? flatModules[currentIndex + 1] : null;

  useEffect(() => {
    if (!moduleItem) {
      return;
    }

    const payload = {
      slug: moduleItem.slug,
      title: moduleItem.title,
      pdfUrl: moduleItem.pdfUrl,
      categoryLabel: moduleItem.categoryLabel,
    };

    window.localStorage.setItem(lastReadKey, JSON.stringify(payload));
  }, [moduleItem]);

  if (!moduleItem) {
    return (
      <section className="py-10 text-center">
        <p className="text-sm text-slate-600">Modul tidak ditemukan.</p>
        <Link href="/modul" className="mt-4 inline-flex text-sm font-semibold text-[#d14a35]">
          Kembali ke daftar
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/modul"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-white px-4 py-2 text-xs font-semibold text-stone-900 shadow-[3px_3px_0_#9ca3af]"
        >
          ← Kembali
        </Link>
        <h1 className="text-sm font-semibold text-stone-900">{moduleItem.title}</h1>
        <button
          type="button"
          className="rounded-lg border-2 border-stone-900 bg-white px-4 py-2 text-xs font-semibold text-stone-900 shadow-[3px_3px_0_#9ca3af]"
        >
          Tandai selesai dibaca
        </button>
      </div>

      <div className="rounded-2xl border-2 border-stone-900 bg-stone-100 shadow-[4px_4px_0_#9ca3af]">
        <ModulePdfReader pdfUrl={moduleItem.pdfUrl} title={moduleItem.title} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {previousModule ? (
          <Link
            href={`/modul/${previousModule.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-white px-4 py-2 text-xs font-semibold text-stone-900 shadow-[3px_3px_0_#9ca3af]"
          >
            Modul Sebelumnya
          </Link>
        ) : (
          <span className="rounded-lg border-2 border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-400">
            Modul Sebelumnya
          </span>
        )}

        {nextModule ? (
          <Link
            href={`/modul/${nextModule.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-black px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#d14a35]"
          >
            Modul Selanjutnya
          </Link>
        ) : (
          <span className="rounded-lg border-2 border-stone-200 bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-400">
            Modul Selanjutnya
          </span>
        )}
      </div>
    </section>
  );
}
