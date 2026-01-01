import { Injectable } from '@nestjs/common';
import { CarrierProfile } from 'src/database/prisma-client/client';
import { PrismaService } from '../database/prisma.service.js';
import type { Request } from 'express';
import { UploadService } from '../upload/upload.service.js';
import {
  CreateTripDto,
  GetTravellerTripsResponseDto,
  TripResponseDto,
} from './dto/create-trip.dto.js';

@Injectable()
export class TravellerService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async getTravellerInfo(
    travellerInfo: Partial<CarrierProfile>,
    req: Request,
    files: {
      nidFrontImage?: Express.Multer.File[];
      nidBackImage?: Express.Multer.File[];
      passportImage?: Express.Multer.File[];
      drivingLicenseFront?: Express.Multer.File[];
      drivingLicenseBack?: Express.Multer.File[];
      selfies?: Express.Multer.File[];
    },
  ): Promise<CarrierProfile> {
    const id = (req.user as any).id ?? (req.user as any).sub;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');

    // Upload files first
    const uploadData: Partial<CarrierProfile> = {};
    if (files?.nidFrontImage?.[0])
      uploadData.nidFrontImage = await this.uploadService.uploadSingleFile(
        files.nidFrontImage[0],
        'traveller/nidFront',
      );
    if (files?.nidBackImage?.[0])
      uploadData.nidBackImage = await this.uploadService.uploadSingleFile(
        files.nidBackImage[0],
        'traveller/nidBack',
      );
    if (files?.passportImage?.[0])
      uploadData.passportImage = await this.uploadService.uploadSingleFile(
        files.passportImage[0],
        'traveller/passport',
      );
    if (files?.drivingLicenseFront?.[0])
      uploadData.drivingLicenseFront =
        await this.uploadService.uploadSingleFile(
          files.drivingLicenseFront[0],
          'traveller/drivingLicenseFront',
        );
    if (files?.drivingLicenseBack?.[0])
      uploadData.drivingLicenseBack = await this.uploadService.uploadSingleFile(
        files.drivingLicenseBack[0],
        'traveller/drivingLicenseBack',
      );
    if (files?.selfies?.length)
      uploadData.selfies = await this.uploadService.uploadMultipleFiles(
        files.selfies,
        'traveller/selfies',
      );

    const requiredFields: (keyof CarrierProfile)[] = [
      'dateOfBirth',
      'nationality',
      'phoneNumber',
      'nidNumber',
      'nidFrontImage',
      'nidBackImage',
      'passportImage',
      'drivingLicenseFront',
      'drivingLicenseBack',
      'selfies',
      'addressLineOne',
      'city',
      'state',
      'postalCode',
      'country',
    ];

    // Check if profile exists
    let carrierProfile = await this.prisma.carrierProfile.findUnique({
      where: { userId: user.id },
    });

    if (!carrierProfile) {
      // Create new profile
      carrierProfile = await this.prisma.carrierProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: travellerInfo.dateOfBirth || new Date(),
          nationality: travellerInfo.nationality || '',
          phoneNumber: travellerInfo.phoneNumber || '',
          nidNumber: travellerInfo.nidNumber || '',
          addressLineOne: travellerInfo.addressLineOne || '',
          city: travellerInfo.city || '',
          state: travellerInfo.state || '',
          postalCode: travellerInfo.postalCode || '',
          country: travellerInfo.country || '',
          isVerified: false,
          ...uploadData, // <-- merge uploaded file URLs here
        },
      });
    } else {
      // Update existing profile
      carrierProfile = await this.prisma.carrierProfile.update({
        where: { userId: user.id },
        data: {
          ...travellerInfo,
          ...uploadData, // <-- merge uploaded file URLs here
        },
      });
    }

    // Check if all required fields are filled
    const allFieldsFilled = requiredFields.every(
      (field) =>
        carrierProfile?.[field] !== null &&
        carrierProfile?.[field] !== undefined &&
        carrierProfile?.[field] !== '' &&
        !(
          Array.isArray(carrierProfile?.[field]) &&
          carrierProfile?.[field].length === 0
        ),
    );

    // Update isVerified if all required fields are filled
    if (allFieldsFilled && !carrierProfile.isVerified) {
      carrierProfile = await this.prisma.carrierProfile.update({
        where: { userId: user.id },
        data: { isVerified: true },
      });
    }

    return carrierProfile;
  }

  async createTrip(
    req: Request,
    createTripDto: CreateTripDto,
  ): Promise<TripResponseDto> {
    const userId = req.user && (req.user as any).sub;
    if (!userId) {
      throw new Error('User not found in request');
    }
    const traveller = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!traveller) {
      throw new Error('Traveller not found');
    }
    const trip = await this.prisma.trip.create({
      data: {
        travellerId: traveller.id,
        from: createTripDto.from,
        to: createTripDto.to,
        departureDate: createTripDto.departureDate,
        luggageWeight: createTripDto.luggageWeight,
        pricePerUnit: createTripDto.pricePerUnit,
        transportType: createTripDto.transportType,
        tripNotes: createTripDto.tripNotes,
        returnDate: createTripDto.returnDate,
      },
    });

    return { message: 'Trip created successfully', trip: trip };
  }

  async travellerTrips(
    req: Request,
    page: number,
    limit: number,
  ): Promise<GetTravellerTripsResponseDto> {
    const userId = req.user && (req.user as any).sub;
    if (!userId) {
      throw new Error('User not found in request');
    }
    const traveller = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!traveller) {
      throw new Error('Traveller not found');
    }
    const trips = await this.prisma.trip.findMany({
      where: { travellerId: traveller.id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { departureDate: 'desc' },
      select: {
        id: true,
        from: true,
        to: true,
        departureDate: true,
        returnDate: true,
        luggageWeight: true,
        tripNotes: true,
      },
    });

    const totalTrips = await this.prisma.trip.count({
      where: { travellerId: traveller.id },
    });

    return {
      meta: {
        totalPages: Math.ceil(totalTrips / limit),
        currentPage: page,
        totalItems: totalTrips,
        limit,
      },
      data: trips,
    };
  }
}
