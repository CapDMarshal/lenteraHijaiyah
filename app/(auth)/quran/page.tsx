import Link from "next/link";

import { SurahCard, type SurahCardData } from "@/components/quran/SurahCard";

type SurahListResponse = {
  code: number;
  message: string;
  data: SurahCardData[];
};

const quickSurah = [
  { label: "Yasin", href: "/quran/36" },
  { label: "Al-Waqi'ah", href: "/quran/56" },
  { label: "Al-Mulk", href: "/quran/67" },
  { label: "Al-Kahfi", href: "/quran/18" },
  { label: "Al-Rahman", href: "/quran/55" },
  { label: "Ayat Kursi", href: "/quran/2?ayah=255" },
];

async function getSurahList(): Promise<SurahCardData[]> {
  const response = await fetch("https://equran.id/api/v2/surat", {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as SurahListResponse;
  return payload.data ?? [];
}

export default async function QuranPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const surahs = await getSurahList();
  const resolvedSearchParams = await searchParams;
  const allParam = resolvedSearchParams?.all;
  const allValue = Array.isArray(allParam) ? allParam[0] : allParam;
  const showAll = allValue === "1" || allValue === "true";
  const visibleSurahs = showAll ? surahs : surahs.slice(0, 15);

  return (
    <section className="space-y-6 pb-10">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Al-Qur'an <span className="text-[#d14a35]">Digital</span>
        </h1>
        <div className="mx-auto flex w-full max-w-md items-center gap-3 rounded-xl border-2 border-stone-900 bg-white px-4 py-2 shadow-[3px_3px_0_#d96852]">
          <span className="text-lg text-stone-700">&#128269;</span>
          <input
            type="text"
            placeholder="cari surah secara langsung"
            className="w-full bg-transparent text-sm text-stone-700 focus:outline-none"
          />
        </div>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleSurahs.map((surah) => (
          <SurahCard key={surah.nomor} surah={surah} />
        ))}
      </div>

      {showAll ? null : (
        <div className="flex justify-center">
          <Link href="/quran?all=1" className="group inline-flex rounded-xl bg-[#d96852] p-0">
            <span className="inline-flex -translate-x-1 -translate-y-1 items-center justify-center rounded-xl bg-black px-6 py-2 text-sm font-semibold text-white transition-transform duration-200 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-active:-translate-x-0.5 group-active:-translate-y-0.5">
              Tampilkan Semua
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
