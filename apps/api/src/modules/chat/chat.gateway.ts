import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    client.emit("connected", { ok: true });
  }

  private getRoomPresence(channelId: string) {
    const sockets = this.server.sockets.adapter.rooms.get(channelId);
    if (!sockets) {
      return { channelId, onlineCount: 0, users: [] as Array<{ id?: string; nickname: string }> };
    }
    const users = [...sockets]
      .map((socketId) => this.server.sockets.sockets.get(socketId))
      .filter(Boolean)
      .map((socket) => ({
        id: socket?.data?.userId as string | undefined,
        nickname: (socket?.data?.nickname as string | undefined) || "游客"
      }))
      .filter((item, index, array) => array.findIndex((candidate) => candidate.id === item.id && candidate.nickname === item.nickname) === index);
    return {
      channelId,
      onlineCount: sockets.size,
      users
    };
  }

  @SubscribeMessage("join")
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { channelId: string; userId?: string; nickname?: string }
  ) {
    try {
      await this.chatService.ensureChannel(payload.channelId);
    } catch (error) {
      client.emit("chat:error", {
        channelId: payload.channelId,
        code: "CHANNEL_UNAVAILABLE",
        message: error instanceof Error ? error.message : "频道不可用"
      });
      return null;
    }
    for (const room of client.rooms) {
      if (room !== client.id) {
        client.leave(room);
        this.server.to(room).emit("presence:update", this.getRoomPresence(room));
      }
    }
    client.data.userId = payload.userId;
    client.data.nickname = payload.nickname;
    client.join(payload.channelId);
    const presence = this.getRoomPresence(payload.channelId);
    this.server.to(payload.channelId).emit("presence:update", presence);
    return { joined: payload.channelId, presence };
  }

  @SubscribeMessage("chat:send")
  async handleSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { channelId: string; userId: string; content: string; clientId?: string }
  ) {
    try {
      const message = await this.chatService.createMessage(payload.channelId, payload.userId, { content: payload.content });
      const eventPayload = { ...message, tempClientId: payload.clientId };
      this.server.to(payload.channelId).emit("chat:message", eventPayload);
      return eventPayload;
    } catch (error) {
      client.emit("chat:error", {
        channelId: payload.channelId,
        code:
          (error as Error & { chatCode?: string }).chatCode ||
          (error instanceof Error && error.message.includes("禁言")
            ? "MUTED"
            : "SEND_FAILED"),
        message: error instanceof Error ? error.message : "发送失败"
      });
      return null;
    }
  }

  @SubscribeMessage("chat:recall")
  async handleRecall(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: string; channelId: string; userId: string }
  ) {
    try {
      const message = await this.chatService.recallMessage(payload.messageId, payload.userId);
      this.server.to(payload.channelId).emit("chat:recall", message);
      return message;
    } catch (error) {
      client.emit("chat:error", {
        channelId: payload.channelId,
        code: "RECALL_FAILED",
        message: error instanceof Error ? error.message : "撤回失败"
      });
      return null;
    }
  }
}
