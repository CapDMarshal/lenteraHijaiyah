"use client";

import { useState } from "react";

import { landingFaqs } from "@/data/landing";

type FaqSectionClientProps = {
  sectionContainerClass: string;
};

export default function FaqSectionClient({ sectionContainerClass }: FaqSectionClientProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section id="faq-section" className="bg-[#f4efeb] relative z-10">
      <div className={`${sectionContainerClass} pb-16 pt-24 sm:pt-32`}>
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-center text-5xl font-black tracking-tight text-stone-900 sm:text-6xl">
            Pertanyaan yang sering diajukan
          </h2>

          <div className="mt-10 overflow-hidden rounded-2xl border-2 border-stone-900 bg-white shadow-[6px_6px_0_#d98a79]">
            {landingFaqs.map((faq, index) => {
              const isOpen = index === openFaqIndex;

              return (
                <div
                  key={faq.question}
                  className={index !== landingFaqs.length - 1 ? "border-b border-stone-400" : ""}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start gap-5 px-6 py-5 text-left"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center text-4xl leading-none text-stone-900">
                      {isOpen ? "-" : "+"}
                    </span>
                    <span className="pt-1 text-3xl font-semibold text-stone-900">{faq.question}</span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-19 pb-6 text-lg leading-relaxed text-slate-600 sm:px-20">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
