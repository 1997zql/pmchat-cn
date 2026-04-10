import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const [posts, users] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { tags: { has: query } }
          ]
        },
        include: { author: true, category: true },
        take: 20
      }),
      this.prisma.user.findMany({
        where: {
          OR: [
            { nickname: { contains: query, mode: "insensitive" } },
            { title: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 10
      })
    ]);
    return {
      posts: posts.map((post: {
        id: string;
        title: string;
        excerpt: string | null;
        content: string;
        tags: string[];
        likeCount: number;
        favoriteCount: number;
        author: { id: string; nickname: string; title: string | null };
        category: { name: string; slug: string };
      }) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || post.content.slice(0, 120),
        tags: post.tags,
        likeCount: post.likeCount,
        favoriteCount: post.favoriteCount,
        author: {
          id: post.author.id,
          nickname: post.author.nickname,
          title: post.author.title
        },
        category: {
          name: post.category.name,
          slug: post.category.slug
        }
      })),
      users: users.map((user: {
        id: string;
        nickname: string;
        title: string | null;
        bio: string | null;
        company: string | null;
      }) => ({
        id: user.id,
        nickname: user.nickname,
        title: user.title,
        bio: user.bio,
        company: user.company
      }))
    };
  }
}
