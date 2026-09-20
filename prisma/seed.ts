import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES: Record<string, string[]> = {
  'School Books': ['Class 1-5', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'CBSE', 'ICSE', 'State Board'],
  'College & University': ['Engineering', 'Medical', 'Computer Science', 'Data Science'],
  'Competitive Exams': ['Entrance Exams'],
  Fiction: ['Novels', 'Romance', 'Thriller', 'Mystery'],
  'Non-fiction': ['Biography', 'History', 'Science', 'Self-help'],
  "Children's Books": [],
  Other: [],
};

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding. Refusing to create an admin with no password.'
    );
  }
  if (adminPassword.length < 12) {
    throw new Error('ADMIN_PASSWORD should be at least 12 characters for a production deployment.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: 'ADMIN' },
    create: {
      email: adminEmail,
      fullName: 'BookNest Admin',
      mobile: '9999999999',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin account ready: ${adminEmail}`);

  for (const [categoryName, subs] of Object.entries(CATEGORIES)) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: {},
      create: { name: categoryName, slug: slugify(categoryName) },
    });

    for (const sub of subs) {
      await prisma.subcategory.upsert({
        where: { categoryId_slug: { categoryId: category.id, slug: slugify(sub) } },
        update: {},
        create: { name: sub, slug: slugify(sub), categoryId: category.id },
      });
    }
  }
  console.log('Categories seeded.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
