import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/guard/roles.guard.js';
import { Roles } from '../roles/decorators/role.decorator.js';
import type { GetAvailableTripsQueryDto, TripResponseDto } from './dto/services.dto.js';
import type { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('trips')
  @UseGuards(RolesGuard)
  @Roles(['SENDER'])
  async getAvailableTrips(@Query() query: GetAvailableTripsQueryDto,@Req() req:Request):Promise<TripResponseDto> {
    return await this.servicesService.getAvailableTrips(query,req);
  }
}
