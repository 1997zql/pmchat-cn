import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { ChatService } from "./chat.service";
import { CreateChatMessageDto } from "./dto";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("channels")
  channels() {
    return this.chatService.channels();
  }

  @Get("channels/:id/messages")
  messages(@Param("id") channelId: string) {
    return this.chatService.messages(channelId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("channels/:id/messages")
  createMessage(@Param("id") channelId: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateChatMessageDto) {
    return this.chatService.createMessage(channelId, user.sub, dto);
  }
}
