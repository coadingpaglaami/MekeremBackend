import { Module } from '@nestjs/common';
import { ServicesService } from './services.service.js';
import { ServicesController } from './services.controller.js';
import { RoleModule } from '../roles/role.module.js';
import { PrismaModule } from '../database/prisma.module.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports:[PrismaModule,RoleModule,UploadModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
