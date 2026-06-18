"use client";

import { useState } from "react";

type PrayerItem = {
  label: string;
  time: string;
  emoji?: string;
  active?: boolean;
};

type PrayerScheduleClientProps = {
  prayerTimes: PrayerItem[];
};

export default function PrayerScheduleClient({ prayerTimes }: PrayerScheduleClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeIndex = prayerTimes.findIndex((p) => p.active);
  const displayPrayer = activeIndex >= 0 ? prayerTimes[activeIndex] : prayerTimes[0];

  return (
    <>
      {/* Desktop View: always visible, hide on mobile */}
      <div className="hidden lg:flex w-full max-w-sm flex-col gap-4">
        <div className="inline-flex items-center justify-center rounded-md bg-[#d14a35] px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#111111]">
          Menurut: Kemenag Jakarta Pusat
        </div>
        {prayerTimes.map((item) => (
          <PrayerCard key={item.label} item={item} />
        ))}
      </div>

      {/* Mobile View: single card + link to open modal */}
      <div className="flex w-full flex-col gap-3 lg:hidden">
        <div className="inline-flex items-center justify-center rounded-md bg-[#d14a35] px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#111111]">
          Menurut: Kemenag Jakarta Pusat
        </div>
        <PrayerCard item={displayPrayer} isNext={!displayPrayer.active} forceWhite={true} />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-left text-xs font-semibold text-[#d14a35] hover:underline"
        >
          Lihat seluruh jadwal
        </button>
      </div>

      {/* Modal for Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/50 lg:hidden">
          <div className="flex flex-col gap-4 rounded-t-3xl border-t-[3px] border-x-[3px] border-stone-900 bg-[#f4efeb] p-6 shadow-[0_-4px_0_#111111] relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full border-2 border-stone-900 bg-white p-1 text-stone-900 shadow-[2px_2px_0_#111111] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="mt-8 flex flex-col gap-4 pb-10">
              <div className="inline-flex items-center justify-center rounded-md border-[3px] border-stone-900 bg-[#d14a35] px-4 py-2 text-xs font-semibold text-white shadow-[3px_3px_0_#111111]">
                Menurut: Kemenag Jakarta Pusat
              </div>
              {prayerTimes.map((item) => (
                <PrayerCard key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PrayerCard({ item, isNext, forceWhite }: { item: PrayerItem, isNext?: boolean, forceWhite?: boolean }) {
  const isRed = item.active && !forceWhite;
  return (
    <div
      className={
        isRed
          ? "flex items-center justify-between rounded-md border-[3px] border-stone-900 bg-[#d14a35] px-4 py-3 text-white shadow-[3px_3px_0_#111111]"
          : "flex items-center justify-between rounded-md border-[3px] border-stone-900 bg-white px-4 py-3 text-slate-700 shadow-[3px_3px_0_#111111]"
      }
    >
      <div>
        <p className={`text-lg font-semibold ${isRed ? "text-white" : "text-slate-700"}`}>
          {item.label} {item.active ? <span className="font-normal opacity-90">(saat ini)</span> : (isNext ? <span className="font-normal opacity-90">(menuju)</span> : null)}
        </p>
        <p className="text-2xl font-bold tracking-tight text-inherit">{item.time}</p>
      </div>
      <span className="text-3xl drop-shadow-sm">{item.emoji ?? "🕌"}</span>
    </div>
  );
}
