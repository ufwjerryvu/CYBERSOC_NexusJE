import 'dotenv/config';
// prisma/seed.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'adminuser',
      isAdmin: true,
    },
  });

  // Create Regular User
  const regular = await prisma.user.create({
    data: {
      email: 'user@example.com',
      username: 'regularuser',
      isAdmin: false,
    },
  });

  console.log({ admin, regular });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
