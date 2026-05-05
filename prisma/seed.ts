import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Category definitions ─────────────────────────────────────────────────────

const categories = [
  {
    key: "aqidah",
    name: "Aqidah Akhlak",
    description:
      "Pembelajaran tentang pokok-pokok keimanan dan pembentukan akhlak mulia bagi pelajar muslim.",
  },
  {
    key: "bahasa-arab",
    name: "Bahasa Arab",
    description:
      "Penguatan kemampuan membaca, menulis, dan memahami teks berbahasa Arab sebagai bahasa Al-Qur'an.",
  },
  {
    key: "fiqih",
    name: "Fiqih",
    description:
      "Panduan hukum Islam praktis mencakup ibadah sehari-hari, thaharah, shalat, puasa, dan muamalah.",
  },
  {
    key: "pai",
    name: "Pendidikan Agama Islam",
    description:
      "Pembelajaran terpadu nilai-nilai Islam yang mencakup keimanan, ibadah, akhlak, dan kehidupan bermasyarakat.",
  },
  {
    key: "ski",
    name: "Sejarah Kebudayaan Islam",
    description:
      "Perjalanan sejarah peradaban Islam dari masa Nabi Muhammad SAW hingga perkembangannya di Nusantara.",
  },
] as const;

// ─── Module definitions (keyed by category key) ───────────────────────────────

const modulesByCategoryKey: Record<
  string,
  { slug: string; title: string; content: string; pdfKey: string }[]
> = {
  aqidah: [
    {
      slug: "akidah-akhlak-kelas-7",
      title: "Akidah Akhlak MTs Kelas VII",
      content:
        "Pengenalan dasar-dasar akidah Islam dan pembentukan akhlak terpuji untuk siswa kelas VII Madrasah Tsanawiyah.",
      pdfKey: "pdf/modul/aqidah akhlak/AKIDAH AKHLAK MTS KELAS VII.pdf",
    },
  ],
  "bahasa-arab": [
    {
      slug: "bahasa-arab-kelas-7",
      title: "Bahasa Arab Kelas VII",
      content:
        "Pengenalan kosakata dan struktur kalimat dasar bahasa Arab untuk siswa kelas VII.",
      pdfKey: "pdf/modul/bahasa arab/BAHASA ARAB KELAS VII.pdf",
    },
    {
      slug: "bahasa-arab-kelas-8",
      title: "Bahasa Arab Kelas VIII",
      content:
        "Pengembangan kemampuan membaca dan memahami teks bahasa Arab tingkat menengah untuk siswa kelas VIII.",
      pdfKey: "pdf/modul/bahasa arab/BAHASA ARAB KELAS VIII.pdf",
    },
    {
      slug: "bahasa-arab-kelas-9",
      title: "Bahasa Arab Kelas IX",
      content:
        "Pendalaman bahasa Arab dan latihan percakapan serta pemahaman teks untuk siswa kelas IX.",
      pdfKey: "pdf/modul/bahasa arab/BAHASA ARAB KELAS IX.pdf",
    },
  ],
  fiqih: [
    {
      slug: "fikih-kelas-8",
      title: "Fikih Kelas VIII",
      content:
        "Pembahasan hukum-hukum fiqih tingkat lanjut mencakup ibadah, muamalah, dan akhlak untuk siswa kelas VIII.",
      pdfKey: "pdf/modul/fiqih/FIKIH KELAS VIII.pdf",
    },
  ],
  pai: [
    {
      slug: "pai-kelas-8",
      title: "Pendidikan Agama Islam Kelas VIII",
      content:
        "Materi PAI kelas VIII meliputi perkembangan Islam, akhlak islami, dan tata cara ibadah yang benar.",
      pdfKey: "pdf/modul/pendidikan agama islam/PAI KELAS VIII.pdf",
    },
  ],
  ski: [
    {
      slug: "ski-kelas-8",
      title: "Sejarah Kebudayaan Islam Kelas VIII",
      content:
        "Kajian sejarah dan kebudayaan Islam kelas VIII meliputi dinasti-dinasti Islam dan penyebaran Islam di dunia.",
      pdfKey:
        "pdf/modul/sejarah kebudayaan islam/SEJARAH KEBUDAYAAN ISLAM KELAS VIII.pdf",
    },
  ],
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱  Starting seed...");

  for (const cat of categories) {
    const existing = await prisma.moduleCategory.findFirst({
      where: { name: cat.name },
    });

    const category =
      existing ??
      (await prisma.moduleCategory.create({
        data: { name: cat.name, description: cat.description },
      }));

    console.log(`  ✔ Category: ${category.name} (${category.id})`);

    const modules = modulesByCategoryKey[cat.key] ?? [];

    for (const mod of modules) {
      const module = await prisma.module.upsert({
        where: { slug: mod.slug },
        update: {
          title: mod.title,
          content: mod.content,
          pdfKey: mod.pdfKey,
          categoryId: category.id,
        },
        create: {
          slug: mod.slug,
          title: mod.title,
          content: mod.content,
          pdfKey: mod.pdfKey,
          categoryId: category.id,
        },
      });

      console.log(`      ✔ Module: ${module.title} (${module.slug})`);
    }
  }

  console.log("\n✅  Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
