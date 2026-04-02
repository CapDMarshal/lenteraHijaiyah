"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    title: "Gratis. Seru. Efektif.",
    subtitle:
      "Belajar di Lentera Hijaiyah nggak bakal ngebosenin. Lewat tantangan seru dan materi singkat, kamu bisa dapetin poin serta buka level baru sambil ngasah kemampuan nulis Arabmu secara nyata.",
  },
  {
    title: "Materi Paling Lengkap",
    subtitle:
      "Kami nyediain cara belajar yang paling pas buat melatih jemarimu nulis di canvas digital, lancar baca Al-Quran 30 Juz, sampe paham cara ibadah harian yang bener.",
  },
  {
    title: "Pintar Berkat AI",
    subtitle:
      "Lewat teknologi asisten pintar, setiap pelajaran bakal disesuaiin sama kemampuanmu. Sistem kami bakal mastiin kamu belajar di level yang pas, nggak terlalu gampang tapi juga nggak bikin pusing.",
  },
  {
    title: "Semangat Setiap Hari",
    subtitle:
      'Kami bantu kamu buat jadiin belajar itu sebagai hobi lewat fitur mirip game, kuis yang menantang, dan pengingat dari maskot "Lentera" biar kamu tetep semangat latihan.',
  },
];

const features = [
  {
    title: "Lukis Canvas",
    subtitle: "Latihan menulis huruf hijaiyah langsung di canvas.",
  },
  {
    title: "Tutorial Video",
    subtitle: "Pelajari cara menulis langkah demi langkah dalam bentuk video.",
  },
  {
    title: "Check Progress",
    subtitle: "Pantau belajarmu dan lihat perkembangan kemampuanmu.",
  },
  {
    title: "Text Book",
    subtitle: "Perdalam pemahamanmu dengan materi teori yang lengkap.",
  },
  {
    title: "Komunitas",
    subtitle: "Saling berbagi pengalaman belajar dengan siswa lainnya.",
  },
  {
    title: "Dan banyak lagi!",
    subtitle: "Temukan fitur lainnya untuk pembelajaran huruf hijaiyah.",
  },
];

const testimonials = [
  {
    quote:
      "Inovasi ini sejalan dengan visi kami dalam mendorong kreativitas siswa dan pembelajaran berdampak nyata.",
    name: "Ibu Dian Rahma",
    role: "Wakil Kepala Sekolah",
    logoSrc: "/next.svg",
    logoAlt: "Institution logo",
  },
  {
    quote:
      "Lentera Hijaiyah adalah bukti nyata teknologi AI bisa menyentuh sisi religius dengan cara yang modern.",
    name: "Zakki Farian",
    role: "Head of USH",
    logoSrc: "/vercel.svg",
    logoAlt: "Partner logo",
  },
  {
    quote:
      "Aplikasi ini membantu siswa belajar lebih konsisten karena materi singkatnya mudah dipahami setiap hari.",
    name: "Bapak Arif Nugroho",
    role: "Guru PAI",
    logoSrc: "/next.svg",
    logoAlt: "School logo",
  },
];

const faqs = [
  {
    question: "Apa itu Lentera Hijaiyah?",
    answer:
      "Lentera Hijaiyah adalah platform belajar digital hasil kolaborasi SMPN 1 Seyegan dan UTY Software House untuk membantu siswa menguasai huruf Hijaiyah dan literasi Arab melalui teknologi pintar.",
  },
  {
    question: "Bagaimana cara kerja fitur koreksi tulisannya?",
    answer:
      "Sistem membaca pola goresan di canvas lalu membandingkannya dengan bentuk huruf target. Kamu akan mendapatkan skor, feedback, dan saran perbaikan secara langsung.",
  },
  {
    question: "Apakah aplikasi ini bisa diakses lewat HP?",
    answer:
      "Bisa. Aplikasi dirancang responsif untuk desktop, tablet, dan ponsel agar latihan tetap nyaman di mana pun.",
  },
  {
    question: "Apa saja materi yang bisa dipelajari selain menulis?",
    answer:
      "Selain latihan menulis, kamu bisa belajar membaca Al-Quran, memahami materi teori, serta mengerjakan kuis interaktif untuk mengukur progres.",
  },
  {
    question: "Apakah data belajar saya akan tersimpan dengan aman?",
    answer:
      "Ya. Data akun dan progres belajar disimpan dengan kontrol akses dan validasi yang aman sesuai praktik pengembangan aplikasi modern.",
  },
  {
    question: "Bagaimana jika saya menemukan kendala saat menggunakan aplikasi?",
    answer:
      "Kamu bisa melaporkan kendala melalui kontak dukungan di halaman profil atau menu bantuan. Tim akan menindaklanjuti laporan secepat mungkin.",
  },
];

