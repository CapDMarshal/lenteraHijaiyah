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
          <h2 className="text-center text-5xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Apa yang mereka katakan
          </h2>

          <div ref={testimonialRailRef} className="no-scrollbar mt-10 flex gap-5 overflow-x-auto pb-2">
            {landingTestimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="flex min-w-[550px] flex-col rounded-2xl border border-stone-300 bg-[#dde5ec] p-6 shadow-[4px_4px_0_#3f444a] sm:min-w-[500px]"
              >
                <p className="text-6xl font-black leading-none text-[#d14a35]">,,</p>
                <p className="mt-4 text-center text-2xl leading-relaxed text-stone-900">
                  {testimonial.quote}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-stone-900 bg-white text-xl font-bold text-stone-900">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-stone-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-700">{testimonial.role}</p>
                    </div>
                  </div>

                  <Image src={testimonial.logoSrc} alt={testimonial.logoAlt} width={72} height={20} />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-4">
            <button
              type="button"
              aria-label="Testimonial previous"
              onClick={() => scrollTestimonials("left")}
              className="grid h-14 w-14 place-items-center rounded-md border-2 border-stone-900 bg-white text-3xl text-stone-900 shadow-[2px_2px_0_#1f1f1f]"
            >
              {"<"}
            </button>
            <button
              type="button"
              aria-label="Testimonial next"
              onClick={() => scrollTestimonials("right")}
              className="grid h-14 w-14 place-items-center rounded-md border-2 border-stone-900 bg-white text-3xl text-stone-900 shadow-[2px_2px_0_#1f1f1f]"
            >
              {">"}
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
