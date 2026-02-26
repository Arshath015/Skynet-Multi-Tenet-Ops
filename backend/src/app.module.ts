import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LessonsModule } from './lessons/lessons.module';
import { BookingsModule } from './bookings/bookings.module';
import { AvailabilityModule } from './availability/availability.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, LessonsModule, BookingsModule, AvailabilityModule, CoursesModule],
  controllers: [AppController],   // 👈 THIS MUST BE HERE
})
export class AppModule {}