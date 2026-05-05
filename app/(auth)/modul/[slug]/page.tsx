"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ModulePdfReader } from "@/components/modul/ModulePdfReader";
import { moduleCategories, type ModuleItem } from "@/data/modul";

const lastReadKey = "modul:lastRead";

type FlatModule = ModuleItem & { categoryLabel: string };

type DbModule = {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  category: { name: string };
};

export default function ModulDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  // ── Local static data ──────────────────────────────────────────────────────
  const flatModules = useMemo(() => {
    return moduleCategories.flatMap((category) =>
      category.modules.map((module) => ({ ...module, categoryLabel: category.label })),
    );
  }, []);

  const currentIndex = flatModules.findIndex((m) => m.slug === slug);
  const moduleItem = currentIndex >= 0 ? flatModules[currentIndex] : null;
  const previousModule = currentIndex > 0 ? flatModules[currentIndex - 1] : null;
  const nextModule = currentIndex >= 0 ? flatModules[currentIndex + 1] : null;

  // ── Progress state ─────────────────────────────────────────────────────────
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dbModuleId, setDbModuleId] = useState<string | null>(null);

  // Save to localStorage (for /modul list page "terakhir dibaca")
  useEffect(() => {
    if (!moduleItem) return;
    const payload = {
      slug: moduleItem.slug,
      title: moduleItem.title,
      pdfUrl: moduleItem.pdfUrl,
      categoryLabel: moduleItem.categoryLabel,
    };
    window.localStorage.setItem(lastReadKey, JSON.stringify(payload));
  }, [moduleItem]);

  // Resolve DB module ID and check existing completion status
  useEffect(() => {
    if (!slug) return;

    const init = async () => {
      try {
        // 1. Get all DB modules to resolve slug → id
        const modRes = await fetch("/api/v1/learning/modules");
        if (!modRes.ok) return;
        const { modules } = (await modRes.json()) as { modules: DbModule[] };
        const found = modules.find((m) => m.slug === slug);
        if (!found) return;
        setDbModuleId(found.id);

        // 2. Check if user already marked this module as complete
        const progRes = await fetch("/api/v1/learning/progress");
        if (!progRes.ok) return;
        const { progress } = (await progRes.json()) as {
          progress: { moduleId: string; isCompleted: boolean }[];
        };
        const existing = progress.find((p) => p.moduleId === found.id);
        if (existing?.isCompleted) setIsCompleted(true);
      } catch (err) {
        console.error("MODUL_INIT_ERROR", err);
      }
    };

    init();
  }, [slug]);

  const handleMarkComplete = async () => {
    if (isSaving || isCompleted || !dbModuleId) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/v1/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId: dbModuleId, isCompleted: true }),
      });
      if (res.ok) setIsCompleted(true);
    } catch (err) {
      console.error("MARK_COMPLETE_ERROR", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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

  const buttonLabel = isCompleted
    ? "✅ Sudah selesai dibaca"
    : isSaving
      ? "Menyimpan..."
      : "Tandai selesai dibaca";

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
          onClick={handleMarkComplete}
          disabled={isCompleted || isSaving || !dbModuleId}
          className={`rounded-lg border-2 px-4 py-2 text-xs font-semibold transition-colors ${
            isCompleted
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 cursor-default"
              : isSaving || !dbModuleId
                ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
                : "border-stone-900 bg-white text-stone-900 shadow-[3px_3px_0_#9ca3af] hover:bg-stone-50"
          }`}
        >
          {buttonLabel}
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
