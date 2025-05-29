import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit() {
    this.server.emit('Server Init');
  }

  handleConnection() {
    this.server.emit('client connected');
  }

  handleDisconnect() {
    this.server.emit('client disconnected');
  }

  notifyVerificationUpdate(userId: string) {
    this.server.emit(`emailVerified:${userId}`, {
      message: 'Email verification successfully!',
    });
  }
}
