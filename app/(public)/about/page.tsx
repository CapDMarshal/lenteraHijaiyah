import Image from "next/image";
import AboutTabsClient from "@/components/about/AboutTabsClient";
import { LinkButton } from "@/components/ui/button";

const sectionContainer = "px-20";

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#f4efeb] relative z-50">
        <div className={`${sectionContainer} py-10 pb-16 sm:pb-32 relative`}>
          <div className="relative mx-auto max-w-2xl mt-8 space-y-24 text-center pt-16 pb-16">
            {/* Decorative Assets */}
            <div className="absolute -top-8 -z-0 hidden sm:block sm:-left-[10%] md:-left-[30%] lg:-left-[65%]">
              <Image src="/images/hero-swirl.png" alt="Swirl decoration" width={300} height={300} className="object-contain" priority />
            </div>
            <div className="absolute top-12 -z-0 hidden sm:block sm:-right-[5%] md:-right-[20%] lg:-right-[40%]">
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

          {/* Section Connector String */}
          <div className="absolute left-1/2 -bottom-18 -translate-x-1/2 z-0 hidden md:block">
            <Image src="/images/sectionstr.svg" alt="Connector" width={45} height={120} className="object-contain" priority />
          </div>
        </div>
      </section>

      <section className="bg-white relative z-40">
        <div className={`${sectionContainer} pb-14 pt-24 sm:pt-32`}>
          <h2 className="text-center text-5xl font-black tracking-tight text-stone-900 sm:text-6xl">
            Tentang Kami
          </h2>

          <AboutTabsClient defaultTab="Kurikulum" />
        </div>
      </section>
    </>
  );
}
