const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create classes for JEE
  await prisma.class.createMany({
    data: [
      {
        name: '11th JEE',
        description: 'Class 11th for JEE preparation',
      },
      {
        name: '12th JEE',
        description: 'Class 12th for JEE preparation',
      },
      {
        name: '11th NEET',
        description: 'Class 11th for NEET preparation',
      },
      {
        name: '12th NEET',
        description: 'Class 12th for NEET preparation',
      },
      {
        name: 'Class 9th',
        description: 'Regular Class 9th',
      },
      {
        name: 'Class 10th',
        description: 'Regular Class 10th',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 