import Image from "next/image";

import { LinkButton } from "@/components/ui/button";

export default function KurikulumPanel() {
  return (
    <div className="space-y-12 py-10">
      <article className="space-y-5 text-center md:text-left">
        <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">Pendekatan Belajar Kami</h3>
        <p className="text-base sm:text-lg leading-relaxed text-slate-600">
          Kami percaya siapapun bisa menguasai huruf Hijaiyah dengan metode yang tepat. Di Lentera
          Hijaiyah, kami memecah materi yang kompleks menjadi unit belajar kecil yang interaktif,
          membuat proses belajar terasa lebih ringan dan tidak membebani siswa.
        </p>
        <p className="text-base sm:text-lg leading-relaxed text-slate-600">
          Pendekatan ini dirancang khusus untuk memastikan setiap siswa tidak merasa terbebani saat
          memahami kaidah penulisan. Dengan fokus pada satu langkah kecil di setiap sesi, penguasaan
          literasi Arab menjadi lebih efektif dan menyenangkan.
        </p>
      </article>

      <article className="grid items-center gap-8 md:grid-cols-[250px_1fr]">
        <div className="order-2 md:order-1 relative mx-auto h-[250px] w-[250px] max-h-[250px]">
          <Image src="/images/cat-8.png" alt="Ilustrasi pembelajaran" fill className="object-contain" />
        </div>
        <div className="order-1 md:order-2 space-y-4 text-center md:text-left">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">Pembelajaran Berbasis Data</h3>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-left">
            Setiap latihan terekam sebagai data progres harian. Jika ada satu huruf yang sulit kamu
            tuliskan, sistem akan menyesuaikan latihan agar huruf tersebut diulang sampai benar-benar
            mahir.
          </p>
        </div>
      </article>

      <article className="grid items-center gap-8 md:grid-cols-[1fr_250px]">
        <div className="order-1 md:order-1 space-y-4 text-center md:text-right">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 text-left md:text-right">Koreksi Instan dengan AI</h3>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-left md:text-right">
            Kamu tidak perlu menunggu koreksi dari guru. Teknologi pintar kami membantu memberi
            penilaian goresan, deteksi bagian yang perlu diperbaiki, dan rekomendasi latihan berikutnya.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-left md:text-right">
            Sistem ini memastikan setiap lengkungan huruf Hijaiyah yang kamu pelajari sesuai aturan
            penulisan yang benar.
          </p>
        </div>
        <div className="order-2 md:order-2 relative mx-auto h-[250px] w-[250px] max-h-[250px]">
          <Image src="/images/cat-9.png" alt="Ilustrasi AI" fill className="object-contain" />
        </div>
      </article>

      <article className="grid items-center gap-8 md:grid-cols-[250px_1fr]">
        <div className="order-2 md:order-1 relative mx-auto h-[250px] w-[250px] max-h-[250px]">
          <Image src="/images/cat-10.png" alt="Ilustrasi pengembangan" fill className="object-contain" />
        </div>
        <div className="order-1 md:order-2 space-y-4 text-center md:text-left">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">Pengembangan Berkelanjutan</h3>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-left">
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
