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

const prisma = new PrismaClient();

const users = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "student.demo@lentera.dev",
    password: "$2b$10$slj6t3GIbxL052JB1cLHq.xNhyZ4ufqmSfBXObx1BFyqE7rpPKDZO",
    name: "Demo Student",
    role: "USER"
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "guru.demo@lentera.dev",
    password: "$2b$10$HLGPGdqi0ewxh7Fjl9sWluM7XC5a7vHdpzzMlfml6BVchC9aC.ONy",
    name: "Demo Guru",
    role: "USER"
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "admin.demo@lentera.dev",
    password: "$2b$10$zzqkWnqXv.wyuxCP3D6iTu3bQPjq67kOR5lStKkN63fXOee3Ta3Oi",
    name: "Demo Admin",
    role: "ADMIN"
  }
];

async function main() {
  const now = new Date();

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: user.password,
        name: user.name,
        role: user.role,
        updatedAt: now
      },
      create: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        createdAt: now,
        updatedAt: now
      }
    });
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
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
