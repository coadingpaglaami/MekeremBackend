import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getMyNotifications(@Req() req: Request) {
    const userId = req.user && (req.user as any).sub;
    return this.notificationService.findMyNotifications(userId);
  }

  @Get('unread-count')
  getUnreadCount(@Req() req: Request) {
    const userId = req.user && (req.user as any).sub;
    return this.notificationService.getUnreadCount(userId);
  }

  @Patch(':id/mark-as-read')
  markAsRead(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user && (req.user as any).sub;
    return this.notificationService.markAsRead(id, userId);
  }
}
