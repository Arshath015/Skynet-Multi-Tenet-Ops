import { Controller, Post, Body, UseGuards, Request, Patch, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';

@UseGuards(AuthGuard('jwt'))
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {} 

  @Post()
  createBooking(
    @Body() body: { startTime: string; endTime: string },
    @Request() req,
  ) {
    return this.bookingsService.createBooking(body, req.user);
  }

  @Patch(':id/approve')
  approveBooking(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.bookingsService.approveBooking(id, req.user);
  }

  @Patch(':id/assign')
  assignInstructor(
    @Param('id') id: string,
    @Body() body: { instructorId: string },
    @Request() req,
  ) {
    return this.bookingsService.assignInstructor(id, body.instructorId, req.user);
  }
}