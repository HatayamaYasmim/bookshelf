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

const demoBooks = [
  {
    title: '1984',
    author: 'George Orwell',
    status: 'READ' as const,
    genres: [
      'Dystopian',
      'Science Fiction',
    ],
    history: [
      '2026-01-18T18:00:00.000Z',
    ],
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    status: 'READ' as const,
    genres: [
      'Fantasy',
      'Adventure',
    ],
    history: [
      '2026-02-21T18:00:00.000Z',
      '2026-08-10T18:00:00.000Z',
    ],
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    status: 'READ' as const,
    genres: [
      'Science Fiction',
      'Adventure',
    ],
    history: [
      '2026-03-16T18:00:00.000Z',
    ],
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    status: 'READ' as const,
    genres: [
      'Romance',
    ],
    history: [
      '2026-05-09T18:00:00.000Z',
    ],
  },
  {
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    status: 'READ' as const,
    genres: [
      'Mystery',
    ],
    history: [
      '2026-06-14T18:00:00.000Z',
    ],
  },
  {
    title: 'The Shining',
    author: 'Stephen King',
    status: 'READ' as const,
    genres: [
      'Horror',
      'Thriller',
    ],
    history: [
      '2026-07-22T18:00:00.000Z',
    ],
  },
  {
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    status: 'READING' as const,
    genres: [
      'Fantasy',
      'Adventure',
    ],
    history: [],
  },
  {
    title: 'The Martian',
    author: 'Andy Weir',
    status: 'UNREAD' as const,
    genres: [
      'Science Fiction',
      'Adventure',
    ],
    history: [],
  },
];

async function seedGenres() {
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

async function getOrCreateAuthor(
  name: string,
) {
  const existingAuthor =
    await prisma.author.findFirst({
      where: {
        name,
      },
    });

  if (existingAuthor) {
    return existingAuthor;
  }

  return prisma.author.create({
    data: {
      name,
    },
  });
}

async function seedUserLibrary() {
  const email =
    process.env.SEED_USER_EMAIL
      ?.trim()
      .toLowerCase();

  if (!email) {
    console.log(
      'SEED_USER_EMAIL not configured. Skipping demo library.',
    );

    return;
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (!user) {
    console.log(
      `Seed user not found: ${email}`,
    );

    return;
  }

  for (const bookData of demoBooks) {
    const author =
      await getOrCreateAuthor(
        bookData.author,
      );

    let book =
      await prisma.book.findFirst({
        where: {
          userId: user.id,
          title: bookData.title,
        },
      });

    if (book) {
      book = await prisma.book.update({
        where: {
          id: book.id,
        },
        data: {
          status:
            bookData.status,
          authorId:
            author.id,
          genres: {
            set:
              bookData.genres.map(
                (name) => ({
                  name,
                }),
              ),
          },
        },
      });
    } else {
      book =
        await prisma.book.create({
          data: {
            title:
              bookData.title,
            status:
              bookData.status,
            userId:
              user.id,
            authorId:
              author.id,
            genres: {
              connect:
                bookData.genres.map(
                  (name) => ({
                    name,
                  }),
                ),
            },
          },
        });
    }

    for (
      const completedAt
      of bookData.history
    ) {
      const completedDate =
        new Date(completedAt);

      const existingHistory =
        await prisma.readingHistory
          .findFirst({
            where: {
              bookId: book.id,
              completedAt:
                completedDate,
            },
          });

      if (!existingHistory) {
        await prisma.readingHistory
          .create({
            data: {
              bookId: book.id,
              completedAt:
                completedDate,
            },
          });
      }
    }
  }

  console.log(
    `Demo library seeded for ${email}.`,
  );
}

async function main() {
  await seedGenres();
  await seedUserLibrary();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });