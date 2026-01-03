import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TestService } from './test.service.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/guard/roles.guard.js';
import { Roles } from '../roles/decorators/role.decorator.js';
import type { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(RolesGuard)
  @Roles(['ADMIN'])
  @Post()
  async adminTest(@Body() body: any[], @Req() req: Request): Promise<any> {
    return this.testService.adminTest(body, req);
  }
}
