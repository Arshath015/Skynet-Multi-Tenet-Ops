import { Controller, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post(':lessonId/attempt')
  attemptQuiz(
    @Param('lessonId') lessonId: string,
    @Body() body: { answers: { questionId: string; answer: string }[] },
    @Request() req,
  ) {
    return this.lessonsService.attemptQuiz(
      lessonId,
      req.user,
      body.answers,
    );
  }
}