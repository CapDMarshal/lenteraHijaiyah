"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

export type SurahVerse = {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
};

type SurahListItem = {
  nomor: number;
  namaLatin: string;
};

type QuranProgress = {
  surahNumber: number;
  ayahNumber: number;
};

type SurahReaderProps = {
  surahNumber: number;
  surahName: string;
  verses: SurahVerse[];
  surahList: SurahListItem[];
  previousSurah?: { nomor: number; namaLatin: string } | false;
  nextSurah?: { nomor: number; namaLatin: string } | false;
};

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function SurahReader({
  surahNumber,
  surahName,
  verses,
  surahList,
  previousSurah,
  nextSurah,
}: SurahReaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lastRead, setLastRead] = useState<QuranProgress | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const lastReadLabel = useMemo(() => {
    if (!lastRead) {
      return "Tidak ada";
    }

    const match = surahList.find((item) => item.nomor === lastRead.surahNumber);
    const surahLabel = match ? match.namaLatin : `Surah ${lastRead.surahNumber}`;

    return `${surahLabel} Ayat ${lastRead.ayahNumber}`;
  }, [lastRead, surahList]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/v1/quran/progress");
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { progress: QuranProgress | null };
        if (payload.progress) {
          setLastRead(payload.progress);
        }
      } catch (error) {
        console.error("QURAN_PROGRESS_LOAD_ERROR", error);
      }
    };

    fetchProgress();
  }, []);

  useEffect(() => {
    const ayahParam = searchParams.get("ayah");
    if (!ayahParam) {
      return;
    }

    const target = document.getElementById(`ayah-${ayahParam}`);
    if (!target) {
      return;
    }

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [searchParams]);

  const handleBookmark = async (ayahNumber: number) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/v1/quran/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surahNumber, ayahNumber }),
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { progress: QuranProgress };
      setLastRead(payload.progress);
    } catch (error) {
      console.error("QURAN_PROGRESS_SAVE_ERROR", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    if (!lastRead) {
      return;
    }

    if (lastRead.surahNumber === surahNumber) {
      const target = document.getElementById(`ayah-${lastRead.ayahNumber}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    router.push(`/quran/${lastRead.surahNumber}?ayah=${lastRead.ayahNumber}`);
  };

  return (
    <>
      <div className="space-y-4">
        {verses.map((verse) => {
          const isLastRead =
            lastRead?.surahNumber === surahNumber && lastRead?.ayahNumber === verse.nomorAyat;

          return (
            <div key={verse.nomorAyat} id={`ayah-${verse.nomorAyat}`} style={{ scrollMarginTop: "140px" }}>
              <Card className="rounded-xl border-2 border-stone-900 bg-white p-5 shadow-[3px_3px_0_#9ca3af]">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  {/* Top / Left side: Bookmark & Arabic */}
                  <div className="flex w-full items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => handleBookmark(verse.nomorAyat)}
                      className={`mt-2 inline-flex h-6 w-6 shrink-0 items-center justify-center transition-colors ${
                        isLastRead ? "text-[#d14a35]" : "text-stone-400 hover:text-stone-900"
                      }`}
                      aria-label="Simpan terakhir dibaca"
                    >
                      <BookmarkIcon filled={isLastRead} />
                    </button>

                    <div className="flex flex-1 items-start gap-4" dir="rtl">
                      <p className="text-2xl sm:text-3xl leading-[2.2] text-stone-900 font-medium">
                        {verse.teksArab}
                      </p>
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-[#d14a35] text-[#d14a35] text-xs font-bold bg-white mt-2">
                        {verse.nomorAyat}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom side: Transliteration & Translation */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-semibold text-[#b85b4f]">{verse.teksLatin}</p>
                  <p className="text-sm font-medium text-[#b85b4f]">{verse.teksIndonesia}</p>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-stone-900 bg-[#f7ede8]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Prev (Desktop & Mobile) */}
            <div className="order-2 flex flex-1 items-center gap-3 sm:order-1 sm:flex-none">
              {previousSurah ? (
                <Link
                  href={`/quran/${previousSurah.nomor}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-stone-900 bg-white px-4 py-2.5 text-xs font-bold text-stone-900 shadow-[2px_2px_0_#9ca3af] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_#9ca3af] transition-all sm:flex-none"
                >
                  ← {previousSurah.namaLatin}
                </Link>
              ) : (
                <span className="inline-flex flex-1 items-center justify-center rounded-lg border-2 border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-400 sm:flex-none">
                  ← Tidak ada
                </span>
              )}

              {/* Next (Mobile only, sits beside Prev) */}
              {nextSurah ? (
                <Link
                  href={`/quran/${nextSurah.nomor}`}
                  className="sm:hidden inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-stone-900 bg-black px-4 py-2.5 text-xs font-bold text-white shadow-[2px_2px_0_#d14a35] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_#d14a35] transition-all"
                >
                  {nextSurah.namaLatin} →
                </Link>
              ) : (
                <span className="sm:hidden inline-flex flex-1 items-center justify-center rounded-lg border-2 border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-400">
                  Tidak ada →
                </span>
              )}
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={handleContinue}
              className={`order-1 sm:order-2 inline-flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-2.5 text-xs font-bold shadow-[2px_2px_0_#9ca3af] transition-all sm:flex-1 sm:max-w-xs ${
                lastRead
                  ? "border-stone-900 bg-white text-stone-900 hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_#9ca3af]"
                  : "border-stone-200 bg-white text-stone-400"
              }`}
              disabled={!lastRead}
            >
              <span>Lanjutkan membaca</span>
              <span className={lastRead ? "text-stone-900" : "text-stone-400"}>
                ({lastReadLabel})
              </span>
            </button>

            {/* Next (Desktop only) */}
            <div className="hidden sm:order-3 sm:flex">
              {nextSurah ? (
                <Link
                  href={`/quran/${nextSurah.nomor}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-stone-900 bg-black px-4 py-2.5 text-xs font-bold text-white shadow-[2px_2px_0_#d14a35] hover:translate-y-px hover:translate-x-px hover:shadow-[1px_1px_0_#d14a35] transition-all"
                >
                  {nextSurah.namaLatin} →
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-lg border-2 border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-400">
                  Tidak ada →
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
