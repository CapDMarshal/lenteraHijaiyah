export type ModuleItem = {
  slug: string;
  title: string;
  summary: string;
  pdfUrl: string;
};

export type ModuleCategory = {
  key: "aqidah" | "bahasa-arab" | "fiqih" | "pai" | "ski";
  label: string;
  description: string;
  modules: ModuleItem[];
};

export const moduleCategories: ModuleCategory[] = [
  {
    key: "aqidah",
    label: "Aqidah Akhlak",
    description:
      "Pembelajaran tentang pokok-pokok keimanan dan pembentukan akhlak mulia bagi pelajar muslim.",
    modules: [
      {
        slug: "akidah-akhlak-kelas-7",
        title: "Akidah Akhlak MTs Kelas VII",
        summary:
          "Pengenalan dasar-dasar akidah Islam dan pembentukan akhlak terpuji untuk siswa kelas VII Madrasah Tsanawiyah.",
        pdfUrl: "/pdf/modul/aqidah akhlak/AKIDAH AKHLAK MTS KELAS VII.pdf",
      },
    ],
  },
  {
    key: "bahasa-arab",
    label: "Bahasa Arab",
    description:
      "Penguatan kemampuan membaca, menulis, dan memahami teks berbahasa Arab sebagai bahasa Al-Qur'an.",
    modules: [
      {
        slug: "bahasa-arab-kelas-7",
        title: "Bahasa Arab Kelas VII",
        summary:
          "Pengenalan kosakata dan struktur kalimat dasar bahasa Arab untuk siswa kelas VII.",
        pdfUrl: "/pdf/modul/bahasa arab/BAHASA ARAB KELAS VII.pdf",
      },
      {
        slug: "bahasa-arab-kelas-8",
        title: "Bahasa Arab Kelas VIII",
        summary:
          "Pengembangan kemampuan membaca dan memahami teks bahasa Arab tingkat menengah untuk siswa kelas VIII.",
        pdfUrl: "/pdf/modul/bahasa arab/BAHASA ARAB KELAS VIII.pdf",
      },
      {
        slug: "bahasa-arab-kelas-9",
        title: "Bahasa Arab Kelas IX",
        summary:
          "Pendalaman bahasa Arab dan latihan percakapan serta pemahaman teks untuk siswa kelas IX.",
        pdfUrl: "/pdf/modul/bahasa arab/BAHASA ARAB KELAS IX.pdf",
      },
    ],
  },
  {
    key: "fiqih",
    label: "Fiqih",
    description:
      "Panduan hukum Islam praktis mencakup ibadah sehari-hari, thaharah, shalat, puasa, dan muamalah.",
    modules: [
      {
        slug: "fikih-kelas-8",
        title: "Fikih Kelas VIII",
        summary:
          "Pembahasan hukum-hukum fiqih tingkat lanjut mencakup ibadah, muamalah, dan akhlak untuk siswa kelas VIII.",
        pdfUrl: "/pdf/modul/fiqih/FIKIH KELAS VIII.pdf",
      },
    ],
  },
  {
    key: "pai",
    label: "Pendidikan Agama Islam",
    description:
      "Pembelajaran terpadu nilai-nilai Islam yang mencakup keimanan, ibadah, akhlak, dan kehidupan bermasyarakat.",
    modules: [
      {
        slug: "pai-kelas-8",
        title: "Pendidikan Agama Islam Kelas VIII",
        summary:
          "Materi PAI kelas VIII meliputi perkembangan Islam, akhlak islami, dan tata cara ibadah yang benar.",
        pdfUrl: "/pdf/modul/pendidikan agama islam/PAI KELAS VIII.pdf",
      },
    ],
  },
  {
    key: "ski",
    label: "Sejarah Kebudayaan Islam",
    description:
      "Perjalanan sejarah peradaban Islam dari masa Nabi Muhammad SAW hingga perkembangannya di Nusantara.",
    modules: [
      {
        slug: "ski-kelas-8",
        title: "Sejarah Kebudayaan Islam Kelas VIII",
        summary:
          "Kajian sejarah dan kebudayaan Islam kelas VIII meliputi dinasti-dinasti Islam dan penyebaran Islam di dunia.",
        pdfUrl: "/pdf/modul/sejarah kebudayaan islam/SEJARAH KEBUDAYAAN ISLAM KELAS VIII.pdf",
      },
    ],
  },
];
