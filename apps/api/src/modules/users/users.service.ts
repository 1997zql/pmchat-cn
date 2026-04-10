import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { UpdateProfileDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" }
        },
        followers: true,
        following: true,
        favorites: {
          include: {
            post: {
              include: { category: true, author: true }
            }
          }
        },
        notifications: { orderBy: { createdAt: "desc" }, take: 20 },
        comments: { include: { post: true }, orderBy: { createdAt: "desc" }, take: 20 }
      }
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      favorites: user.favorites.map((item: {
        post: {
          id: string;
          authorId: string;
          categoryId: string;
          title: string;
          excerpt: string | null;
          content: string;
          type: string;
          status: string;
          tags: string[];
          coverUrl: string | null;
          viewCount: number;
          likeCount: number;
          favoriteCount: number;
          reviewReason: string | null;
          createdAt: Date;
          updatedAt: Date;
          category: unknown;
          author: unknown;
        };
      }) => item.post)
    };
  }

  async profile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" }
        },
        followers: true,
        following: true
      }
    });
    if (!user) {
      return null;
    }
    return {
      ...user,
      stats: {
        posts: user.posts.length,
        followers: user.followers.length,
        following: user.following.length
      }
    };
  }

  updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto
    });
  }

  async follow(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      return { success: false, message: "不能关注自己", isFollowing: false };
    }

    await this.prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId
        }
      },
      update: {},
      create: {
        followerId: userId,
        followingId: targetUserId
      }
    });

    await this.prisma.notification.create({
      data: {
        userId: targetUserId,
        title: "新增关注",
        content: "有用户关注了你",
        type: "FOLLOW",
        link: "/me",
        entityId: userId,
        entityType: "user"
      }
    });

    const followersCount = await this.prisma.follow.count({
      where: { followingId: targetUserId }
    });
    return { success: true, isFollowing: true, followersCount };
  }

  async unfollow(userId: string, targetUserId: string) {
    await this.prisma.follow.deleteMany({
      where: {
        followerId: userId,
        followingId: targetUserId
      }
    });
    const followersCount = await this.prisma.follow.count({
      where: { followingId: targetUserId }
    });
    return { success: true, isFollowing: false, followersCount };
  }

  myPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: { category: true, author: true, comments: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async myFavorites(userId: string) {
    const rows = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        post: {
          include: { category: true, author: true, comments: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return rows.map((item: {
      post: {
        id: string;
        authorId: string;
        categoryId: string;
        title: string;
        excerpt: string | null;
        content: string;
        type: string;
        status: string;
        tags: string[];
        coverUrl: string | null;
        viewCount: number;
        likeCount: number;
        favoriteCount: number;
        reviewReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        category: unknown;
        author: unknown;
        comments: unknown[];
      };
    }) => item.post);
  }

  myComments(userId: string) {
    return this.prisma.comment.findMany({
      where: { authorId: userId },
      include: { post: true, replies: true },
      orderBy: { createdAt: "desc" }
    });
  }
}
