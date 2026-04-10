import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { CreatePostDto, CreateReportDto, UpdatePostDto } from "./dto";
import { PostsService } from "./posts.service";

@Controller("posts")
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly jwtService: JwtService
  ) {}

  private getViewerId(authorization?: string) {
    if (!authorization?.startsWith("Bearer ")) {
      return undefined;
    }
    try {
      const payload = this.jwtService.verify<{ sub: string }>(authorization.slice(7));
      return payload.sub;
    } catch {
      return undefined;
    }
  }

  @Get()
  list(
    @Query("category") category?: string,
    @Query("type") type?: "ARTICLE" | "QUESTION" | "DISCUSSION",
    @Query("sort") sort?: "latest" | "popular"
  ) {
    return this.postsService.list({ category, type, sort });
  }

  @Get("meta/categories")
  categories() {
    return this.postsService.categories();
  }

  @Get(":id")
  detail(@Param("id") id: string, @Headers("authorization") authorization?: string) {
    return this.postsService.detail(id, this.getViewerId(authorization));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreatePostDto) {
    return this.postsService.create(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/like")
  like(@Param("id") id: string, @CurrentUser() user: { sub: string }) {
    return this.postsService.like(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/like")
  unlike(@Param("id") id: string, @CurrentUser() user: { sub: string }) {
    return this.postsService.unlike(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/favorite")
  favorite(@Param("id") id: string, @CurrentUser() user: { sub: string }) {
    return this.postsService.favorite(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/favorite")
  unfavorite(@Param("id") id: string, @CurrentUser() user: { sub: string }) {
    return this.postsService.unfavorite(id, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/report")
  report(@Param("id") id: string, @CurrentUser() user: { sub: string }, @Body() dto: CreateReportDto) {
    return this.postsService.report(id, user.sub, dto);
  }
}
