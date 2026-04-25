import { PrismaClient } from '@prisma/client';
// Note: If using Prisma 7, follow your adapter setup here or use a simple CLI script
const prisma = new PrismaClient(); 

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
    },
  });

  await prisma.skill.createMany({
    data: [
      { name: 'TypeScript' },
      { name: 'Prisma' },
      { name: 'GraphQL' },
    ],
  });

  console.log('Seed data created!');
}

main().finally(() => prisma.$disconnect());