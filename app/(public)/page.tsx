import Image from "next/image";

import {
  landingBenefits,
  landingFeatures,
} from "@/data/landing";
import FaqSectionClient from "@/components/landing/FaqSectionClient";
import TestimonialsSectionClient from "@/components/landing/TestimonialsSectionClient";
import { LinkButton } from "@/components/ui/button";

const sectionContainer = "px-20";
const benefitCatImages = [
  "/images/cat-1.png",
  "/images/cat-2.png",
  "/images/cat-3.png",
  "/images/cat-4.png",
];

export default function LandingPage() {
  return (
    <>
      <section className="bg-[#f4efeb]">
        <div className={`${sectionContainer} py-10 sm:py-12`}>
          <div className="relative mx-auto max-w-2xl mt-8 space-y-16 text-center">
            {/* Decorative Assets */}
            <div className="absolute -left-110 -top-8 -z-0 hidden md:block">
              <Image src="/images/hero-swirl.png" alt="Swirl decoration" width={300} height={300} className="object-contain" priority />
            </div>
            <div className="absolute -right-80 top-12 -z-0 hidden md:block">
              <Image src="/images/hero-star.png" alt="Star decoration" width={120} height={120} className="object-contain" priority />
            </div>

            <h1 className="relative z-10 text-6xl font-black leading-tight tracking-tight text-stone-900 sm:text-6xl">
              Teman Belajar <span className="text-[#d14a35]">Hijaiyah</span>
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

      <section className="bg-[#f4efeb] relative z-50">
        <div className={`${sectionContainer} pb-12 sm:pb-32 relative`}>
          <div className="flex w-full flex-col items-center justify-between gap-6 rounded-br-2xl border-b-2 border-r-2 border-stone-900 bg-[#F7EDE8] px-8 py-6 shadow-[4px_4px_0_#111111] sm:flex-row relative z-10">
            <p className="text-2xl ml-16 font-bold text-stone-900">Hasil kolaborasi antara:</p>
            <div className="flex items-center gap-24">
              <div className="flex items-center gap-2">
                <Image src="/images/smp-logo.png" alt="Logo SMPN 1 Seyegan" width={75} height={75} className="object-contain" />
                <span className="text-xl font-semibold text-slate-700">SMPN 1 SEYEGAN</span>
              </div>
              <div className="flex items-center gap-2 mr-16">
                <Image src="/images/ush-logo.png" alt="Logo UTY Software House" height={40} width={360} className="object-contain" />
              </div>
            </div>
          </div>

          {/* Section Connector String */}
          <div className="absolute left-1/2 -bottom-18 -translate-x-1/2 z-0 hidden md:block">
            <Image src="/images/sectionstr.svg" alt="Connector" width={45} height={120} className="object-contain" priority />
          </div>
        </div>
      </section>

      <section id="benefit-section" className="bg-white/70 relative z-40">
        <div className={`${sectionContainer} pb-14 pt-10 sm:pb-32 relative`}>
          <div className="grid w-full gap-8 relative z-10">
            {landingBenefits.map((benefit, index) => {
              const textLeft = index % 2 === 0;

              return (
                <article
                  key={benefit.title}
                  className="grid items-center gap-8 py-2 md:grid-cols-2 md:gap-14"
                >
                  <div className={textLeft ? "order-1" : "order-2"}>
                    <h2 className="text-4xl font-extrabold tracking-tight text-stone-900">
                      {benefit.title}
                    </h2>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                      {benefit.subtitle}
                    </p>
                  </div>

                  <div className={textLeft ? "order-2" : "order-1"}>
                    <div className="relative mx-auto aspect-[5/4] w-full max-w-[360px] rounded-3xl">
                      <Image
                        src={benefitCatImages[index % benefitCatImages.length]}
                        alt={`Ilustrasi kucing ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Section Connector String */}
          <div className="absolute left-1/2 -bottom-18 -translate-x-1/2 z-0 hidden md:block">
            <Image src="/images/sectionstr.svg" alt="Connector" width={45} height={120} className="object-contain" priority />
          </div>
        </div>
      </section>

      <section id="feature-section" className="bg-[#f4efeb] relative z-30">
        <div className={`${sectionContainer} pb-16 pt-24 sm:pt-32 sm:pb-32 relative`}>
          <div className="w-full">
            <h2 className="text-center text-4xl font-extrabold tracking-tight text-stone-900">
              Fitur & Games
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {landingFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex h-full flex-col items-center gap-4 bg-transparent px-6 py-8 text-center"
                >
                  <div className="relative aspect-square w-32 bg-transparent">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-stone-900">{feature.title}</h3>
                  <p className="text-lg leading-relaxed text-slate-600">{feature.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center relative z-10">
              <LinkButton href="/sign-in" variant="ink" size="hero">
                Lihat Semua
              </LinkButton>
            </div>
          </div>

          {/* Section Connector String */}
          <div className="absolute left-1/2 -bottom-18 -translate-x-1/2 z-0 hidden md:block">
            <Image src="/images/sectionstr.svg" alt="Connector" width={45} height={120} className="object-contain" priority />
          </div>
        </div>
      </section>

      <TestimonialsSectionClient sectionContainerClass={sectionContainer} />

      <FaqSectionClient sectionContainerClass={sectionContainer} />
    </>
  );
}
