import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <section className="bg-[#f4efeb] px-8 py-10 sm:px-12 sm:py-12">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className="text-5xl font-black leading-tight tracking-tight text-stone-900 sm:text-6xl">
          Teman Belajar <span className="text-[#d14a35]">Hijaiyah</span>
        </h1>
        <p className="text-lg text-slate-600">
          Kuasai cara menulis dan membaca huruf Hijaiyah dengan panduan pintar dari AI.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex rounded-md bg-black px-9 py-3 text-lg font-semibold text-white shadow-[6px_6px_0_#d14a35] transition-colors hover:bg-stone-900"
        >
          Coba Sekarang
        </Link>
      </div>

      <hr className="my-10 border-stone-300" />

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
    </section>
  );
}
