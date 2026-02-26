import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(title: string, user: any) {
    if (user.role !== 'ADMIN' && user.role !== 'INSTRUCTOR') {
      throw new ForbiddenException('Not allowed');
    }

    return this.prisma.course.create({
      data: {
        title,
        tenantId: user.tenantId,
      },
    });
  }

  async findAll(
    page: number,
    limit: number,
    search: string,
    user: any,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId: user.tenantId,
    };

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}