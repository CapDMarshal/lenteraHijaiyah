export default function VisiMisiPanel() {
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
