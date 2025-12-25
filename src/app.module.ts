import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './database/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MailModule } from './mail/mail.module.js';



@Module({
  imports:[PrismaModule, AuthModule,MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
