import { QuranSearchClient } from "@/components/quran/QuranSearchClient";
import type { SurahCardData } from "@/components/quran/SurahCard";

type SurahListResponse = {
  code: number;
  message: string;
  data: SurahCardData[];
};

async function getSurahList(): Promise<SurahCardData[]> {
  const response = await fetch("https://equran.id/api/v2/surat", {
    next: { revalidate: 3600 },
  });

  if (!response.ok) return [];
  const payload = (await response.json()) as SurahListResponse;
  return payload.data ?? [];
}

export default async function QuranPage() {
  const surahs = await getSurahList();
  return <QuranSearchClient surahs={surahs} />;
}
