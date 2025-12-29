import { Module } from '@nestjs/common';
import { RolesGuard } from './guard/roles.guard.js';
import { TravellerVerifyGuard } from './guard/verify.guard.js';
import { PrismaModule } from '../database/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [RolesGuard, TravellerVerifyGuard],
  exports: [RolesGuard, TravellerVerifyGuard],
})
export class RoleModule {}
