import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { UpdateProfileDto } from "./dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: { sub: string }) {
    return this.usersService.me(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateMe(@CurrentUser() user: { sub: string }, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/posts")
  myPosts(@CurrentUser() user: { sub: string }) {
    return this.usersService.myPosts(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/favorites")
  myFavorites(@CurrentUser() user: { sub: string }) {
    return this.usersService.myFavorites(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/comments")
  myComments(@CurrentUser() user: { sub: string }) {
    return this.usersService.myComments(user.sub);
  }

  @Get(":id")
  profile(@Param("id") id: string) {
    return this.usersService.profile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/follow")
  follow(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.usersService.follow(user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/follow")
  unfollow(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.usersService.unfollow(user.sub, id);
  }
}
