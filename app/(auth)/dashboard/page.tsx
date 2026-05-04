import Link from "next/link";
import { cookies } from "next/headers";
import Image from "next/image";

import { verifyJwt } from "@/lib/auth/jwt";
import { prisma } from "@/lib/db/prisma";
import { InkCard } from "@/components/ui/card";

// ─── Types ───────────────────────────────────────────────────────────────────

type ShalatScheduleResponse = {
  code: number;
  message: string;
  data: {
    provinsi: string;
    kabkota: string;
    bulan: number;
    tahun: number;
    bulan_nama: string;
    jadwal: Array<{
      tanggal: number;
      tanggal_lengkap: string;
      hari: string;
      imsak: string;
      subuh: string;
      terbit: string;
      dhuha: string;
      dzuhur: string;
      ashar: string;
      maghrib: string;
      isya: string;
    }>;
  };
};

type PrayerItem = {
  label: string;
  time: string;
  active?: boolean;
};

type SurahInfo = {
  nomor: number;
  namaLatin: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const prayerOrder = ["subuh", "dzuhur", "ashar", "maghrib", "isya"] as const;

const prayerLabels: Record<(typeof prayerOrder)[number], string> = {
  subuh: "Subuh",
  dzuhur: "Dzuhur",
  ashar: "Ashar",
  maghrib: "Magrib",
  isya: "Isya",
};

const fallbackTimes: PrayerItem[] = [
  { label: "Subuh", time: "--:--" },
  { label: "Dzuhur", time: "--:--" },
  { label: "Ashar", time: "--:--" },
  { label: "Magrib", time: "--:--" },
  { label: "Isya", time: "--:--" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

function resolveActivePrayer(
  now: Date,
  schedule: ShalatScheduleResponse["data"]["jadwal"][0],
) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const times = prayerOrder
    .map((key) => ({ key, minutes: toMinutes(schedule[key]) }))
    .filter(
      (item): item is { key: (typeof prayerOrder)[number]; minutes: number } =>
        item.minutes !== null,
    );

  let activeKey: (typeof prayerOrder)[number] | null = null;
  for (let i = 0; i < times.length; i += 1) {
    const current = times[i];
    const next = times[i + 1];
    if (!next || (nowMinutes >= current.minutes && nowMinutes < next.minutes)) {
      activeKey = current.key;
      break;
    }
  }
  return activeKey;
}

function getGreeting(hour: number): string {
  if (hour >= 4 && hour < 11) return "Pagi";
  if (hour >= 11 && hour < 15) return "Siang";
  if (hour >= 15 && hour < 18) return "Sore";
  return "Malam";
}

// ─── Data Fetchers ────────────────────────────────────────────────────────────

async function getPrayerSchedule(now: Date) {
  const body = {
    provinsi: "D.I. Yogyakarta",
    kabkota: "Kab. Sleman",
    bulan: now.getMonth() + 1,
    tahun: now.getFullYear(),
  };
  const response = await fetch("https://equran.id/api/v2/shalat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as ShalatScheduleResponse;
  return payload.data;
}

async function getSurahName(surahNumber: number): Promise<string> {
  try {
    const res = await fetch(
      `https://equran.id/api/v2/surat/${surahNumber}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return `Surah ${surahNumber}`;
    const payload = (await res.json()) as { data: SurahInfo };
    return payload.data.namaLatin;
  } catch {
    return `Surah ${surahNumber}`;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Auth
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;
  const jwtPayload = token
    ? await verifyJwt<{ id: string; role: string }>(token)
    : null;

  const user = jwtPayload
    ? await prisma.user.findUnique({
        where: { id: jwtPayload.id },
        select: { name: true },
      })
    : null;

  const userName = user?.name ?? "Pengguna";

  // Time & greeting
  const now = new Date();
  const wibHour = (now.getUTCHours() + 7) % 24;
  const greeting = getGreeting(wibHour);

  // Prayer schedule
  const schedule = await getPrayerSchedule(now);
  const today = schedule?.jadwal.find((item) => item.tanggal === now.getDate());
  const activeKey = today ? resolveActivePrayer(now, today) : null;
  const prayerTimes: PrayerItem[] = today
    ? prayerOrder.map((key) => ({
        label: prayerLabels[key],
        time: today[key],
        active: activeKey === key,
      }))
    : fallbackTimes;

  // Module progress
  const userId = jwtPayload?.id ?? null;

  const [totalModules, completedProgresses, inProgressModule, lastCompleted, quranProgress] =
    await Promise.all([
      prisma.module.count(),
      userId
        ? prisma.userModuleProgress.count({
            where: { userId, isCompleted: true },
          })
        : Promise.resolve(0),
      userId
        ? prisma.userModuleProgress.findFirst({
            where: { userId, isCompleted: false },
            include: { module: { select: { id: true, title: true } } },
          })
        : Promise.resolve(null),
      userId
        ? prisma.userModuleProgress.findFirst({
            where: { userId, isCompleted: true },
            orderBy: { completedAt: "desc" },
            include: { module: { select: { id: true, title: true } } },
          })
        : Promise.resolve(null),
      userId
        ? prisma.userQuranProgress.findUnique({ where: { userId } })
        : Promise.resolve(null),
    ]);

  const progressPercent =
    totalModules > 0 ? Math.round((completedProgresses / totalModules) * 100) : 0;

  // Surah name lookup only if there's quran progress
  const surahName = quranProgress
    ? await getSurahName(quranProgress.surahNumber)
    : null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">

          {/* ── Greeting card ── */}
          <InkCard className="!p-0 overflow-hidden bg-white">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4 md:pr-5 p-4">
                <p className="text-sm font-semibold text-slate-500 pb-8">
                  {today
                    ? `${today.hari}, ${today.tanggal} ${schedule?.bulan_nama ?? ""} ${schedule?.tahun ?? ""}`
                    : "-"}
                </p>
                <p className="text-xl font-bold tracking-tight text-[#d14a35]">
                  Selamat {greeting}, <span className="text-black">{userName}</span>
                </p>
                <p className="text-sm font-semibold text-black">
                  Semoga hari {today?.hari ?? "ini"} mu menyenangkan
                </p>
              </div>
              <div className="flex w-full items-end justify-end md:w-auto">
                <div className="relative h-[170px] w-[300px]">
                  <Image
                    src="/images/cat-5.png"
                    alt="Ilustrasi kucing"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </InkCard>

          {/* ── Aktivitas Belajar ── */}
          <InkCard className="space-y-5 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-900">Aktivitas Belajar</h2>
            </div>

            {/* Module section */}
            <div className="space-y-3">
              {/* Header + progress stat */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">📚</span>
                  <span className="text-sm font-bold text-stone-800">Modul</span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {completedProgresses} dari {totalModules} diselesaikan
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-100 border border-stone-200">
                <div
                  className="h-full rounded-full bg-[#d14a35] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Sedang dipelajari */}
              {inProgressModule ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>Sedang dipelajari</span>
                    <span className="rounded-full bg-[#fce5d8] px-2 py-0.5 text-[#d14a35]">
                      modul
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border-2 border-stone-900 bg-white px-4 py-3 shadow-[3px_3px_0_#d96852]">
                    <p className="text-sm font-semibold text-stone-800 line-clamp-1 flex-1 pr-3">
                      {inProgressModule.module.title}
                    </p>
                    <Link
                      href={`/modul/${inProgressModule.module.id}`}
                      className="shrink-0 text-xs font-semibold text-[#d14a35] hover:underline"
                    >
                      Lanjutkan
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Terakhir diselesaikan */}
              {lastCompleted ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>Terakhir diselesaikan</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                      modul
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border-2 border-stone-900 bg-white px-4 py-3 shadow-[3px_3px_0_#d96852]">
                    <p className="text-sm font-semibold text-stone-800 line-clamp-1 flex-1 pr-3">
                      {lastCompleted.module.title}
                    </p>
                    <Link
                      href={`/modul/${lastCompleted.module.id}`}
                      className="shrink-0 text-xs font-semibold text-[#d14a35] hover:underline"
                    >
                      Lihat materi
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Empty state */}
              {!inProgressModule && !lastCompleted ? (
                <p className="text-sm text-slate-400 italic">
                  Belum ada modul yang dipelajari.
                </p>
              ) : null}
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-stone-200" />

            {/* Al-Quran section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📖</span>
                <span className="text-sm font-bold text-stone-800">Al-Qur'an</span>
              </div>

              {quranProgress && surahName ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>Terakhir dibaca</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border-2 border-stone-900 bg-white px-4 py-3 shadow-[3px_3px_0_#d96852]">
                    <p className="text-sm font-semibold text-stone-800">
                      {surahName}, Ayat {quranProgress.ayahNumber}
                    </p>
                    <Link
                      href={`/quran/${quranProgress.surahNumber}?ayah=${quranProgress.ayahNumber}`}
                      className="shrink-0 text-xs font-semibold text-[#d14a35] hover:underline"
                    >
                      Lanjutkan
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Belum ada riwayat bacaan Al-Qur'an.
                </p>
              )}
            </div>
          </InkCard>
        </div>

        {/* ── Prayer schedule ── */}
        <div className="flex w-full max-w-sm flex-col gap-4">
          <div className="inline-flex items-center justify-center rounded-full bg-[#d96852] px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#111]">
            Menurut: equran.id
          </div>

          {prayerTimes.map((item) => (
            <div
              key={item.label}
              className={
                item.active
                  ? "flex items-center justify-between rounded-2xl border-2 border-stone-900 bg-[#d14a35] px-4 py-3 text-white shadow-[4px_4px_0_#111]"
                  : "flex items-center justify-between rounded-2xl border-2 border-stone-900 bg-white px-4 py-3 text-slate-700 shadow-[4px_4px_0_#d96852]"
              }
            >
              <div>
                <p className={`text-xs font-semibold ${item.active ? "text-white" : "text-slate-700"}`}>
                  {item.label}
                </p>
                <p className="text-2xl font-bold tracking-tight">{item.time}</p>
              </div>
              <div className="h-10 w-10 rounded-xl border-2 border-dashed border-stone-300 bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
