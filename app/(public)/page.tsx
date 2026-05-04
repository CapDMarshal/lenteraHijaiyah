import Image from "next/image";

import {
  landingBenefits,
  landingFeatures,
} from "@/data/landing";
import FaqSectionClient from "@/components/landing/FaqSectionClient";
import TestimonialsSectionClient from "@/components/landing/TestimonialsSectionClient";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const sectionContainer = "mx-auto w-full max-w-6xl px-8 sm:px-12";
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
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-stone-900 sm:text-6xl">
              Teman Belajar <span className="text-[#d14a35]">Hijaiyah</span>
            </h1>
            <p className="text-lg text-slate-600">
              Kuasai cara menulis dan membaca huruf Hijaiyah dengan panduan pintar dari AI.
            </p>
            <LinkButton href="/sign-up" variant="ink" size="hero">
              Coba Sekarang
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="bg-[#f4efeb]">
        <div className={`${sectionContainer} pb-12 sm:pb-14`}>
          <hr className="mb-10 border-stone-300" />

          <Card className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 border-stone-300 bg-white/70 py-7 sm:flex-row sm:justify-center sm:px-8">
            <p className="text-xl font-bold text-stone-900">Hasil kolaborasi antara:</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Image src="/images/smp-logo.png" alt="Logo SMPN 1 Seyegan" width={50} height={20} />
                <span className="text-sm font-semibold text-slate-700">SMPN 1 SEYEGAN</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/images/ush-logo.png" alt="Logo UTY Software House" height={100} width={260} />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="benefit-section" className="bg-white/70">
        <div className={`${sectionContainer} py-14`}>
          <div className="mx-auto grid w-full max-w-5xl gap-8">
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
                    <div className="relative mx-auto aspect-[5/4] w-full max-w-[240px] rounded-3xl">
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
        </div>
      </section>

      <section id="feature-section" className="bg-[#f4efeb]">
        <div className={`${sectionContainer} py-16`}>
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="text-center text-4xl font-extrabold tracking-tight text-stone-900">
              Fitur & Games
            </h2>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {landingFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex h-full flex-col items-center gap-4 bg-transparent px-6 py-8 text-center"
                >
                  <div className="aspect-square w-16 rounded-2xl bg-stone-200/90" />
                  <h3 className="text-3xl font-bold tracking-tight text-stone-900">{feature.title}</h3>
                  <p className="text-lg leading-relaxed text-slate-600">{feature.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <LinkButton href="/sign-in" variant="ink" size="hero">
                Lihat Semua
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSectionClient sectionContainerClass={sectionContainer} />

      <FaqSectionClient sectionContainerClass={sectionContainer} />
    </>
  );
}
