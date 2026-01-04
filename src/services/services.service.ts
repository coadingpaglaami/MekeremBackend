import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import type {
  GetAvailableTripsQueryDto,
  SendRequestDto,
  SendRequestResponseDto,
  TripResponseDto,
} from './dto/services.dto.js';
import type { Request } from 'express';
import { Meta } from '../traveller/dto/create-trip.dto.js';
import { getDateRange } from '../common/utils/date.utils.js';
import { UploadService } from '../upload/upload.service.js';

@Injectable()
export class ServicesService {
  constructor(
    private prismaService: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getAvailableTrips(
    query: GetAvailableTripsQueryDto,
    req: Request,
  ): Promise<TripResponseDto> {
    const userId = req.user && (req.user as any).sub;
    if (!userId) {
      throw new BadRequestException('Invalid user');
    }
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { from, to, date, limit = 10, page = 1 } = query;
    let dateFilter;
    dateFilter = date ? getDateRange(date) : undefined;

    const whereCondition = {
      from: from || undefined,
      to: to || undefined,
      departureDate: dateFilter,
      tripStatus: 'PENDING' as const,
    };

    const availableTrips = await this.prismaService.trip.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        departureDate: 'asc',
      },
      select: {
        id: true,
        from: true,
        to: true,
        departureDate: true,
        luggageWeight: true,
        pricePerUnit: true,
        tripNotes: true,
        traveller: {
          select: {
            id: true,
            name: true,
            carrierProfile: {
              select: {
                isVerified: true,
                carrierRating: true,
              },
            },
          },
        },
      },
    });

    const totalItems = await this.prismaService.trip.count({
      where: whereCondition,
    });

    const meta: Meta = {
      totalItems,
      currentPage: page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    };
    return {
      meta: meta,
      trips: availableTrips,
    };
  }

  async sendRequestToTrip(
    req: Request,
    tripId: string,
    sendRequest: SendRequestDto,
    files: {
      productImage: Express.Multer.File[];
    },
  ): Promise<SendRequestResponseDto> {
    const userId = req.user && (req.user as any).sub;
    if (!userId) {
      throw new BadRequestException('Invalid user');
    }
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const trip = await this.prismaService.trip.findUnique({
      where: { id: tripId },
      select: {
        id: true,
        from: true,
        to: true,
        departureDate: true,
      },
    });
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }
    const requestExists = await this.prismaService.sendRequest.findFirst({
      where: {
        senderId: user.id,
        tripId: tripId,
      },
    });
    if (requestExists) {
      throw new BadRequestException('Request already sent for this trip');
    }
    const { productWeight, requestMessage } = sendRequest;
    console.log(productWeight, requestMessage);
    let productImage: string[] = [];
    if (files.productImage && files.productImage.length > 0) {
      productImage = await this.uploadService.uploadMultipleFiles(
        files.productImage,
        'services/product-images',
      );
    }
    const sendRequestRecord = await this.prismaService.sendRequest.create({
      data: {
        senderId: user.id,
        productImage: productImage,
        productWeight: productWeight || '',
        requestMessage: requestMessage,
        tripId: tripId,
      },
      select: {
        senderId: true,
        productImage: true,
        productWeight: true,
        requestMessage: true,
      },
    });

    return {
      sendRequest: sendRequestRecord,
      trip: trip,
    };
  }
}
