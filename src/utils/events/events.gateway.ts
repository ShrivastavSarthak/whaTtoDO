import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Server Init', server);
  }

  handleConnection(client: Socket) {
    console.log('Client connected', client);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client);
  }

  notifyVerificationUpdate(userId: string) {
    console.log("done");
    
    this.server.emit(`emailVerified:${userId}`, {
      message: 'Email verification successfully!',
    });
  }
}
