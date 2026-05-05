"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { aboutTabs, type AboutTab } from "@/data/about";

const panelLoaders = {
  "Visi & Misi": () => import("./panels/VisiMisiPanel"),
  Kurikulum: () => import("./panels/KurikulumPanel"),
  Fitur: () => import("./panels/FiturPanel"),
  Tim: () => import("./panels/TimPanel"),
  Kontak: () => import("./panels/KontakPanel"),
} as const;

const VisiMisiPanel = dynamic(panelLoaders["Visi & Misi"]);
const KurikulumPanel = dynamic(panelLoaders.Kurikulum);
const FiturPanel = dynamic(panelLoaders.Fitur);
const TimPanel = dynamic(panelLoaders.Tim);
const KontakPanel = dynamic(panelLoaders.Kontak);

type AboutTabsClientProps = {
  defaultTab?: AboutTab;
};

const panelMap = {
  "Visi & Misi": VisiMisiPanel,
  Kurikulum: KurikulumPanel,
  Fitur: FiturPanel,
  Tim: TimPanel,
  Kontak: KontakPanel,
} as const;

export default function AboutTabsClient({ defaultTab = "Kurikulum" }: AboutTabsClientProps) {
  const [activeTab, setActiveTab] = useState<AboutTab>(defaultTab);
  const ActivePanel = panelMap[activeTab];

  const prefetchTabPanel = (tab: AboutTab) => {
    void panelLoaders[tab]();
  };

  return (
    <>
      <div className="mt-10 flex w-full flex-wrap items-center justify-between gap-3 border-b border-stone-300 pb-5 px-4">
        {aboutTabs.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              onMouseEnter={() => prefetchTabPanel(tab)}
              onFocus={() => prefetchTabPanel(tab)}
              className={
                isActive
                  ? "rounded-md bg-black px-16 py-3 text-lg font-semibold text-white shadow-[6px_6px_0_#d14a35] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#d14a35] active:translate-y-0.5 active:shadow-[2px_2px_0_#d14a35]"
                  : "rounded-md px-16 py-3 text-lg font-semibold text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 hover:text-stone-900 active:translate-y-0.5"
              }
            >
              {tab}
            </button>
          );
        })}
      </div>

      <ActivePanel />
    </>
  );
}
