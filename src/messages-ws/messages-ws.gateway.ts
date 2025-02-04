import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({cors: true, namespace: '/'})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    // console.log({ connectedClients: this.messagesWsService.getConnectedClients() });
    const token = client.handshake.headers.authentication as string;
    console.log({token})
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client);
    console.log({ connectedClients: this.messagesWsService.getConnectedClients() });
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }

  /**
   * Handles incoming messages from clients.
   * @param client - The client socket instance.
   * @param payload - The message data sent by the client.
   */
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // client.emit('message-from-server', {
    //   fullMessage: `You said: ${payload.message}`,
    //   message: payload.message || 'no-message',
    // });

    // client.broadcast.emit('message-from-server', {
    //   fullMessage: `You said: ${payload.message}`,
    //   message: payload.message || 'no-message',
    // });

    this.wss.emit('message-from-server', {
      fullMessage: `You said: ${payload.message}`,
      message: payload.message || 'no-message',
      
    });
  }
}
