const { PrismaClient } = require("@prisma/client");

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
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
