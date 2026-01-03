import { Module } from '@nestjs/common';
import { TravellerService } from './traveller.service.js';
import { TravellerController } from './traveller.controller.js';
import { JwtStrategy } from '../auth/jwt.strategy.js';
import { AuthModule } from '../auth/auth.module.js';
import { RoleModule } from '../roles/role.module.js';
import { PrismaModule } from '../database/prisma.module.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    RoleModule,
    UploadModule
  ],
  controllers: [TravellerController],
  providers: [
    TravellerService,
    JwtStrategy,
  ],
  exports: [TravellerService],
})
export class TravellerModule {}
