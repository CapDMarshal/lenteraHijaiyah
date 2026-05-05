export const aboutTabs = ["Visi & Misi", "Kurikulum", "Fitur", "Tim", "Kontak"] as const;

export type AboutTab = (typeof aboutTabs)[number];

export const aboutFiturItems = [
  {
    title: "Lukis Canvas",
    subtitle: "Latihan menulis huruf hijaiyah langsung di canvas.",
  },
  {
    title: "Al-Qur'an Digital",
    subtitle: "Baca Al-Qur'an secara langsung di website.",
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

export const aboutTimItems = [
  {
    title: "Teknis",
    description:
      "Bagian rekayasa (engineering) adalah fungsi terbesar kami di Lentera Hijaiyah. Mereka membangun, menjalankan, dan memelihara produk serta fitur kami.",
    imageLeft: true,
  },
  {
    title: "Produk",
    description:
      "Tim produk di Lentera Hijaiyah berfokus pada mendefinisikan, meluncurkan, dan meningkatkan semua yang kami bangun.",
    imageLeft: false,
  },
  {
    title: "Desain",
    description:
      "Desain menggabungkan desain produk, seni, animasi, merek, dan pengalaman untuk menghadirkan kesenangan pada produk kami.",
    imageLeft: true,
  },
];
