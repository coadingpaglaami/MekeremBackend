import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import {
  CarrierProfile,
  Role,
} from '../database/prisma-client/client.js';
import { TravellerVerifyGuard } from '../roles/guard/verify.guard.js';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../upload/multer.confit.js';
import {
  Meta,
  type CreateTripDto,
  type SendRequestResponseDto,
  type TripResponseDto,
} from './dto/create-trip.dto.js';

const traveller = Role.TRAVELLER;
@Controller('traveller')
export class TravellerController {
  constructor(private readonly travellerService: TravellerService) {}
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('info')
  @Roles([traveller])
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
    files: {
      nidFrontImage?: Express.Multer.File[];
      nidBackImage?: Express.Multer.File[];
      passportImage?: Express.Multer.File[];
      drivingLicenseFront?: Express.Multer.File[];
      drivingLicenseBack?: Express.Multer.File[];
      selfies?: Express.Multer.File[];
    },
  ): Promise<CarrierProfile> {
    return await this.travellerService.getTravellerInfo(
      carrierProfile,
      req,
      files,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, TravellerVerifyGuard)
  @Post('trip-create')
  @Roles([traveller])
  async createTrip(
    @Req() req: Request,
    @Body() createTripDto: CreateTripDto,
  ): Promise<TripResponseDto> {
    return await this.travellerService.createTrip(req, createTripDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard, TravellerVerifyGuard)
  @Roles([traveller])
  @Get('trips')
  async travellerTrips(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return await this.travellerService.travellerTrips(req, page, limit);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard, TravellerVerifyGuard)
  @Roles([traveller])
  @Get('send-requests')
  async sendRequests(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{ data: SendRequestResponseDto[]; meta: Meta }> {
    return await this.travellerService.sendRequests(req, page, limit);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard, TravellerVerifyGuard)
  @Roles([traveller])
  @Patch('request-status/:id')
  async changeRequestStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { status: string }, // <-- full bod,
  ): Promise<{ message: string }> {
    return await this.travellerService.updateRequestStatus(id, body.status, req);
  }
}
