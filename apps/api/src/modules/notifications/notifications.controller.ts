import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";

@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.notificationsService.list(user.sub);
  }

  @Post("read")
  read(@CurrentUser() user: { sub: string }) {
    return this.notificationsService.readAll(user.sub);
  }

  @Post(":id/read")
  readOne(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.notificationsService.readOne(user.sub, id);
  }
}
