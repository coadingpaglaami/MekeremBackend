import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { NotificationController } from './notification.controller.js';
import { PrismaModule } from '../database/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { SocketModule } from '../socket/socket.module.js';

@Module({
  imports:[PrismaModule,AuthModule,SocketModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
