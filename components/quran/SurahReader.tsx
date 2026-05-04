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
              <Card className="rounded-2xl border-2 border-stone-900 bg-white px-5 py-4 shadow-[4px_4px_0_#d96852]">
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => handleBookmark(verse.nomorAyat)}
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 bg-white text-sm transition-colors ${
                      isLastRead ? "text-[#d14a35]" : "text-stone-500 hover:text-stone-900"
                    }`}
                    aria-label="Simpan terakhir dibaca"
                  >
                    <BookmarkIcon filled={isLastRead} />
                  </button>
                  <p className="text-xs font-semibold text-slate-500">{verse.nomorAyat}</p>
                </div>

                <p className="mt-3 text-right text-2xl text-stone-900" dir="rtl">
                  {verse.teksArab}
                </p>
                <p className="mt-3 text-sm italic text-[#d14a35]">{verse.teksLatin}</p>
                <p className="mt-2 text-sm text-slate-600">{verse.teksIndonesia}</p>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 sm:px-8">
          {previousSurah ? (
            <Link
              href={`/quran/${previousSurah.nomor}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-[#f7ede8] px-4 py-2 text-xs font-semibold text-stone-900 shadow-[3px_3px_0_#d96852]"
            >
              ← {previousSurah.namaLatin}
            </Link>
          ) : (
            <span className="rounded-lg border-2 border-stone-200 bg-[#f7ede8] px-4 py-2 text-xs font-semibold text-stone-400">
              ← Tidak ada
            </span>
          )}

          <button
            type="button"
            onClick={handleContinue}
            className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-xs font-semibold shadow-[3px_3px_0_#9ca3af] ${
              lastRead
                ? "border-stone-900 bg-[#f7ede8] text-stone-900"
                : "border-stone-200 bg-[#f7ede8] text-stone-400"
            }`}
            disabled={!lastRead}
          >
            <span>Lanjutkan membaca</span>
            <span className={lastRead ? "text-stone-900" : "text-stone-400"}>
              ({lastReadLabel})
            </span>
          </button>

          {nextSurah ? (
            <Link
              href={`/quran/${nextSurah.nomor}`}
              className="inline-flex items-center gap-2 rounded-lg border-2 border-stone-900 bg-black px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#d96852]"
            >
              {nextSurah.namaLatin} →
            </Link>
          ) : (
            <span className="rounded-lg border-2 border-stone-200 bg-[#f7ede8] px-4 py-2 text-xs font-semibold text-stone-400">
              Tidak ada →
            </span>
          )}
        </div>
      </div>
    </>
  );
}
