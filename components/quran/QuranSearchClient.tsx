"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { SurahCard, type SurahCardData } from "@/components/quran/SurahCard";

const quickSurah = [
  { label: "Yasin", href: "/quran/36" },
  { label: "Al-Waqi'ah", href: "/quran/56" },
  { label: "Al-Mulk", href: "/quran/67" },
  { label: "Al-Kahfi", href: "/quran/18" },
  { label: "Al-Rahman", href: "/quran/55" },
  { label: "Ayat Kursi", href: "/quran/2?ayah=255" },
];

const INITIAL_COUNT = 15;

export function QuranSearchClient({ surahs }: { surahs: SurahCardData[] }) {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(inputValue), 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const trimmed = query.trim().toLowerCase();

  const filtered = trimmed
    ? surahs.filter(
        (s) =>
          s.namaLatin.toLowerCase().includes(trimmed) ||
          s.arti.toLowerCase().includes(trimmed) ||
          String(s.nomor).includes(trimmed),
      )
    : surahs;

  const visible = trimmed || showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = !trimmed && !showAll && filtered.length > INITIAL_COUNT;

  return (
    <section className="space-y-6 pb-10">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Al-Qur'an <span className="text-[#d14a35]">Digital</span>
        </h1>

        {/* Search bar */}
        <div className="mx-auto flex w-full max-w-md items-center gap-3 rounded-xl border-2 border-stone-900 bg-white px-4 py-2 shadow-[3px_3px_0_#d96852]">
          <span className="text-lg text-stone-700">&#128269;</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowAll(false);
            }}
            placeholder="cari surah secara langsung"
            className="w-full bg-transparent text-sm text-stone-700 focus:outline-none"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(""); setQuery(""); }}
              className="text-stone-400 hover:text-stone-700"
              aria-label="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2">
          {quickSurah.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full bg-[#d96852] px-4 py-1 text-xs font-semibold text-white shadow-[2px_2px_0_#111] transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      {visible.length === 0 ? (
        <p className="text-center text-sm text-slate-500">
          Surah &ldquo;{query}&rdquo; tidak ditemukan.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((surah) => (
            <SurahCard key={surah.nomor} surah={surah} />
          ))}
        </div>
      )}

      {/* Show all button */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="group inline-flex rounded-xl bg-[#d96852] p-0"
          >
            <span className="inline-flex -translate-x-1 -translate-y-1 items-center justify-center rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition-transform duration-200 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-active:-translate-x-0.5 group-active:-translate-y-0.5">
              Tampilkan Semua
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
