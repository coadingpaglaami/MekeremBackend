import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/guard/roles.guard.js';
import { Roles } from '../roles/decorators/role.decorator.js';
import type {
  GetAvailableTripsQueryDto,
  SendRequestDto,
  SendRequestResponseDto,
  TripResponseDto,
} from './dto/services.dto.js';
import type { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../upload/multer.confit.js';
import { SendRequest } from '../database/prisma-client/client.js';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('trips')
  @UseGuards(RolesGuard)
  @Roles(['SENDER'])
  async getAvailableTrips(
    @Query() query: GetAvailableTripsQueryDto,
    @Req() req: Request,
  ): Promise<TripResponseDto> {
    return await this.servicesService.getAvailableTrips(query, req);
  }

  @Post('trips/:tripId/requests')
  @UseGuards(RolesGuard)
  @Roles(['SENDER'])
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'productImage', maxCount: 5 }],
      multerConfig,
    ),
  )
  async sendRequst(
    @Body() sendRequest: SendRequestDto,
    @Param('tripId') tripId: string,
    @Req() req: Request,
    @UploadedFiles()
    files: {
      productImage: Express.Multer.File[];
    },
  ): Promise<SendRequestResponseDto> {
    // console.log(files.productImage)
    sendRequest.productWeight = sendRequest.productWeight || '';
    return await this.servicesService.sendRequestToTrip(
      req,
      tripId,
      sendRequest,
      files,
    );
  }
}
