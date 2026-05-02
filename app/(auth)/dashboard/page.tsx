import { InkCard } from "@/components/ui/card";

const prayerTimes = [
  { label: "Subuh", time: "04.21", accent: "text-slate-700" },
  { label: "Dzuhur", time: "11.36", accent: "text-white", active: true },
  { label: "Ashar", time: "14.57", accent: "text-slate-700" },
  { label: "Magrib", time: "17.32", accent: "text-slate-700" },
  { label: "Isya", time: "18.43", accent: "text-slate-700" },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <InkCard className="flex flex-col gap-6 bg-white">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-500">Selasa, 12 April 2026</p>
              <h1 className="text-3xl font-bold tracking-tight text-stone-900">
                Selamat Pagi, Ridho
              </h1>
              <p className="text-sm text-slate-600">Semoga hari Selasa mu menyenangkan</p>
            </div>
            <div className="flex items-end justify-between gap-6">
              <div className="flex-1">
                <div className="h-32 w-full rounded-2xl border-2 border-dashed border-stone-300 bg-stone-100" />
                <p className="mt-2 text-xs text-slate-500">Placeholder ilustrasi kucing</p>
              </div>
              <div className="hidden h-24 w-24 rounded-full border-2 border-stone-900 bg-stone-200 sm:block" />
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
            Menurut: Kemenag Jakarta Pusat
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
                <p className={`text-xs font-semibold ${item.accent}`}>{item.label}</p>
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