const sectionContainer = "mx-auto w-full max-w-6xl px-8 sm:px-12";

export default function LandingPage() {
  const testimonialRailRef = useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);

  const scrollTestimonials = (direction: "left" | "right") => {
    const rail = testimonialRailRef.current;
    if (!rail) {
      return;
    }

    const cardWidth = 380;
    rail.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((current) => (current === index ? -1 : index));
  };

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

          <Card className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 border-stone-300 bg-white/70 py-7 sm:flex-row sm:justify-between sm:px-8">
            <p className="text-xl font-bold text-stone-900">Hasil kolaborasi antara:</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Image src="/next.svg" alt="Partner logo one" width={94} height={20} />
                <span className="text-sm font-semibold text-slate-700">SMPN 1 SEYEGAN</span>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/vercel.svg" alt="Partner logo two" width={94} height={20} />
                <span className="text-sm font-semibold text-slate-700">UTY Software House</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="benefit-section" className="bg-white/70">
        <div className={`${sectionContainer} py-14`}>
          <div className="mx-auto grid w-full max-w-5xl gap-8">
            {benefits.map((benefit, index) => {
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
                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
                      {benefit.subtitle}
                    </p>
                  </div>

                  <div className={textLeft ? "order-2" : "order-1"}>
                    <div className="mx-auto aspect-square w-44 rounded-3xl bg-stone-200/80" />
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
              {features.map((feature) => (
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

      <section id="testimonial-section" className="bg-white/70">
        <div className={`${sectionContainer} py-16`}>
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-center text-5xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Apa yang mereka katakan
            </h2>

            <div ref={testimonialRailRef} className="no-scrollbar mt-10 flex gap-5 overflow-x-auto pb-2">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="min-w-[550px] rounded-2xl border border-stone-300 bg-[#dde5ec] p-6 shadow-[4px_4px_0_#3f444a] sm:min-w-[500px]"
                >
                  <p className="text-6xl font-black leading-none text-[#d14a35]">,,</p>
                  <p className="mt-4 text-center text-2xl leading-relaxed text-stone-900">
                    {testimonial.quote}
                  </p>

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-stone-900 bg-white text-xl font-bold text-stone-900">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-stone-900">{testimonial.name}</p>
                        <p className="text-sm text-slate-700">{testimonial.role}</p>
                      </div>
                    </div>

                    <Image
                      src={testimonial.logoSrc}
                      alt={testimonial.logoAlt}
                      width={72}
                      height={20}
                    />
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
        </div>
      </section>

      <section id="faq-section" className="bg-[#f4efeb]">
        <div className={`${sectionContainer} py-16`}>
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-center text-5xl font-black tracking-tight text-stone-900 sm:text-6xl">
              Pertanyaan yang sering diajukan
            </h2>

            <div className="mt-10 overflow-hidden rounded-2xl border-2 border-stone-900 bg-white shadow-[6px_6px_0_#d98a79]">
              {faqs.map((faq, index) => {
                const isOpen = index === openFaqIndex;

                return (
                  <div
                    key={faq.question}
                    className={index !== faqs.length - 1 ? "border-b border-stone-400" : ""}
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
    </>
  );
}
