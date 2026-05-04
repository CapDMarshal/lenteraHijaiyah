import Link from "next/link";

import { Card } from "@/components/ui/card";

export type SurahCardData = {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
};

type SurahCardProps = {
  surah: SurahCardData;
};

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link href={`/quran/${surah.nomor}`} className="group block">
      <Card className="flex items-center justify-between gap-3 rounded-2xl border-2 border-stone-900 bg-white px-4 py-3 transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-black text-xs font-bold text-white shadow-[2px_2px_0_#CD4631]">
            {surah.nomor}
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900">{surah.namaLatin}</p>
            <p className="text-[11px] text-slate-500">
              {surah.arti} · {surah.jumlahAyat} ayat
            </p>
          </div>
        </div>
        <p className="text-lg font-semibold text-stone-900" dir="rtl">
          {surah.nama}
        </p>
      </Card>
    </Link>
  );
}
