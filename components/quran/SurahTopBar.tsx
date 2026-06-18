"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState, useRef, useEffect } from "react";

export type SurahListItem = {
  nomor: number;
  namaLatin: string;
  jumlahAyat: number;
};

type SurahTopBarProps = {
  currentSurahNumber: number;
  currentSurahName: string;
  surahList: SurahListItem[];
};

export function SurahTopBar({
  currentSurahNumber,
  currentSurahName,
  surahList,
}: SurahTopBarProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSurahChange = (value: string) => {
    const nextNumber = Number(value);
    if (!Number.isNaN(nextNumber)) {
      router.push(`/quran/${nextNumber}`);
    }
  };

  const handleAyahChange = (value: string) => {
    router.push(`/quran/${currentSurahNumber}?ayah=${value}`);
  };

  const filteredSurah = searchQuery.trim() === "" 
    ? [] 
    : surahList.filter(s => 
        s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) || 
        String(s.nomor).includes(searchQuery)
      );

  const currentSurah = surahList.find(s => s.nomor === currentSurahNumber);
  const totalAyahs = currentSurah?.jumlahAyat || 1;

  return (
    <div className="fixed left-0 right-0 top-0 z-40 border-b-2 border-stone-900 bg-[#f7ede8]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-8">
        
        {/* Back Button */}
        <Link
          href="/quran"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-stone-900 bg-white text-stone-900 shadow-[2px_2px_0_#9ca3af] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_#9ca3af] transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </Link>

        {/* Dropdowns */}
        <div className="flex flex-1 items-center justify-center gap-2">
          {/* Surah Dropdown */}
          <div className="relative">
            <select
              id="surah-select"
              className="appearance-none rounded-lg border-2 border-stone-900 bg-white px-3 py-1.5 pr-8 text-xs font-bold shadow-[2px_2px_0_#9ca3af] focus:outline-none"
              value={String(currentSurahNumber)}
              onChange={(event) => handleSurahChange(event.target.value)}
            >
              {surahList.map((item) => (
                <option key={item.nomor} value={String(item.nomor)}>
                  {item.namaLatin}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-stone-900">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          {/* Ayah Dropdown */}
          <div className="relative">
            <select
              id="ayah-select"
              className="appearance-none rounded-lg border-2 border-stone-900 bg-white px-3 py-1.5 pr-8 text-xs font-bold shadow-[2px_2px_0_#9ca3af] focus:outline-none"
              defaultValue=""
              onChange={(event) => handleAyahChange(event.target.value)}
            >
              <option value="" disabled hidden>Ayat</option>
              {Array.from({ length: totalAyahs }, (_, i) => i + 1).map((ayah) => (
                <option key={ayah} value={String(ayah)}>
                  {ayah}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-stone-900">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="relative flex items-center justify-end" ref={searchRef}>
          {/* Desktop Search Input */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-white px-3 h-9 shadow-[2px_2px_0_#9ca3af] transition-all focus-within:-translate-y-px focus-within:-translate-x-px focus-within:shadow-[3px_3px_0_#9ca3af]">
            <span className="text-stone-500 shrink-0">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="text"
              placeholder="Cari surah..."
              className="w-28 lg:w-40 bg-transparent text-xs font-bold text-stone-700 focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-stone-400 hover:text-stone-700 shrink-0" aria-label="Hapus pencarian">✕</button>
            )}
          </div>

          {/* Mobile Search Button */}
          <div className="sm:hidden flex items-center justify-end">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-2 border-stone-900 bg-white text-stone-900 shadow-[2px_2px_0_#9ca3af] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_#9ca3af] transition-all"
              aria-label="Cari surah"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>

          {/* Dropdown Area (Mobile Input + Results) */}
          {isSearchOpen && (
            <div className="absolute right-0 top-full mt-3 flex flex-col gap-2 z-50 w-[240px] sm:w-[260px]">
              {/* Mobile Input Field */}
              <div className="sm:hidden flex h-10 items-center gap-2 rounded-lg border-2 border-stone-900 bg-white px-3 shadow-[4px_4px_0_#9ca3af]">
                <span className="text-stone-500 shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
                <input
                  type="text"
                  autoFocus
                  placeholder="Cari surah..."
                  className="w-full bg-transparent text-xs font-bold text-stone-700 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="text-stone-400 shrink-0">✕</button>
              </div>

              {/* Search Results Dropdown */}
              {searchQuery.trim() !== "" && (
                <div className="max-h-60 overflow-y-auto rounded-xl border-2 border-stone-900 bg-white shadow-[4px_4px_0_#9ca3af]">
                  {filteredSurah.length === 0 ? (
                    <div className="p-3 text-xs font-bold text-stone-500 text-center">Tidak ditemukan</div>
                  ) : (
                    <div className="flex flex-col py-1">
                      {filteredSurah.map((s) => (
                        <button
                          key={s.nomor}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            router.push(`/quran/${s.nomor}`);
                          }}
                          className="px-4 py-2.5 text-left text-xs font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
                        >
                          {s.nomor}. {s.namaLatin}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
