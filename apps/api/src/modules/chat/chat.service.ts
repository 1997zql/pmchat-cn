import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { CreateChatMessageDto } from "./dto";

type ChatErrorCode = "UNAUTHORIZED" | "MUTED" | "RISK_BLOCKED" | "EMPTY_CONTENT" | "CHANNEL_UNAVAILABLE";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  channels() {
    return this.prisma.chatChannel.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });
  }

  messages(channelId: string) {
    return this.prisma.chatMessage.findMany({
      where: { channelId },
      include: { author: true },
      orderBy: { createdAt: "asc" },
      take: 50
    });
  }

  async ensureChannel(channelId: string) {
    const channel = await this.prisma.chatChannel.findUnique({ where: { id: channelId } });
    if (!channel) {
      this.throwChatError("CHANNEL_UNAVAILABLE", "频道不可用，请切换到其他频道");
    }
    return channel;
  }

  private throwChatError(code: ChatErrorCode, message: string): never {
    const error = new BadRequestException(message);
    (error as BadRequestException & { chatCode?: ChatErrorCode }).chatCode = code;
    throw error;
  }

  async createMessage(channelId: string, userId: string, dto: CreateChatMessageDto) {
    await this.ensureChannel(channelId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      this.throwChatError("UNAUTHORIZED", "请先登录后再发送消息");
    }
    if (user.status === "MUTED") {
      this.throwChatError("MUTED", "当前账号已被禁言");
    }
    if (!dto.content.trim()) {
      this.throwChatError("EMPTY_CONTENT", "请输入消息内容");
    }
    if (dto.content.includes("加微信")) {
      this.throwChatError("RISK_BLOCKED", "消息命中风控规则，请修改后再发送");
    }
    return this.prisma.chatMessage.create({
      data: {
        channelId,
        authorId: userId,
        content: dto.content.trim()
      },
      include: { author: true, channel: true }
    });
  }

  async recallMessage(messageId: string, userId: string, force = false) {
    const message = await this.prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!message) {
      throw new BadRequestException("消息不存在");
    }
    const operator = await this.prisma.user.findUnique({ where: { id: userId } });
    const canForceRecall = force || operator?.role === "ADMIN";
    if (!canForceRecall && message.authorId !== userId) {
      throw new BadRequestException("无权撤回该消息");
    }
    return this.prisma.chatMessage.update({
      where: { id: messageId },
      data: { status: "RECALLED", content: "该消息已撤回" },
      include: { author: true, channel: true }
    });
  }
}
