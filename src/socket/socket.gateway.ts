import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketService } from './socket.service.js';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors:{
    origin: '*',
  }
})
export class SocketGateway implements OnGatewayConnection,OnGatewayDisconnect {
  constructor(private readonly jwtService:JwtService) {}
  @WebSocketServer()
  server:Server;
  async handleConnection(client: Socket) {
    try{
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if(!token){
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      const userId = payload.sub;

      client.join(`user_${userId}`);
      console.log(`User ${userId} & ${payload.role} connected`);

    } catch(error){
      client.disconnect();
      console.log('Connection error:', error.message);
    }
    
  }
  async handleDisconnect(client: Socket) {
    console.log(`Client Disconnected ${client.id}`)
  }

}
