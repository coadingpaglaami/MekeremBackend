import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway.js';

@Injectable()
export class SocketService {
  constructor(private socketGateway: SocketGateway) {}

  emitToUser(userId: string, event: string, payload: any) {
    const room = `user_${userId}`;

    console.log('[SOCKET EMIT]');
    console.log('  → room:', room);
    console.log('  → event:', event);
    console.log('  → payload:', payload);

    // 🔍 See all active rooms
    console.log(
      '  → active rooms:',
      Array.from(this.socketGateway.server.sockets.adapter.rooms.keys()),
    );

    this.socketGateway.server.to(`user_${userId}`).emit(event, payload);
  }
  emitToRoom(room: string, event: string, payload: any) {
    this.socketGateway.server.to(room).emit(event, payload);
  }
}
