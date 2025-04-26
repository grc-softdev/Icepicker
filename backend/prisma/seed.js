const { PrismaClient } = require('@prisma/client');
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const rawData = fs.readFileSync('prisma/seedData/questions.json', 'utf-8');
  const questions = JSON.parse(rawData);

  for (const question of questions) {
    const exists = await prisma.question.findFirst({
      where: { name: question.name },
    });
  
    if (!exists) {
      await prisma.question.create({
        data: {
          ...question,
          isTemplate: true,
        },
      });
    }
  }

  
  const questionsWithoutSessions = await prisma.question.findMany({
    where: {
      isTemplate: false,
      sessions: {
        none: {},
      },
    },
  });

  for (const question of questionsWithoutSessions) {
    await prisma.question.update({
      where: { id: question.id },
      data: { isTemplate: true },
    });
  }

  console.log("Questions successfully created and updated (only ones without sessions)!");
}

main()
  .catch((e) => {
    console.error("Error to execute seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
