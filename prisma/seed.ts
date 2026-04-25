import { PrismaClient, Role } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

function resolveDatabasePath() {
  return process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
}

async function main() {
  const adapter = new PrismaBetterSqlite3({ url: resolveDatabasePath() });
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.cvSkill.deleteMany();
    await prisma.cv.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: Role.USER,
      } as any,
    });

    const typeScript = await prisma.skill.create({
      data: {
        designation: 'TypeScript',
      } as any,
    });

    const graphQl = await prisma.skill.create({
      data: {
        designation: 'GraphQL',
      } as any,
    });

    await prisma.cv.create({
      data: {
        job: 'Developer',
        title: 'Backend Developer',
        age: 28,
        userId: user.id,
        skills: {
          create: [
            { skillId: typeScript.id },
            { skillId: graphQl.id },
          ],
        },
      } as any,
    });

    console.log('Seed completed successfully.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});