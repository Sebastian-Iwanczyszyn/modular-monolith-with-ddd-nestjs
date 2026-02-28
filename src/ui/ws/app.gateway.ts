import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification, RxjsNotifier } from '../../common/messaging/rxjs.notifier';
import { OnModuleInit } from '@nestjs/common';
import { Environemnt } from '../../environemnt';

@WebSocketGateway({
  path: '/ws',
  cors: {
    origin: Environemnt.WEBSOCKET_CORS,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly sessions = new Map<string, Socket>();
  private readonly sessionsByUser = new Map<string, Set<Socket>>();

  constructor(private readonly notifier: RxjsNotifier<Notification>) {
  }

  onModuleInit() {
    this.notifier.notifications$.subscribe(notification => {
      const targets = this.sessionsByUser.get(notification.userId);
      if (!targets || targets.size === 0) {
        return;
      }
      for (const socket of targets) {
        socket.emit('routingKey', { message: notification });
      }
    });
  }

  handleConnection(client: Socket): void {
    const userId = this.extractUserId(client);
    this.sessions.set(client.id, client);
    if (userId) {
      const set = this.sessionsByUser.get(userId) ?? new Set<Socket>();
      set.add(client);
      this.sessionsByUser.set(userId, set);
    }
    this.server.emit('user_connected', { id: client.id, userId });
  }

  handleDisconnect(client: Socket): void {
    const userId = this.extractUserId(client);
    this.sessions.delete(client.id);
    if (userId) {
      const set = this.sessionsByUser.get(userId);
      if (set) {
        set.delete(client);
        if (set.size === 0) {
          this.sessionsByUser.delete(userId);
        }
      }
    }
    this.server.emit('user_disconnected', { id: client.id, userId });
  }

  private extractUserId(client: Socket): string | undefined {
    const authUserId = typeof client.handshake.auth?.userId === 'string'
      ? client.handshake.auth.userId
      : undefined;
    if (authUserId) return authUserId;
    const queryUserId = typeof client.handshake.query?.userId === 'string'
      ? client.handshake.query.userId
      : undefined;
    return queryUserId;
  }
}
