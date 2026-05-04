"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export type SurahListItem = {
  nomor: number;
  namaLatin: string;
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

  const handleSurahChange = (value: string) => {
    const nextNumber = Number(value);
    if (!Number.isNaN(nextNumber)) {
      router.push(`/quran/${nextNumber}`);
    }
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-6 py-3 sm:px-8">
        <Link
          href="/quran"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-[#f7ede8] px-4 py-2 text-xs font-semibold text-stone-900 shadow-[3px_3px_0_#d96852]"
        >
          ← Kembali
        </Link>

        <div className="flex items-center justify-center gap-2">
          <label className="sr-only" htmlFor="surah-select">
            Pilih surah
          </label>
          <select
            id="surah-select"
            className="rounded-lg border-2 border-stone-900 bg-[#f7ede8] px-3 py-1 text-xs font-semibold shadow-[2px_2px_0_#111]"
            value={String(currentSurahNumber)}
            onChange={(event) => handleSurahChange(event.target.value)}
          >
            {surahList.map((item) => (
              <option key={item.nomor} value={String(item.nomor)}>
                {item.namaLatin}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="surah-number">
            Nomor surah
          </label>
          <select
            id="surah-number"
            className="rounded-lg border-2 border-stone-900 bg-[#f7ede8] px-3 py-1 text-xs font-semibold shadow-[2px_2px_0_#111]"
            value={String(currentSurahNumber)}
            onChange={(event) => handleSurahChange(event.target.value)}
          >
            {surahList.map((item) => (
              <option key={item.nomor} value={String(item.nomor)}>
                {item.nomor}
              </option>
            ))}
          </select>
        </div>

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-[#f7ede8] px-4 py-2 shadow-[3px_3px_0_#d96852]">
            <span className="text-sm">&#128269;</span>
            <input
              type="text"
              placeholder="cari surah..."
              className="w-40 bg-transparent text-xs text-stone-700 focus:outline-none"
              defaultValue={currentSurahName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
