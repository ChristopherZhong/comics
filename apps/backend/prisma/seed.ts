import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required.');
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('Seeding database with updated schema...');

  // Clear existing data
  await prisma.readingEventLog.deleteMany({});
  await prisma.readingProgress.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.comic.deleteMany({});
  await prisma.scanlationGroup.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.role.deleteMany({});

  // 1. Roles
  const adminRole = await prisma.role.create({
    data: { name: 'ADMIN' },
  });

  const userRole = await prisma.role.create({
    data: { name: 'USER' },
  });

  console.log('Roles created:', { adminRole, userRole });

  // 2. Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@comics.com',
      password: adminPassword,
      roles: {
        connect: [{ id: adminRole.id }, { id: userRole.id }],
      },
    },
    include: { roles: true },
  });

  const normalUser = await prisma.user.create({
    data: {
      email: 'user@comics.com',
      password: userPassword,
      roles: {
        connect: [{ id: userRole.id }],
      },
    },
    include: { roles: true },
  });

  console.log('Users created:', { adminUser, normalUser });

  // 3. Scanlation Groups
  const group1 = await prisma.scanlationGroup.create({
    data: {
      name: 'Asura Scans',
      website: 'https://asuracomic.net',
    },
  });

  const group2 = await prisma.scanlationGroup.create({
    data: {
      name: 'Flame Scans',
      website: 'https://flamescans.org',
    },
  });

  // 4. Comics & Chapters
  const comic1 = await prisma.comic.create({
    data: {
      title: 'The Amazing Spiderman',
      description: 'The spectacular adventures of Peter Parker, web-slinging hero.',
      publisher: 'Marvel Comics',
      coverUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop',
      writer: 'Stan Lee',
      artist: 'Steve Ditko',
      language: 'English',
      status: 'ONGOING',
      type: 'COMIC',
      scanlationGroups: {
        connect: [{ id: group1.id }],
      },
      chapters: {
        create: [
          { title: 'Spider-Man!', chapterNumber: 1, pagesCount: 24 },
          { title: 'The Duel to the Death with the Vulture!', chapterNumber: 2, pagesCount: 22 },
          { title: 'Spider-Man Versus Doctor Octopus', chapterNumber: 3, pagesCount: 25 },
        ],
      },
    },
  });

  const comic2 = await prisma.comic.create({
    data: {
      title: 'Solo Leveling',
      description: 'In a world where hunters must battle deadly monsters, weak hunter Sung Jinwoo is chosen by a mysterious system.',
      publisher: 'D&C Media',
      coverUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=500&auto=format&fit=crop',
      writer: 'Chugong',
      artist: 'DUBU',
      language: 'Korean',
      status: 'COMPLETED',
      type: 'MANHWA',
      scanlationGroups: {
        connect: [{ id: group1.id }, { id: group2.id }],
      },
      chapters: {
        create: [
          { title: 'Chapter 1: The E-Rank Hunter', chapterNumber: 1, pagesCount: 28 },
          { title: 'Chapter 2: Double Dungeon', chapterNumber: 2, pagesCount: 26 },
        ],
      },
    },
  });

  console.log('Comics & Chapters seeded successfully:', { comic1, comic2 });

  await prisma.$disconnect();
  await pool.end();
}

main()
  .then(() => {
    console.log('Seeding finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  });
