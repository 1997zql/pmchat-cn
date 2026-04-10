import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { CreateCommentDto } from "./dto";

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  list(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId, status: "PUBLISHED", parentId: null },
      include: { author: true, replies: { include: { author: true } } },
      orderBy: { createdAt: "asc" }
    });
  }

  async create(postId: string, authorId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        postId,
        authorId,
        content: dto.content,
        parentId: dto.parentId
      },
      include: { author: true, replies: true }
    });
  }

  async reply(parentId: string, authorId: string, dto: CreateCommentDto) {
    const parent = await this.prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent) {
      throw new BadRequestException("父评论不存在");
    }
    return this.create(parent.postId, authorId, { ...dto, parentId });
  }
}
