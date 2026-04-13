"use client";

import { useState } from "react";

import { aboutFiturItems, aboutTabs, aboutTimItems, type AboutTab } from "@/data/about";
import { LinkButton } from "@/components/ui/button";

const sectionContainer = "mx-auto w-full max-w-6xl px-8 sm:px-12";

function VisiMisiContent() {
  return (
    <div className="space-y-12 py-10">
      <article className="grid items-center gap-8 border-b border-stone-300 pb-10 md:grid-cols-[160px_1fr]">
        <div className="mx-auto aspect-square w-32 rounded-3xl bg-stone-200" />
        <div className="space-y-4">
          <h3 className="text-4xl font-black tracking-tight text-stone-900">Belajar Tanpa Batas.</h3>
          <p className="text-lg leading-relaxed text-slate-600">
            Kami percaya setiap siswa punya kesempatan belajar yang berbeda. Lentera Hijaiyah
            membantu proses belajar untuk menciptakan pengalaman menyenangkan, komunikatif, dan
            terarah lewat latihan menulis, membaca, dan materi ringkas.
          </p>
        </div>
      </article>

      <article className="grid items-center gap-8 border-b border-stone-300 pb-10 md:grid-cols-[1fr_160px]">
        <div className="space-y-4">
          <h3 className="text-4xl font-black tracking-tight text-stone-900">
            Ubah Tantangan Jadi Permainan.
          </h3>
          <p className="text-lg leading-relaxed text-slate-600">
            Menghafal huruf Hijaiyah sering kali terasa kaku dan membosankan. Karena itu, kami
            menghadirkan interaksi dan sistem reward sederhana agar belajar terasa seperti bermain
            game edukatif.
          </p>
        </div>
        <div className="mx-auto aspect-square w-32 rounded-3xl bg-stone-200" />
      </article>

      <article className="space-y-5">
        <h3 className="text-4xl font-black tracking-tight text-stone-900">
          Belajar Lebih Fun, Hasil Lebih Maksimal.
        </h3>
        <p className="text-lg leading-relaxed text-slate-600">
          Kami menerapkan konsep gamifikasi untuk memecah kekakuan belajar konvensional. Dengan
          elemen interaktif dan feedback instan dari AI, pembelajaran bahasa Arab menjadi lebih
          hidup, menyenangkan, dan mudah diakses seluruh siswa kapan saja.
        </p>
        <p className="text-lg leading-relaxed text-slate-600">
          Melalui pendekatan ini, setiap potensi siswa difasilitasi dari pengenalan huruf, latihan
          goresan, hingga evaluasi progres. Integrasi teknologi membuat proses belajar lebih terukur
          tanpa kehilangan nilai pembentukan karakter.
        </p>
        <p className="text-lg leading-relaxed text-slate-600">
          Visi kami adalah menghadirkan ekosistem literasi digital yang mendukung kurikulum sekolah
          sekaligus menjadikan belajar sebagai pengalaman yang modern dan bermakna.
        </p>
      </article>
    </div>
  );
}

function KurikulumContent() {
  return (
    <div className="space-y-12 py-10">
      <article className="space-y-5 border-b border-stone-300 pb-10">
        <h3 className="text-4xl font-black tracking-tight text-stone-900">Pendekatan Belajar Kami</h3>
        <p className="text-lg leading-relaxed text-slate-600">
          Kami percaya siapapun bisa menguasai huruf Hijaiyah dengan metode yang tepat. Di Lentera
          Hijaiyah, kami memecah materi yang kompleks menjadi unit belajar kecil yang interaktif,
          membuat proses belajar terasa lebih ringan dan tidak membebani siswa.
        </p>
        <p className="text-lg leading-relaxed text-slate-600">
          Pendekatan ini dirancang khusus untuk memastikan setiap siswa tidak merasa terbebani saat
          memahami kaidah penulisan. Dengan fokus pada satu langkah kecil di setiap sesi, penguasaan
          literasi Arab menjadi lebih efektif dan menyenangkan.
        </p>
      </article>

      <article className="grid items-center gap-8 border-b border-stone-300 pb-10 md:grid-cols-[160px_1fr]">
        <div className="mx-auto aspect-square w-32 rounded-3xl bg-stone-200" />
        <div className="space-y-4">
          <h3 className="text-4xl font-black tracking-tight text-stone-900">
            Pembelajaran Berbasis Data
          </h3>
          <p className="text-lg leading-relaxed text-slate-600">
            Setiap latihan terekam sebagai data progres harian. Jika ada satu huruf yang sulit kamu
            tuliskan, sistem akan menyesuaikan latihan agar huruf tersebut diulang sampai benar-benar
            mahir.
          </p>
        </div>
      </article>

      <article className="grid items-center gap-8 border-b border-stone-300 pb-10 md:grid-cols-[1fr_160px]">
        <div className="space-y-4">
          <h3 className="text-4xl font-black tracking-tight text-stone-900">Koreksi Instan dengan AI</h3>
          <p className="text-lg leading-relaxed text-slate-600">
            Kamu tidak perlu menunggu koreksi dari guru. Teknologi pintar kami membantu memberi
            penilaian goresan, deteksi bagian yang perlu diperbaiki, dan rekomendasi latihan berikutnya.
          </p>
          <p className="text-lg leading-relaxed text-slate-600">
            Sistem ini memastikan setiap lengkungan huruf Hijaiyah yang kamu pelajari sesuai aturan
            penulisan yang benar.
          </p>
        </div>
        <div className="mx-auto aspect-square w-32 rounded-3xl bg-stone-200" />
      </article>

      <article className="grid items-center gap-8 border-b border-stone-300 pb-10 md:grid-cols-[160px_1fr]">
        <div className="mx-auto aspect-square w-32 rounded-3xl bg-stone-200" />
        <div className="space-y-4">
          <h3 className="text-4xl font-black tracking-tight text-stone-900">Pengembangan Berkelanjutan</h3>
          <p className="text-lg leading-relaxed text-slate-600">
            Kami berkomitmen untuk terus memperbarui konten literasi dan fitur aplikasi berdasarkan
            masukan guru serta siswa. Tujuannya agar platform ini selalu relevan dengan kebutuhan
            pembelajaran digital modern.
          </p>
        </div>
      </article>

      <div className="space-y-6 text-center">
        <p className="text-lg text-stone-700">
          Butuh bantuan? Hubungi kami <span className="text-[#d14a35]">disini</span>
        </p>
        <LinkButton href="/sign-up" variant="ink" size="hero">
          Belajar Sekarang
        </LinkButton>
      </div>
    </div>
  );
}

