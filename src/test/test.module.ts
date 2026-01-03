import { Module } from '@nestjs/common';
import { TestService } from './test.service.js';
import { TestController } from './test.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { RoleModule } from '../roles/role.module.js';
import { TravellerModule } from '../traveller/traveller.module.js';


@Module({
  imports:[AuthModule,RoleModule,TravellerModule],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
