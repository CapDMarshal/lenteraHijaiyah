const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Huruf Dasar",
    description: "Pengenalan huruf Hijaiyah dasar dan bentuk-bentuknya.",
  },
  {
    name: "Tajwid Dasar",
    description: "Konsep tajwid dasar untuk membaca dengan benar.",
  },
  {
    name: "Makharijul Huruf",
    description: "Tempat keluarnya huruf dan cara pengucapannya.",
  },
  {
    name: "Sifat Huruf",
    description: "Sifat-sifat huruf Hijaiyah dan penerapannya.",
  },
  {
    name: "Hukum Nun Sukun",
    description: "Hukum bacaan nun sukun dan tanwin.",
  },
  {
    name: "Hukum Mim Sukun",
    description: "Hukum bacaan mim sukun.",
  },
  {
    name: "Mad dan Panjang Bacaan",
    description: "Jenis-jenis mad dan aturan panjang bacaan.",
  },
  {
    name: "Ghunnah",
    description: "Aturan dengung dan penerapannya dalam bacaan.",
  },
  {
    name: "Waqaf dan Ibtida",
    description: "Aturan berhenti dan memulai bacaan.",
  },
  {
    name: "Latihan Bacaan",
    description: "Latihan membaca dengan materi terstruktur.",
  },
];

async function main() {
  for (const category of categories) {
    const existing = await prisma.moduleCategory.findFirst({
      where: { name: category.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.moduleCategory.update({
        where: { id: existing.id },
        data: { description: category.description },
      });
    } else {
      await prisma.moduleCategory.create({
        data: category,
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("SEED_ERROR", error);
    await prisma.$disconnect();
    process.exit(1);
  });
