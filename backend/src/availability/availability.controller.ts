import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AvailabilityService } from './availability.service';

@UseGuards(AuthGuard('jwt'))
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  createAvailability(
    @Body() body: { startTime: string; endTime: string },
    @Request() req,
  ) {
    return this.availabilityService.createAvailability(body, req.user);
  }
}