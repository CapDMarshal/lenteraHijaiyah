"use client";

import Image from "next/image";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    <section className="space-y-0 pb-0">
      {/* Mobile Selector */}
      <div className="md:hidden relative mx-auto max-w-sm mb-12">
        <div 
          className="rounded-xl border-[3px] border-stone-900 bg-white px-4 py-3 shadow-[3px_3px_0_#d14a35] flex items-center justify-between cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="relative flex-1 flex items-center justify-between pr-4">
            <span className="text-sm font-bold text-stone-900">
              {activeCategory?.label ?? "Pilih Kategori"}
            </span>
            <div className="text-stone-900 transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0 pl-4 border-l-2 border-stone-300">
            <span className="text-xs font-semibold text-slate-600">Semua Kelas</span>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border-[3px] border-stone-900 bg-white shadow-[3px_3px_0_#111111] overflow-hidden flex flex-col">
              {moduleCategories.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`text-left px-4 py-3 text-sm font-bold border-b-2 border-stone-100 last:border-none transition-colors ${
                    activeKey === c.key 
                      ? "bg-[#d14a35] text-white" 
                      : "text-stone-900 hover:bg-stone-100"
                  }`}
                  onClick={() => {
                    setActiveKey(c.key);
                    setIsDropdownOpen(false);
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Selector */}
      <div className="hidden md:block rounded-2xl border-2 border-stone-900 bg-white px-6 py-6 shadow-[4px_4px_0_#9ca3af] mb-12">
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
                  className={`relative pb-1 text-sm font-semibold text-stone-900 transition-colors hover:text-red-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:bg-[#d14a35] after:transition-transform after:duration-200 after:content-[''] ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
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

      {/* Centered Header & Description */}
      <div className="text-center max-w-xl mx-auto mb-12 px-2">
        <h1 className="text-2xl font-black text-stone-900">
          {activeCategory?.label ?? "Modul"}
        </h1>
        <p className="mt-5 text-sm font-semibold leading-relaxed text-slate-600 max-w-md mx-auto">
          {activeCategory?.description ?? ""}
        </p>
      </div>

      {/* Full-bleed White Background for Module List */}
      <div className="-mx-5 sm:-mx-10 md:-mx-20 bg-white px-5 sm:px-10 md:px-20 pt-10 pb-20">
        <div className="mx-auto max-w-5xl relative">
          {/* Desktop Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-900 hidden lg:block -translate-x-1/2 z-0" />

          {modules.map((module, index) => (
            <div key={module.slug} className="relative flex flex-col lg:flex-row items-center lg:items-start lg:justify-between w-full mb-16 last:mb-0">
              
              {/* Mobile Timeline Indicator */}
              <div className="flex flex-col items-center justify-center mb-6 lg:hidden">
                <div className="h-6 w-px bg-stone-300 mb-2"></div>
                <span className="text-lg font-black text-stone-900">{index + 1}</span>
                <div className="h-8 w-px bg-stone-900 mt-2"></div>
              </div>

              {/* Desktop Timeline Indicator */}
              <div className="hidden lg:flex absolute left-1/2 top-10 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-white py-4 z-10">
                <span className="text-xl font-black text-stone-900">{index + 1}</span>
              </div>

              {/* Left Side: Module Card & Status */}
              <div className="w-full lg:w-[45%] flex flex-col lg:items-end">
                <div className="w-full max-w-md mx-auto lg:mx-0">
                  {lastRead?.slug === module.slug && (
                    <div className="w-full text-left mb-4 pl-1">
                      <p className="text-xs font-bold text-slate-600 flex items-center gap-2">
                        <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-500 text-white">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </span>
                        Kamu sudah membaca modul ini
                      </p>
                    </div>
                  )}
                  <ModuleCard module={module} index={index} />
                </div>
              </div>

              {/* Right Side: Title & Summary */}
              <div className="w-full lg:w-[45%] mt-8 lg:mt-0 lg:pt-6">
                <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left space-y-4 px-2 lg:px-0">
                  <h3 className="text-xl font-bold tracking-tight text-stone-900 leading-snug">{module.title}</h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-600">
                    {module.summary}
                  </p>
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
          <div className="space-y-0">
            <p className="text-lg font-semibold text-stone-900">Yuk, buka modul pertamamu!</p>
            <div className="mx-auto flex justify-center">
              <div className="relative h-[150px] w-[350px] drop-shadow-md">
                <Image
                  src="/images/cat-11.png"
                  alt="Mulai belajar"
                  fill
                  className="object-contain"
                  sizes="250px"
                />
              </div>
            </div>
            <button
              type="button"
              className="group inline-flex rounded-md bg-[#9ca3af] p-0"
            >
              <span className="inline-flex -translate-x-1 -translate-y-1 items-center justify-center rounded-md bg-black px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-active:-translate-x-0.5 group-active:-translate-y-0.5">
                Mulai Belajar Sekarang
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
