import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoursesService } from './courses.service';

@UseGuards(AuthGuard('jwt'))
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() body: { title: string }, @Request() req) {
    return this.coursesService.create(body.title, req.user);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search = '',
    @Request() req,
  ) {
    return this.coursesService.findAll(
      Number(page),
      Number(limit),
      search,
      req.user,
    );
  }
}