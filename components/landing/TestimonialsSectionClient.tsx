"use client";

import Image from "next/image";
import { useRef } from "react";

import { landingTestimonials } from "@/data/landing";

type TestimonialsSectionClientProps = {
  sectionContainerClass: string;
};

export default function TestimonialsSectionClient({
  sectionContainerClass,
}: TestimonialsSectionClientProps) {
  const testimonialRailRef = useRef<HTMLDivElement>(null);

  const scrollTestimonials = (direction: "left" | "right") => {
    const rail = testimonialRailRef.current;
    if (!rail) {
      return;
    }

    const step = Math.max(320, Math.floor(rail.clientWidth * 0.75));
    rail.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section id="testimonial-section" className="bg-white/70 relative z-20">
      <div className={`${sectionContainerClass} pb-16 pt-24 sm:pt-32 sm:pb-32 relative`}>
        <div className="mx-auto w-full max-w-6xl relative z-10">
          <div className="relative inline-block w-full text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-6 left-1/2 -translate-x-[110%] sm:-translate-x-[150%]">
              <path d="M12 18L18 8M22 16L24 6M10 24L2 26" stroke="#d14a35" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <h2 className="text-center text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900">
              Apa yang mereka katakan
            </h2>
          </div>

          <div ref={testimonialRailRef} className="no-scrollbar mt-10 flex gap-5 overflow-x-auto pb-2">
            {landingTestimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="flex w-[85vw] shrink-0 flex-col rounded-3xl border-[3px] border-stone-900 bg-[#dde5ec] p-6 sm:p-8 shadow-[6px_6px_0_#111111] sm:w-auto sm:min-w-[500px]"
              >
                <p className="text-6xl font-black leading-none text-[#d14a35]">“</p>
                <p className="mt-4 text-left text-lg sm:text-xl font-semibold leading-relaxed text-stone-900">
                  {testimonial.quote}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-stone-900 bg-white text-xl font-bold text-stone-900">
                      {(testimonial as any).avatarSrc ? (
                        <Image src={(testimonial as any).avatarSrc} alt={testimonial.name} fill className="object-cover" />
                      ) : (
                        testimonial.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-semibold text-stone-900">{testimonial.name}</p>
                      <p className="text-xs sm:text-sm text-slate-700">{testimonial.role}</p>
                    </div>
                  </div>

                  <Image src={testimonial.logoSrc} alt={testimonial.logoAlt} width={72} height={20} />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 sm:justify-start">
            <button
              type="button"
              aria-label="Testimonial previous"
              onClick={() => scrollTestimonials("left")}
              className="grid h-14 w-20 place-items-center rounded-lg border-[3px] border-stone-900 bg-white text-3xl text-stone-900 shadow-[4px_4px_0_#111111] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <button
              type="button"
              aria-label="Testimonial next"
              onClick={() => scrollTestimonials("right")}
              className="grid h-14 w-20 place-items-center rounded-lg border-[3px] border-stone-900 bg-white text-3xl text-stone-900 shadow-[4px_4px_0_#111111] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* Section Connector String */}
        <div className="absolute left-1/2 -bottom-18 -translate-x-1/2 z-0 hidden md:block">
          <Image src="/images/sectionstr.svg" alt="Connector" width={45} height={120} className="object-contain" priority />
        </div>
      </div>
    </section>
  );
}
