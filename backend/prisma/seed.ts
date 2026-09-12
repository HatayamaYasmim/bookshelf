import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const genres = [
  'Adventure',
  'Biography',
  'Dystopian',
  'Fantasy',
  'Science Fiction',
  'Historical Fiction',
  'Mystery',
  'Non-fiction',
  'Romance',
  'Thriller',
  'Horror',
];

async function main() {
  for (const name of genres) {
    await prisma.genre.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }

  console.log('Genres seeded successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });