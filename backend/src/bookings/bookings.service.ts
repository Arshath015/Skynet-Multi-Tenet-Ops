import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(
    body: { startTime: string; endTime: string },
    user: any,
  ) {

    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('Only students can book sessions');
    }

    const start = new Date(body.startTime);
    const end = new Date(body.endTime);

    if (start >= end) {
      throw new BadRequestException('Invalid time range');
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        tenantId: user.tenantId,
        startTime: { lt: end },
        endTime: { gt: start },
        status: { in: ['REQUESTED', 'APPROVED'] },
      },
    });

    if (conflict) {
      throw new BadRequestException('Time slot already booked');
    }

    return this.prisma.booking.create({
      data: {
        tenantId: user.tenantId,
        studentId: user.userId,
        startTime: start,
        endTime: end,
        status: 'REQUESTED',
      },
    });
  }

  async approveBooking(id: string, user: any) {

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin can approve bookings');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking || booking.tenantId !== user.tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async assignInstructor(id: string, instructorId: string, user: any) {

    if (user.role !== 'ADMIN') {
        throw new ForbiddenException('Only admin can assign instructor');
    }

    const booking = await this.prisma.booking.findUnique({
        where: { id },
    });

    if (!booking || booking.tenantId !== user.tenantId) {
        throw new ForbiddenException('Access denied');
    }

    // Check instructor availability
    const available = await this.prisma.instructorAvailability.findFirst({
        where: {
        instructorId,
        tenantId: user.tenantId,
        startTime: { lte: booking.startTime },
        endTime: { gte: booking.endTime },
        },
    });

    if (!available) {
        throw new BadRequestException('Instructor not available');
    }

    // Check instructor conflict
    const conflict = await this.prisma.booking.findFirst({
        where: {
        instructorId,
        status: { in: ['APPROVED'] },
        startTime: { lt: booking.endTime },
        endTime: { gt: booking.startTime },
        },
    });

    if (conflict) {
        throw new BadRequestException('Instructor already booked');
    }

    return this.prisma.booking.update({
        where: { id },
        data: {
        instructorId,
        status: 'APPROVED',
        },
    });
  }
}