export type ModuleItem = {
  slug: string;
  title: string;
  summary: string;
  durationMinutes: number;
  pages: number;
  level: "Dasar" | "Menengah" | "Lanjut";
  pdfUrl: string;
};

export type ModuleCategory = {
  key: "fiqih" | "aqidah" | "pai" | "arab";
  label: string;
  description: string;
  modules: ModuleItem[];
};

export const moduleCategories: ModuleCategory[] = [
  {
    key: "fiqih",
    label: "Fiqih",
    description:
      "Alur belajar terpadu untuk membentuk karakter dan akhlak mulia pelajar muslim.",
    modules: [
      {
        slug: "fiqih-wudhu",
        title: "Memahami Thaharah dan Wudhu",
        summary: "Dasar bersuci, adab wudhu, dan praktik sehari-hari.",
        durationMinutes: 40,
        pages: 120,
        level: "Dasar",
        pdfUrl: "/pdf/fiqih-wudhu.pdf",
      },
      {
        slug: "fiqih-shalat",
        title: "Tuntunan Shalat Fardhu",
        summary: "Rukun, bacaan, dan gerakan shalat yang benar.",
        durationMinutes: 55,
        pages: 160,
        level: "Dasar",
        pdfUrl: "/pdf/fiqih-shalat.pdf",
      },
      {
        slug: "fiqih-puasa",
        title: "Puasa Ramadhan dan Sunnah",
        summary: "Ketentuan puasa, niat, dan amalan sunnah.",
        durationMinutes: 60,
        pages: 180,
        level: "Menengah",
        pdfUrl: "/pdf/fiqih-puasa.pdf",
      },
    ],
  },
  {
    key: "aqidah",
    label: "Aqidah Akhlak",
    description:
      "Alur belajar terpadu untuk memahami pilar keimanan secara mendalam.",
    modules: [
      {
        slug: "aqidah-iman-islam-ihsan",
        title: "Memahami Konsep Iman, Islam, dan Ihsan",
        summary: "Landasan iman sebagai pilar utama seorang muslim.",
        durationMinutes: 45,
        pages: 200,
        level: "Dasar",
        pdfUrl: "/pdf/aqidah-iman-islam-ihsan.pdf",
      },
      {
        slug: "aqidah-akhlak-terpuji",
        title: "Akhlak Terpuji: Sabar, Ikhtiar, dan Tawakal",
        summary: "Latihan karakter lewat akhlak mulia.",
        durationMinutes: 50,
        pages: 140,
        level: "Dasar",
        pdfUrl: "/pdf/akidah-1.pdf",
      },
      {
        slug: "aqidah-asmaul-husna",
        title: "Mengenal Sifat Allah (Asmaul Husna)",
        summary: "Memahami kebesaran Allah lewat nama-nama-Nya.",
        durationMinutes: 60,
        pages: 190,
        level: "Menengah",
        pdfUrl: "/pdf/aqidah-asmaul-husna.pdf",
      },
    ],
  },
  {
    key: "pai",
    label: "Pendidikan Agama Islam",
    description:
      "Pembelajaran terpadu untuk memahami dasar-dasar agama Islam.",
    modules: [
      {
        slug: "pai-sejarah-nabi",
        title: "Sejarah Nabi dan Rasul",
        summary: "Kisah teladan dan pelajaran dari para nabi.",
        durationMinutes: 35,
        pages: 95,
        level: "Dasar",
        pdfUrl: "/pdf/pai-sejarah-nabi.pdf",
      },
      {
        slug: "pai-ibadah-harian",
        title: "Ibadah Harian",
        summary: "Adab dan praktik ibadah dalam keseharian.",
        durationMinutes: 50,
        pages: 130,
        level: "Dasar",
        pdfUrl: "/pdf/pai-ibadah-harian.pdf",
      },
      {
        slug: "pai-akhlak-sosial",
        title: "Akhlak Sosial",
        summary: "Etika pergaulan dan akhlak di lingkungan sekolah.",
        durationMinutes: 55,
        pages: 150,
        level: "Menengah",
        pdfUrl: "/pdf/pai-akhlak-sosial.pdf",
      },
    ],
  },
  {
    key: "arab",
    label: "Bahasa Arab",
    description:
      "Penguatan bahasa Arab untuk memahami teks-teks islami.",
    modules: [
      {
        slug: "arab-huruf-dasar",
        title: "Pengenalan Huruf Dasar",
        summary: "Latihan mengenal huruf dan harakat.",
        durationMinutes: 30,
        pages: 80,
        level: "Dasar",
        pdfUrl: "/pdf/arab-huruf-dasar.pdf",
      },
      {
        slug: "arab-kosakata-harian",
        title: "Kosakata Harian",
        summary: "Kumpulan kata umum dalam kehidupan sehari-hari.",
        durationMinutes: 45,
        pages: 110,
        level: "Dasar",
        pdfUrl: "/pdf/arab-kosakata-harian.pdf",
      },
      {
        slug: "arab-tata-bahasa",
        title: "Tata Bahasa Sederhana",
        summary: "Dasar nahwu dan sharaf pemula.",
        durationMinutes: 60,
        pages: 170,
        level: "Menengah",
        pdfUrl: "/pdf/arab-tata-bahasa.pdf",
      },
    ],
  },
];
