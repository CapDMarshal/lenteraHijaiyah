"use client";

import { useMemo, useState, useEffect } from "react";

import { ModuleCard } from "@/components/modul/ModuleCard";
import { moduleCategories, type ModuleCategory, type ModuleItem } from "@/data/modul";

const lastReadKey = "modul:lastRead";

type LastRead = {
  slug: string;
  title: string;
  pdfUrl: string;
  categoryLabel: string;
};

export default function ModulPage() {
  const [activeKey, setActiveKey] = useState<ModuleCategory["key"]>(
    moduleCategories[0]?.key ?? "fiqih",
  );
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  const activeCategory = useMemo(
    () => moduleCategories.find((category) => category.key === activeKey),
    [activeKey],
  );

  useEffect(() => {
    const stored = window.localStorage.getItem(lastReadKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as LastRead;
      setLastRead(parsed);
    } catch (error) {
      console.error("LAST_READ_PARSE_ERROR", error);
    }
  }, []);

  const modules = activeCategory?.modules ?? [];

  return (
    <section className="space-y-8 pb-12">
      <div className="rounded-2xl border-2 border-stone-900 bg-white px-6 py-6 shadow-[4px_4px_0_#9ca3af]">
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-stone-900 bg-white text-sm shadow-[3px_3px_0_#d14a35]"
          >
            ←
          </button>
          <div className="flex flex-wrap items-center justify-center gap-6 gap-y-3">
            {moduleCategories.map((category) => {
              const isActive = category.key === activeKey;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveKey(category.key)}
                  className={`relative pb-1 text-sm font-semibold text-stone-900 transition-colors hover:text-red-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:bg-[#d14a35] after:transition-transform after:duration-200 after:content-[''] ${
                    isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-stone-900 bg-white text-sm shadow-[3px_3px_0_#d14a35]"
          >
            →
          </button>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold text-stone-900">
          {activeCategory?.label ?? "Modul"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {activeCategory?.description ?? ""}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-600">
            <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Kamu sudah membaca modul ini
          </p>
          {modules.map((module, index) => (
            <ModuleCard key={module.slug} module={module} index={index} />
          ))}
        </div>

        <div className="relative space-y-6 pl-8">
          <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-black" />
          {modules.map((module, index) => (
            <div key={module.slug}>
              {index > 0 ? <div className="mb-6 h-px w-full bg-stone-900/30" /> : null}
              <div className="flex items-start gap-4">
                <span className="text-md font-semibold text-stone-900">{index + 1}</span>
                <div className="space-y-2">
                  <h3 className="text-md font-semibold text-stone-900">{module.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{module.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 text-center">
        {lastRead ? (
          <div className="mx-auto max-w-lg">
            <p className="text-sm font-semibold text-stone-900">Terakhir dibaca</p>
            <p className="mt-2 text-xs text-slate-600">
              {lastRead.title} · {lastRead.categoryLabel}
            </p>
            <a
              href={`/modul/${lastRead.slug}`}
              className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#9ca3af]"
            >
              Lanjutkan membaca
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-stone-900">Yuk, buka modul pertamamu!</p>
            <div className="mx-auto flex h-24 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white text-xs text-slate-500">
              Placeholder ilustrasi kucing
            </div>
            <button
              type="button"
              className="inline-flex rounded-md bg-black px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#9ca3af]"
            >
              Mulai Belajar Sekarang
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
