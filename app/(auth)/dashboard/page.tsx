import Image from "next/image";

import { InkCard } from "@/components/ui/card";

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

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

function resolveActivePrayer(
  now: Date,
  schedule: ShalatScheduleResponse["data"]["jadwal"][0],
) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const times = prayerOrder
    .map((key) => ({ key, minutes: toMinutes(schedule[key]) }))
    .filter((item): item is { key: (typeof prayerOrder)[number]; minutes: number } =>
      item.minutes !== null,
    );

  let activeKey: (typeof prayerOrder)[number] | null = null;
  for (let index = 0; index < times.length; index += 1) {
    const current = times[index];
    const next = times[index + 1];
    if (!next || (nowMinutes >= current.minutes && nowMinutes < next.minutes)) {
      activeKey = current.key;
      break;
    }
  }

  return activeKey;
}

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

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as ShalatScheduleResponse;
  return payload.data;
}

export default async function DashboardPage() {
  const now = new Date();
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

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <InkCard className="!p-0 overflow-hidden bg-white">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4 md:pr-5 p-4">
                <p className="text-sm font-semibold text-slate-500 pb-8">
                  {today
                    ? `${today.hari}, ${today.tanggal} ${schedule?.bulan_nama ?? ""} ${schedule?.tahun ?? ""}`
                    : "-"}
                </p>
                <p className="text-xl font-bold tracking-tight text-[#d14a35]">
                  Selamat Pagi, <span className="text-black">Ridho</span>
                </p>
                <p className="text-sm font-semibold text-black">Semoga hari Selasa mu menyenangkan</p>
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

          <InkCard className="space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-stone-900">Aktivitas Belajar</h2>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Minggu ini
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>Sudah dipelajari</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">modul</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border-2 border-stone-900 bg-white px-4 py-3 shadow-[3px_3px_0_#d96852]">
                  <p className="text-sm font-semibold text-stone-800">
                    Memahami Konsep Iman, Islam, dan Ihsan
                  </p>
                  <button type="button" className="text-xs font-semibold text-[#d14a35]">
                    Lihat materi
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>Sedang dipelajari</span>
                  <span className="rounded-full bg-[#fce5d8] px-2 py-0.5 text-[#d14a35]">modul</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border-2 border-stone-900 bg-white px-4 py-3 shadow-[3px_3px_0_#d96852]">
                  <p className="text-sm font-semibold text-stone-800">
                    Akhlak Terpuji: Sabar, Ikhtiar, dan Tawakal
                  </p>
                  <button type="button" className="text-xs font-semibold text-[#d14a35]">
                    Lanjutkan
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>Sedang dipelajari</span>
                  <span className="rounded-full bg-[#fce5d8] px-2 py-0.5 text-[#d14a35]">al-qur'an</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border-2 border-stone-900 bg-white px-4 py-3 shadow-[3px_3px_0_#d96852]">
                  <p className="text-sm font-semibold text-stone-800">Al-Baqarah ayat 48</p>
                  <button type="button" className="text-xs font-semibold text-[#d14a35]">
                    Lanjutkan
                  </button>
                </div>
              </div>
            </div>
          </InkCard>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-4">
          <div className="inline-flex items-center justify-center rounded-full bg-[#d96852] px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#111]">
            Menurut: {schedule ? `${schedule.kabkota}, ${schedule.provinsi}` : "-"}
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
