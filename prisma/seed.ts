import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Demo1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@stockscope.ai" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@stockscope.ai",
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@stockscope.ai" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@stockscope.ai",
      passwordHash,
      role: "USER",
      emailVerified: true,
    },
  });

  console.log("Seeded users:", { admin: admin.email, demoUser: demoUser.email });
  console.log("Password for both: Demo1234");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
