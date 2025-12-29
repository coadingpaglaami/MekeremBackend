import { Injectable } from '@nestjs/common';
import { CarrierProfile } from 'src/database/prisma-client/client';
import { PrismaService } from '../database/prisma.service.js';
import type { Request } from 'express';

@Injectable()
export class TravellerService {
  constructor(private prisma: PrismaService) {}

  async getTravellerInfo(
    travellerInfo: Partial<CarrierProfile>,
    req: Request,
  ): Promise<CarrierProfile> {
    const id = (req.user as any).id ?? (req.user as any).sub;
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const carrierProfile = await this.prisma.carrierProfile.findUnique({
      where: { userId: user.id },
    });
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

    if (!carrierProfile) {
      const createdProfile = await this.prisma.carrierProfile.create({
        data: {
          userId: user.id,
          dateOfBirth: travellerInfo.dateOfBirth || new Date(),
          nationality: travellerInfo.nationality || '',
          phoneNumber: travellerInfo.phoneNumber || '',
          nidNumber: travellerInfo.nidNumber || '',
          nidFrontImage: travellerInfo.nidFrontImage || '',
          nidBackImage: travellerInfo.nidBackImage || '',
          passportImage: travellerInfo.passportImage || '',
          drivingLicenseFront: travellerInfo.drivingLicenseFront || '',
          drivingLicenseBack: travellerInfo.drivingLicenseBack || '',
          selfies: travellerInfo.selfies || [''],
          addressLineOne: travellerInfo.addressLineOne || '',
          city: travellerInfo.city || '',
          state: travellerInfo.state || '',
          postalCode: travellerInfo.postalCode || '',
          country: travellerInfo.country || '',
          isVerified: false,
        },
      });
      const allFieldsFilled = requiredFields.every(
        (field) =>
          createdProfile[field] !== null &&
          createdProfile[field] !== undefined &&
          createdProfile[field] !== '',
      );
      if (allFieldsFilled) {
        await this.prisma.carrierProfile.update({
          where: { userId: user.id },
          data: { isVerified: true },
        });
      }
      return createdProfile;
    }

    const updatedProfile = { ...carrierProfile, ...travellerInfo };

    const allFieldsFilled = requiredFields.every(
      (field) =>
        updatedProfile[field] !== null &&
        updatedProfile[field] !== undefined &&
        updatedProfile[field] !== '',
    );

    const updatedCarrierProfile = await this.prisma.carrierProfile.update({
      where: { userId: id },
      data: {
        ...travellerInfo,
        isVerified: allFieldsFilled ? true : carrierProfile?.isVerified,
      },
    });
    return updatedCarrierProfile;
  }

  async createTrip(req: Request, tripDetails: any): Promise<any> {
    return { message: 'Trip created successfully', tripDetails  };
  }
}
