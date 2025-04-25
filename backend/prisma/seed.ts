import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const rawData = fs.readFileSync('prisma/questions.json', 'utf-8');
  const questions = JSON.parse(rawData);

  for (const question of questions) {
    const exists = await prisma.question.findFirst({
      where: { name: question.name },
    });
  
    if (!exists) {
      await prisma.question.create({
        data: question,
      });
    }
  }

  console.log("Questions successfully created !");
}

main()
  .catch((e) => {
    console.error("Error to execute seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
