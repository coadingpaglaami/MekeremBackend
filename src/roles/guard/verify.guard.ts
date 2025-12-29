import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class TravellerVerifyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('No user found in request');
    }
    if (!user?.sub) {
      throw new ForbiddenException('User ID not found in request');
    }
    const carrierProfile = await this.prisma.carrierProfile.findUnique({
      where: { userId: user.sub },
      select: { isVerified: true },
    });
    if (!carrierProfile || !carrierProfile.isVerified) {
      throw new ForbiddenException('User is not a verified traveller');
    }
    return true;
  }
}
