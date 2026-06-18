import Link from "next/link";

import { SurahTopBar, type SurahListItem } from "@/components/quran/SurahTopBar";
import { SurahReader, type SurahVerse } from "@/components/quran/SurahReader";

type SurahDetail = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  ayat: SurahVerse[];
  suratSelanjutnya: { nomor: number; namaLatin: string; jumlahAyat: number } | false;
  suratSebelumnya: { nomor: number; namaLatin: string; jumlahAyat: number } | false;
};

type SurahDetailResponse = {
  code: number;
  message: string;
  data: SurahDetail;
};

type SurahListResponse = {
  code: number;
  message: string;
  data: SurahListItem[];
};

async function getSurahDetail(id: string): Promise<SurahDetail | null> {
  const response = await fetch(`https://equran.id/api/v2/surat/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as SurahDetailResponse;
  return payload.data ?? null;
}

async function getSurahList(): Promise<SurahListItem[]> {
  const response = await fetch("https://equran.id/api/v2/surat", {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as SurahListResponse;
  return payload.data ?? [];
}

export default async function QuranDetailPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const { identifier } = await params;
  const [surah, surahList] = await Promise.all([
    getSurahDetail(identifier),
    getSurahList(),
  ]);

  if (!surah) {
    return (
      <section className="py-10 text-center">
        <p className="text-sm text-slate-600">Data surah tidak tersedia.</p>
        <Link href="/quran" className="mt-4 inline-flex text-sm font-semibold text-[#d14a35]">
          Kembali ke daftar
        </Link>
      </section>
    );
  }

  return (
    <section className="relative pb-24 pt-24">
      <SurahTopBar
        currentSurahNumber={surah.nomor}
        currentSurahName={surah.namaLatin}
        surahList={surahList}
      />

      <div className="mx-auto w-full max-w-4xl space-y-8 pt-6">
        <div className="text-center space-y-3">
          <p className="text-4xl leading-relaxed text-stone-900 font-medium" dir="rtl">
            {surah.nama}
          </p>
          <h1 className="text-2xl font-black text-stone-900">
            {surah.namaLatin} ({surah.arti})
          </h1>
          <p className="text-sm font-semibold text-slate-500">
            Surah {surah.tempatTurun} · {surah.jumlahAyat} ayat
          </p>
        </div>

        <div className="text-center text-4xl leading-loose text-stone-900 font-medium pt-4" dir="rtl">
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>

        <SurahReader
          surahNumber={surah.nomor}
          surahName={surah.namaLatin}
          verses={surah.ayat}
          surahList={surahList}
          previousSurah={surah.suratSebelumnya}
          nextSurah={surah.suratSelanjutnya}
        />
      </div>
    </section>
  );
}
