import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './database/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MailModule } from './mail/mail.module.js';
import { TravellerModule } from './traveller/traveller.module.js';
import { RoleModule } from './roles/role.module.js';
import { UploadModule } from './upload/upload.module.js';
import { ServicesModule } from './services/services.module.js';
import { TestModule } from './test/test.module.js';



@Module({
  imports:[PrismaModule, AuthModule,MailModule, TravellerModule,RoleModule,UploadModule, ServicesModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
