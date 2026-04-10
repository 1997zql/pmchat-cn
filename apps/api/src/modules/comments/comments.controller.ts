import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto";

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get("posts/:id/comments")
  list(@Param("id") postId: string) {
    return this.commentsService.list(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("posts/:id/comments")
  create(@Param("id") postId: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(postId, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("comments/:id/reply")
  reply(@Param("id") parentId: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateCommentDto) {
    return this.commentsService.reply(parentId, user.sub, dto);
  }
}
