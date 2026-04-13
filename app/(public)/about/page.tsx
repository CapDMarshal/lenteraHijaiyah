import AboutTabsClient from "@/components/about/AboutTabsClient";
import { LinkButton } from "@/components/ui/button";

const sectionContainer = "mx-auto w-full max-w-6xl px-8 sm:px-12";

export default function AboutPage() {
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

            <AboutTabsClient defaultTab="Kurikulum" />
          </div>
        </div>
      </section>
    </>
  );
}
