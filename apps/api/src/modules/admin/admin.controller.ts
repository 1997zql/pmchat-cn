import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/current-user.decorator";
import { JwtAuthGuard } from "../../common/jwt-auth.guard";
import { Roles } from "../../common/roles.decorator";
import { RolesGuard } from "../../common/roles.guard";
import { AdminService } from "./admin.service";
import { ManageCategoryDto, ManageChannelDto, UpdatePostStatusDto, UpdateReportStatusDto, UpdateUserStatusDto } from "./dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("dashboard")
  dashboard() {
    return this.adminService.dashboard();
  }

  @Get("users")
  users() {
    return this.adminService.users();
  }

  @Get("posts")
  posts() {
    return this.adminService.posts();
  }

  @Get("reports")
  reports() {
    return this.adminService.reports();
  }

  @Patch("users/:id/status")
  updateUserStatus(@Param("id") id: string, @Body() dto: UpdateUserStatusDto) {
    return this.adminService.updateUserStatus(id, dto);
  }

  @Patch("posts/:id/status")
  updatePostStatus(@Param("id") id: string, @Body() dto: UpdatePostStatusDto) {
    return this.adminService.updatePostStatus(id, dto);
  }

  @Patch("reports/:id/status")
  updateReportStatus(
    @Param("id") id: string,
    @CurrentUser() user: { sub: string },
    @Body() dto: UpdateReportStatusDto
  ) {
    return this.adminService.updateReportStatus(id, user.sub, dto);
  }

  @Get("categories")
  categories() {
    return this.adminService.categories();
  }

  @Post("categories")
  createCategory(@Body() dto: ManageCategoryDto) {
    return this.adminService.createCategory(dto);
  }

  @Patch("categories/:id")
  updateCategory(@Param("id") id: string, @Body() dto: ManageCategoryDto) {
    return this.adminService.updateCategory(id, dto);
  }

  @Get("channels")
  channels() {
    return this.adminService.channels();
  }

  @Post("channels")
  createChannel(@Body() dto: ManageChannelDto) {
    return this.adminService.createChannel(dto);
  }

  @Patch("channels/:id")
  updateChannel(@Param("id") id: string, @Body() dto: ManageChannelDto) {
    return this.adminService.updateChannel(id, dto);
  }
}
