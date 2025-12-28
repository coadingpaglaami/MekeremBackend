import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { TravellerService } from './traveller.service.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/decorators/role.decorator.js';
import type { Request } from 'express';
import { RolesGuard } from '../roles/guard/roles.guard.js';
import { CarrierProfile } from 'src/database/prisma-client/client.js';

@Controller('traveller')
export class TravellerController {

  constructor(private readonly travellerService: TravellerService) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('info')
  @Roles(['TRAVELLER'])
  async getTravellerInfo(@Body() carrierProfile: Partial<CarrierProfile>,@Req() req:Request):Promise<CarrierProfile>  {
    return await this.travellerService.getTravellerInfo(carrierProfile,req);

  }
}
