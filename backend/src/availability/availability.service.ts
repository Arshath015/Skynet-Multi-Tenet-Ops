import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async createAvailability(
    body: { startTime: string; endTime: string },
    user: any,
  ) {
    if (user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Only instructors can set availability');
    }

    const start = new Date(body.startTime);
    const end = new Date(body.endTime);

    if (start >= end) {
      throw new BadRequestException('Invalid time range');
    }

    // 🔥 Overlap detection
    const conflict = await this.prisma.instructorAvailability.findFirst({
      where: {
        instructorId: user.userId,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflict) {
      throw new BadRequestException('Availability slot overlaps existing slot');
    }

    if (start >= end) {
      throw new BadRequestException('Invalid time range');
    }
    
    return this.prisma.instructorAvailability.create({
      data: {
        tenantId: user.tenantId,
        instructorId: user.userId,
        startTime: start,
        endTime: end,
      },
    });
  }
}