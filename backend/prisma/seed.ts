import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  // Delete in correct order (children first)
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.instructorAvailability.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const tenant = await prisma.tenant.create({
    data: { name: "Flight School A" },
  });

  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "admin@schoola.com",
        passwordHash,
        role: Role.ADMIN,
        tenantId: tenant.id,
        approved: true,
      },
      {
        email: "instructor@schoola.com",
        passwordHash,
        role: Role.INSTRUCTOR,
        tenantId: tenant.id,
        approved: true,
      },
      {
        email: "student@schoola.com",
        passwordHash,
        role: Role.STUDENT,
        tenantId: tenant.id,
        approved: true,
      },
    ],
  });

  console.log("Seed completed successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());