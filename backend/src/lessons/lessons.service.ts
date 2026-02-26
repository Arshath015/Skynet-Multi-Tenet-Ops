import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async attemptQuiz(
    lessonId: string,
    user: any,
    answers: { questionId: string; answer: string }[],
  ) {

    console.log("ANSWERS RECEIVED:", answers);

    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can attempt quizzes');
    }

    const questions = await this.prisma.question.findMany({
      where: { lessonId },
    });

    if (!questions.length) {
      throw new BadRequestException('No questions found');
    }

    let correct = 0;
    const incorrectQuestions: {
      questionId: string;
      correctAnswer: string;
      yourAnswer: string | null;
    }[] = [];

    for (const question of questions) {
      const submitted = answers.find(a => a.questionId === question.id);

      if (submitted && submitted.answer === question.correct) {
        correct++;
      } else {
        incorrectQuestions.push({
          questionId: question.id,
          correctAnswer: question.correct,
          yourAnswer: submitted?.answer ?? null,
        });
      }
    }

    const score = Math.round((correct / questions.length) * 100);

    await this.prisma.quizAttempt.create({
      data: {
        lesson: {
          connect: { id: lessonId },
        },
        studentId: user.userId,
        score,
        answers: answers.reduce((acc, curr) => {
          acc[curr.questionId] = curr.answer;
          return acc;
        }, {} as Record<string, string>),
      },
    });

    return {
      score,
      correct,
      total: questions.length,
      incorrectQuestions,
    };
  }
}