import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { CreatePostDto, CreateReportDto, UpdatePostDto } from "./dto";

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  list(options?: {
    category?: string;
    type?: "ARTICLE" | "QUESTION" | "DISCUSSION";
    sort?: "latest" | "popular";
  }) {
    const orderBy =
      options?.sort === "popular"
        ? [{ likeCount: "desc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    return this.prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        ...(options?.category ? { category: { slug: options.category } } : {}),
        ...(options?.type ? { type: options.type } : {})
      },
      orderBy,
      include: { author: true, category: true, comments: true }
    });
  }

  categories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });
  }

  async detail(id: string, viewerId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        comments: {
          where: { parentId: null, status: "PUBLISHED" },
          include: { author: true, replies: { include: { author: true } } }
        },
        likes: true,
        favorites: true
      }
    });
    if (!post) {
      return null;
    }

    const [isFollowingAuthor, relatedPosts, authorStats] = await Promise.all([
      viewerId
        ? this.prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: viewerId,
                followingId: post.authorId
              }
            }
          })
        : null,
      this.prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          id: { not: post.id },
          OR: [
            { categoryId: post.categoryId },
            ...(post.tags.length ? post.tags.map((tag: string) => ({ tags: { has: tag } })) : [])
          ]
        },
        include: {
          author: true,
          category: true
        },
        take: 4,
        orderBy: [{ likeCount: "desc" }, { createdAt: "desc" }]
      }),
      this.prisma.user.findUnique({
        where: { id: post.authorId },
        select: {
          _count: {
            select: {
              posts: true,
              followers: true,
              following: true
            }
          }
        }
      })
    ]);

    return {
      ...post,
      authorStats: {
        posts: authorStats?._count.posts || 0,
        followers: authorStats?._count.followers || 0,
        following: authorStats?._count.following || 0
      },
      relatedPosts,
      viewer: {
        hasLiked: viewerId ? post.likes.some((item: { userId: string }) => item.userId === viewerId) : false,
        hasFavorited: viewerId
          ? post.favorites.some((item: { userId: string }) => item.userId === viewerId)
          : false,
        isFollowingAuthor: Boolean(isFollowingAuthor)
      }
    };
  }

  async create(userId: string, dto: CreatePostDto) {
    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) {
      throw new BadRequestException("分类不存在");
    }
    const needReview = dto.content.includes("联系方式") || dto.content.includes("加微信");
    return this.prisma.post.create({
      data: {
        authorId: userId,
        title: dto.title,
        excerpt: dto.content.slice(0, 120),
        content: dto.content,
        categoryId: dto.categoryId,
        type: dto.type,
        tags: dto.tags ?? [],
        coverUrl: dto.coverUrl,
        status: needReview ? "PENDING_REVIEW" : "PUBLISHED"
      },
      include: { author: true, category: true }
    });
  }

  async update(postId: string, userId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== userId) {
      throw new BadRequestException("无权编辑该内容");
    }
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (!category) {
        throw new BadRequestException("分类不存在");
      }
    }
    const nextContent = dto.content ?? post.content;
    const needReview = nextContent.includes("联系方式") || nextContent.includes("加微信");
    return this.prisma.post.update({
      where: { id: postId },
      data: {
        ...dto,
        excerpt: dto.content ? dto.content.slice(0, 120) : post.excerpt,
        status: needReview ? "PENDING_REVIEW" : post.status,
        reviewReason: needReview ? "内容命中风控关键词，已重新进入审核" : post.reviewReason
      },
      include: { author: true, category: true }
    });
  }

  async like(postId: string, userId: string) {
    const existed = await this.prisma.postLike.findUnique({
      where: { userId_postId: { userId, postId } }
    });
    if (!existed) {
      await this.prisma.postLike.create({ data: { userId, postId } });
      await this.prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } }
      });
    }
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { likeCount: true }
    });
    return { success: true, likeCount: post?.likeCount || 0, hasLiked: true };
  }

  async unlike(postId: string, userId: string) {
    const deleted = await this.prisma.postLike.deleteMany({
      where: { userId, postId }
    });
    if (deleted.count) {
      await this.prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } }
      });
    }
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { likeCount: true }
    });
    return { success: true, likeCount: post?.likeCount || 0, hasLiked: false };
  }

  async favorite(postId: string, userId: string) {
    const existed = await this.prisma.favorite.findUnique({
      where: { userId_postId: { userId, postId } }
    });
    if (!existed) {
      await this.prisma.favorite.create({ data: { userId, postId } });
      await this.prisma.post.update({
        where: { id: postId },
        data: { favoriteCount: { increment: 1 } }
      });
    }
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { favoriteCount: true }
    });
    return { success: true, favoriteCount: post?.favoriteCount || 0, hasFavorited: true };
  }

  async unfavorite(postId: string, userId: string) {
    const deleted = await this.prisma.favorite.deleteMany({
      where: { userId, postId }
    });
    if (deleted.count) {
      await this.prisma.post.update({
        where: { id: postId },
        data: { favoriteCount: { decrement: 1 } }
      });
    }
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { favoriteCount: true }
    });
    return { success: true, favoriteCount: post?.favoriteCount || 0, hasFavorited: false };
  }

  async report(postId: string, userId: string, dto: CreateReportDto) {
    await this.prisma.report.create({
      data: {
        reporterId: userId,
        postId,
        targetType: "post",
        targetId: postId,
        reason: dto.reason,
        detail: dto.detail
      }
    });
    return { success: true, message: "举报已提交，我们会尽快处理" };
  }
}