function FiturContent() {
  return (
    <div className="space-y-10 py-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {aboutFiturItems.map((feature) => (
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

      <div className="flex justify-center">
        <LinkButton href="/sign-up" variant="ink" size="hero">
          Belajar Sekarang
        </LinkButton>
      </div>
    </div>
  );
}

function TimContent() {
  return (
    <div className="space-y-12 py-10">
      {aboutTimItems.map((item) => (
        <article
          key={item.title}
          className="grid items-center gap-8 md:grid-cols-[1fr_1fr] md:gap-10"
        >
          <div className={item.imageLeft ? "order-1" : "order-2"}>
            <div className="h-56 w-full rounded-2xl border-2 border-stone-900 bg-[#f0d0ca] shadow-[5px_5px_0_#111]" />
          </div>

          <div className={`${item.imageLeft ? "order-2" : "order-1"} space-y-4`}>
            <h3 className="text-5xl font-black tracking-tight text-stone-900">{item.title}</h3>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function KontakContent() {
  return (
    <div className="py-14 text-center">
      <div className="mx-auto max-w-4xl space-y-6">
        <h3 className="text-5xl font-black tracking-tight text-stone-900">Hubungi Kami</h3>

        <p className="text-lg text-stone-700">
          Apakah Anda mengalami masalah?{" "}
          <a href="#" className="font-semibold text-[#d14a35] hover:underline">
            Temukan bantuan disini
          </a>
        </p>

        <p className="text-lg text-stone-700">
          Menemukan bug atau error pada halaman atau fitur?{" "}
          <a href="#" className="font-semibold text-[#d14a35] hover:underline">
            Lapor disini
          </a>
        </p>

        <p className="text-lg text-stone-700">
          Tertarik untuk kolaborasi?{" "}
          <a
            href="mailto:hello@utysoftwarehouse.dev"
            className="font-semibold text-[#d14a35] hover:underline"
          >
            hello@utysoftwarehouse.dev
          </a>
        </p>
      </div>
    </div>
  );
}

function PlaceholderContent({ label }: { label: string }) {
  return (
    <div className="py-12 text-center">
      <p className="text-xl text-slate-600">Konten {label} akan ditambahkan pada tahap berikutnya.</p>
    </div>
  );
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<AboutTab>("Kurikulum");

  return (
    <>
      <section className="bg-[#f4efeb]">
        <div className={`${sectionContainer} py-12 sm:py-16`}>
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-stone-900 sm:text-6xl">
              Tentang <span className="text-[#d14a35]">Lentera Hijaiyah</span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-600">
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
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-5xl font-black tracking-tight text-stone-900 sm:text-6xl">
              Tentang Kami
            </h2>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-b border-stone-300 pb-5">
              {aboutTabs.map((tab) => {
                const isActive = tab === activeTab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={
                      isActive
                        ? "rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-[3px_3px_0_#d14a35] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#d14a35] active:translate-y-0.5 active:shadow-[2px_2px_0_#d14a35]"
                        : "rounded-md px-4 py-2 text-sm font-semibold text-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-100 hover:text-stone-900 active:translate-y-0.5"
                    }
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {activeTab === "Visi & Misi" && <VisiMisiContent />}
            {activeTab === "Kurikulum" && <KurikulumContent />}
            {activeTab === "Fitur" && <FiturContent />}
            {activeTab === "Tim" && <TimContent />}
            {activeTab === "Kontak" && <KontakContent />}
          </div>
        </div>
      </section>
    </>
  );
}
