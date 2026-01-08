import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { SocketService } from '../socket/socket.service.js';
import { NotificationDto } from './dto/notification.dto.js';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private socketService: SocketService,
  ) {}

  async create(notificationdto: NotificationDto) {
    const { data, message, userId, type, title } = notificationdto;

    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ?? undefined,
      },
    });

    this.socketService.emitToUser(userId, 'notification:new', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
    });

    return notification;
  }

  async findMyNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }
}
