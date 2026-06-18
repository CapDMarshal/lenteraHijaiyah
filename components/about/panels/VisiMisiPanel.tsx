import Image from "next/image";

export default function VisiMisiPanel() {
  return (
    <div className="space-y-12 py-10">
      <article className="grid items-center gap-8 md:grid-cols-[250px_1fr]">
        <div className="order-2 md:order-1 relative mx-auto h-[250px] w-[250px] max-h-[250px]">
          <Image src="/images/cat-6.png" alt="Ilustrasi visi" fill className="object-contain" />
        </div>
        <div className="order-1 md:order-2 space-y-4 text-center md:text-left">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">Belajar Tanpa Batas.</h3>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-left">
            Kami percaya setiap siswa punya kesempatan belajar yang berbeda. Lentera Hijaiyah
            membantu proses belajar untuk menciptakan pengalaman menyenangkan, komunikatif, dan
            terarah lewat latihan menulis, membaca, dan materi ringkas.
          </p>
        </div>
      </article>

      <article className="grid items-center gap-8 md:grid-cols-[1fr_250px]">
        <div className="order-1 md:order-1 space-y-4 text-center md:text-right">
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 text-left md:text-right">
            Ubah Tantangan Jadi Permainan.
          </h3>
          <p className="text-base sm:text-lg leading-relaxed text-slate-600 text-left md:text-right">
            Menghafal huruf Hijaiyah sering kali terasa kaku dan membosankan. Karena itu, kami
            menghadirkan interaksi dan sistem reward sederhana agar belajar terasa seperti bermain
            game edukatif.
          </p>
        </div>
        <div className="order-2 md:order-2 relative mx-auto h-[250px] w-[250px] max-h-[250px]">
          <Image src="/images/cat-7.png" alt="Ilustrasi misi" fill className="object-contain" />
        </div>
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
