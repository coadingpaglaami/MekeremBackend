import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TravellerService } from './traveller.service.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/decorators/role.decorator.js';
import type { Request } from 'express';
import { RolesGuard } from '../roles/guard/roles.guard.js';
import { CarrierProfile } from 'src/database/prisma-client/client.js';
import { TravellerVerifyGuard } from '../roles/guard/verify.guard.js';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../upload/multer.confit.js';

@Controller('traveller')
export class TravellerController {
  constructor(private readonly travellerService: TravellerService) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('info')
  @Roles(['TRAVELLER'])
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'nidFrontImage', maxCount: 1 },
        { name: 'nidBackImage', maxCount: 1 },
        { name: 'passportImage', maxCount: 1 },
        { name: 'drivingLicenseFront', maxCount: 1 },
        { name: 'drivingLicenseBack', maxCount: 1 },
        { name: 'selfies', maxCount: 5 },
      ],
      multerConfig,
    ),
  )
  async getTravellerInfo(
    @Body() carrierProfile: Partial<CarrierProfile>,
    @Req() req: Request,
    @UploadedFiles()
    files:{
        nidFrontImage?: Express.Multer.File[];
    nidBackImage?: Express.Multer.File[];
    passportImage?: Express.Multer.File[];
    drivingLicenseFront?: Express.Multer.File[];
    drivingLicenseBack?: Express.Multer.File[];
    selfies?: Express.Multer.File[];
    }
  ): Promise<CarrierProfile> {
    return await this.travellerService.getTravellerInfo(carrierProfile, req, files);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, TravellerVerifyGuard)
  @Post('trip-create')
  async createTrip(
    @Req() req: Request,
    @Body() tripDetails: any,
  ): Promise<any> {
    return await this.travellerService.createTrip(req, tripDetails);
  }
}
