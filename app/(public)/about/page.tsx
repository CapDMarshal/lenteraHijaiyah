import Image from "next/image";
import AboutTabsClient from "@/components/about/AboutTabsClient";
import { LinkButton } from "@/components/ui/button";

const sectionContainer = "px-20";

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#f4efeb]">
        <div className={`${sectionContainer} py-10 sm:py-12`}>
          <div className="relative mx-auto max-w-2xl mt-8 space-y-24 text-center pt-16 pb-16">
            {/* Decorative Assets */}
            <div className="absolute -left-110 -top-8 -z-0 hidden md:block">
              <Image src="/images/hero-swirl.png" alt="Swirl decoration" width={300} height={300} className="object-contain" priority />
            </div>
            <div className="absolute -right-80 top-12 -z-0 hidden md:block">
              <Image src="/images/hero-star.png" alt="Star decoration" width={120} height={120} className="object-contain" priority />
            </div>

            <h1 className="relative z-10 text-6xl font-black leading-tight tracking-tight text-stone-900 sm:text-6xl">
              Tentang <span className="text-[#d14a35]">Lentera Hijaiyah</span>
            </h1>
            <p className="text-lg text-slate-600 font-semibold">
              Kuasai cara menulis dan membaca huruf Hijaiyah dengan panduan pintar dari AI.
            </p>
            <LinkButton href="/sign-up" variant="ink" size="hero">
              Coba Sekarang
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${sectionContainer} py-14`}>
          <h2 className="text-center text-5xl font-black tracking-tight text-stone-900 sm:text-6xl">
            Tentang Kami
          </h2>

          <AboutTabsClient defaultTab="Kurikulum" />
        </div>
      </section>
    </>
  );
}
