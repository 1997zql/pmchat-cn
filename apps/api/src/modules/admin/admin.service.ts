import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { ManageCategoryDto, ManageChannelDto, UpdatePostStatusDto, UpdateReportStatusDto, UpdateUserStatusDto } from "./dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  dashboard() {
    return Promise.all([
      this.prisma.user.count(),
      this.prisma.post.count(),
      this.prisma.comment.count(),
      this.prisma.report.count()
    ]).then(([users, posts, comments, reports]) => ({
      users,
      posts,
      comments,
      reports
    }));
  }

  users() {
    return this.prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  }

  posts() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: true, category: true },
      take: 50
    });
  }

  reports() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: { reporter: true, post: true, handledBy: true }
    });
  }

  updateUserStatus(id: string, dto: UpdateUserStatusDto) {
    return this.prisma.user.update({
      where: { id },
      data: { status: dto.status }
    });
  }

  updatePostStatus(id: string, dto: UpdatePostStatusDto) {
    return this.prisma.post.update({
      where: { id },
      data: {
        status: dto.status,
        reviewReason: dto.reviewReason
      }
    });
  }

  updateReportStatus(id: string, adminId: string, dto: UpdateReportStatusDto) {
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ["IN_PROGRESS", "REJECTED", "PUNISHED"],
      IN_PROGRESS: ["REJECTED", "PUNISHED", "CLOSED"],
      REJECTED: ["CLOSED"],
      PUNISHED: ["CLOSED"],
      CLOSED: []
    };

    return this.prisma.report.findUnique({ where: { id } }).then((report: { status: string } | null) => {
      if (!report) {
        throw new BadRequestException("举报单不存在");
      }
      if (report.status !== dto.status && !allowedTransitions[report.status]?.includes(dto.status)) {
        throw new BadRequestException("当前举报状态不允许这样流转");
      }
      return this.prisma.report.update({
        where: { id },
        data: {
          status: dto.status,
          handleNote: dto.handleNote,
          handledById: adminId
        }
      });
    });
  }

  categories() {
    return this.prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  }

  createCategory(dto: ManageCategoryDto) {
    return this.prisma.category.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true
      }
    });
  }

  updateCategory(id: string, dto: ManageCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true
      }
    });
  }

  channels() {
    return this.prisma.chatChannel.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  }

  createChannel(dto: ManageChannelDto) {
    return this.prisma.chatChannel.create({
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder ?? 0
      }
    });
  }

  updateChannel(id: string, dto: ManageChannelDto) {
    return this.prisma.chatChannel.update({
      where: { id },
      data: {
        slug: dto.slug,
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder ?? 0
      }
    });
  }
}
