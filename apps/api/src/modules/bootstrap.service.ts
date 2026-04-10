import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CATEGORY_OPTIONS, CHAT_CHANNELS } from "@pmchat/shared";
import * as bcrypt from "bcryptjs";

type SeedUser = {
  email: string;
  nickname: string;
  title: string;
  bio: string;
  company: string;
  yearsOfExp: string;
  interests: string[];
};

type SeedPost = {
  title: string;
  type: "ARTICLE" | "QUESTION" | "DISCUSSION";
  authorEmail: string;
  categorySlug: string;
  tags: string[];
  content: string;
  excerpt: string;
  likeCount: number;
  favoriteCount: number;
  viewCount: number;
};

@Injectable()
export class BootstrapService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedBaseMeta();
    await this.seedAdmin();
    await this.seedColdStartCommunity();
  }

  private async seedBaseMeta() {
    for (const category of CATEGORY_OPTIONS) {
      await this.prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.label,
          sortOrder: CATEGORY_OPTIONS.indexOf(category),
          isActive: true
        },
        create: {
          slug: category.slug,
          name: category.label,
          sortOrder: CATEGORY_OPTIONS.indexOf(category),
          isActive: true
        }
      });
    }

    for (const [index, channel] of CHAT_CHANNELS.entries()) {
      await this.prisma.chatChannel.upsert({
        where: { slug: channel.slug },
        update: {
          name: channel.name,
          sortOrder: index,
          description: `${channel.name}频道`
        },
        create: {
          slug: channel.slug,
          name: channel.name,
          description: `${channel.name}频道`,
          sortOrder: index
        }
      });
    }
  }

  private async seedAdmin() {
    await this.prisma.user.upsert({
      where: { email: "admin@pmchat.cn" },
      update: { role: "ADMIN", nickname: "PM社区管理员" },
      create: {
        email: "admin@pmchat.cn",
        nickname: "PM社区管理员",
        passwordHash: await bcrypt.hash("Admin123456", 10),
        role: "ADMIN",
        title: "社区运营管理员",
        interests: ["社区运营", "内容审核"]
      }
    });
  }

  private async seedColdStartCommunity() {
    const seedUsers = await this.seedUsers();
    const seedPosts = await this.seedPosts();

    await this.seedRelationships(seedUsers);
    await this.seedEngagements(seedUsers, seedPosts);
    await this.seedCommentsIfNeeded(seedUsers, seedPosts);
    await this.seedNotificationsIfNeeded(seedUsers, seedPosts);
    await this.seedChatMessagesIfNeeded(seedUsers);
  }

  private async seedUsers() {
    const passwordHash = await bcrypt.hash("Pmchat123456", 10);

    for (const user of COMMUNITY_USERS) {
      await this.prisma.user.upsert({
        where: { email: user.email },
        update: {
          nickname: user.nickname,
          title: user.title,
          bio: user.bio,
          company: user.company,
          yearsOfExp: user.yearsOfExp,
          interests: user.interests,
          role: "USER",
          status: "ACTIVE"
        },
        create: {
          email: user.email,
          nickname: user.nickname,
          passwordHash,
          title: user.title,
          bio: user.bio,
          company: user.company,
          yearsOfExp: user.yearsOfExp,
          interests: user.interests,
          role: "USER",
          status: "ACTIVE"
        }
      });
    }

    return this.prisma.user.findMany({
      where: {
        email: {
          in: COMMUNITY_USERS.map((item) => item.email)
        }
      }
    });
  }

  private async seedPosts() {
    const users = await this.prisma.user.findMany({
      where: { email: { in: COMMUNITY_USERS.map((item) => item.email) } }
    });
    const categories = await this.prisma.category.findMany();

    const userMap = new Map<string, { id: string; email: string }>(
      users.map((item: { id: string; email: string }) => [item.email, item])
    );
    const categoryMap = new Map<string, { id: string; slug: string }>(
      categories.map((item: { id: string; slug: string }) => [item.slug, item])
    );

    const existingPosts = await this.prisma.post.findMany({
      where: {
        title: {
          in: COMMUNITY_POSTS.map((item) => item.title)
        }
      },
      select: {
        title: true
      }
    });

    const existingTitles = new Set(existingPosts.map((item: { title: string }) => item.title));

    for (const post of COMMUNITY_POSTS) {
      const author = userMap.get(post.authorEmail);
      const category = categoryMap.get(post.categorySlug);
      if (!author || !category || existingTitles.has(post.title)) continue;

      await this.prisma.post.create({
        data: {
          authorId: author.id,
          categoryId: category.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          type: post.type,
          status: "PUBLISHED",
          tags: post.tags,
          likeCount: post.likeCount,
          favoriteCount: post.favoriteCount,
          viewCount: post.viewCount
        }
      });
    }

    return this.prisma.post.findMany({
      where: {
        title: {
          in: COMMUNITY_POSTS.map((item) => item.title)
        }
      },
      orderBy: { createdAt: "asc" }
    });
  }

  private async seedRelationships(users: Array<{ id: string; email: string }>) {
    const userMap = new Map(users.map((item) => [item.email, item.id]));

    await this.prisma.follow.createMany({
      data: FOLLOW_RELATIONS
        .map((item) => {
          const followerId = userMap.get(item.followerEmail);
          const followingId = userMap.get(item.followingEmail);
          if (!followerId || !followingId) return null;
          return { followerId, followingId };
        })
        .filter((item): item is { followerId: string; followingId: string } => Boolean(item)),
      skipDuplicates: true
    });
  }

  private async seedComments(
    users: Array<{ id: string; email: string }>,
    posts: Array<{ id: string; title: string }>
  ) {
    const userMap = new Map(users.map((item) => [item.email, item.id]));
    const postMap = new Map(posts.map((item) => [item.title, item.id]));

    const createdParents = new Map<string, string>();

    for (const comment of COMMUNITY_COMMENTS) {
      const authorId = userMap.get(comment.authorEmail);
      const postId = postMap.get(comment.postTitle);
      if (!authorId || !postId) continue;

      const created = await this.prisma.comment.create({
        data: {
          postId,
          authorId,
          content: comment.content,
          status: "PUBLISHED",
          ...(comment.parentKey ? { parentId: createdParents.get(comment.parentKey) } : {})
        }
      });

      if (comment.key) {
        createdParents.set(comment.key, created.id);
      }
    }
  }

  private async seedCommentsIfNeeded(
    users: Array<{ id: string; email: string }>,
    posts: Array<{ id: string; title: string }>
  ) {
    const seededPostIds = posts.map((item) => item.id);
    if (!seededPostIds.length) return;

    const existingCount = await this.prisma.comment.count({
      where: {
        postId: {
          in: seededPostIds
        }
      }
    });

    if (!existingCount) {
      await this.seedComments(users, posts);
    }
  }

  private async seedEngagements(
    users: Array<{ id: string; email: string }>,
    posts: Array<{ id: string; title: string }>
  ) {
    const userMap = new Map(users.map((item) => [item.email, item.id]));
    const postMap = new Map(posts.map((item) => [item.title, item.id]));

    await this.prisma.postLike.createMany({
      data: LIKE_RELATIONS
        .map((item) => {
          const userId = userMap.get(item.userEmail);
          const postId = postMap.get(item.postTitle);
          if (!userId || !postId) return null;
          return { userId, postId };
        })
        .filter((item): item is { userId: string; postId: string } => Boolean(item)),
      skipDuplicates: true
    });

    await this.prisma.favorite.createMany({
      data: FAVORITE_RELATIONS
        .map((item) => {
          const userId = userMap.get(item.userEmail);
          const postId = postMap.get(item.postTitle);
          if (!userId || !postId) return null;
          return { userId, postId };
        })
        .filter((item): item is { userId: string; postId: string } => Boolean(item)),
      skipDuplicates: true
    });
  }

  private async seedNotifications(
    users: Array<{ id: string; email: string; nickname: string }>,
    posts: Array<{ id: string; title: string }>
  ) {
    const userMap = new Map(users.map((item) => [item.email, item]));
    const postMap = new Map(posts.map((item) => [item.title, item.id]));

    for (const notice of COMMUNITY_NOTIFICATIONS) {
      const user = userMap.get(notice.userEmail);
      if (!user) continue;
      await this.prisma.notification.create({
        data: {
          userId: user.id,
          title: notice.title,
          content: notice.content,
          type: notice.type,
          link: notice.postTitle ? `/posts/${postMap.get(notice.postTitle)}` : notice.link,
          entityId: notice.postTitle ? postMap.get(notice.postTitle) : undefined,
          entityType: notice.postTitle ? "post" : undefined,
          isRead: notice.isRead
        }
      });
    }
  }

  private async seedNotificationsIfNeeded(
    users: Array<{ id: string; email: string; nickname: string }>,
    posts: Array<{ id: string; title: string }>
  ) {
    const seededUserIds = users.map((item) => item.id);
    if (!seededUserIds.length) return;

    const existingCount = await this.prisma.notification.count({
      where: {
        userId: {
          in: seededUserIds
        },
        title: {
          in: COMMUNITY_NOTIFICATIONS.map((item) => item.title)
        }
      }
    });

    if (!existingCount) {
      await this.seedNotifications(users, posts);
    }
  }

  private async seedChatMessages(users: Array<{ id: string; email: string }>) {
    const channels = await this.prisma.chatChannel.findMany();
    const userMap = new Map(users.map((item) => [item.email, item.id]));
    const channelMap = new Map<string, string>(
      channels.map((item: { id: string; slug: string }) => [item.slug, item.id])
    );

    for (const message of COMMUNITY_CHAT_MESSAGES) {
      const authorId = userMap.get(message.authorEmail);
      const channelId = channelMap.get(message.channelSlug);
      if (!authorId || !channelId) continue;
      await this.prisma.chatMessage.create({
        data: {
          channelId,
          authorId,
          content: message.content,
          status: "DELIVERED"
        }
      });
    }
  }

  private async seedChatMessagesIfNeeded(users: Array<{ id: string; email: string }>) {
    const channelSlugs = COMMUNITY_CHAT_MESSAGES.map((item) => item.channelSlug);
    const channels = await this.prisma.chatChannel.findMany({
      where: {
        slug: {
          in: channelSlugs
        }
      },
      select: {
        id: true
      }
    });

    if (!channels.length) return;

    const existingCount = await this.prisma.chatMessage.count({
      where: {
        channelId: {
          in: channels.map((item: { id: string }) => item.id)
        }
      }
    });

    if (!existingCount) {
      await this.seedChatMessages(users);
    }
  }
}

const COMMUNITY_USERS: SeedUser[] = [
  {
    email: "linan@pmchat.cn",
    nickname: "林岸",
    title: "AI 产品负责人",
    bio: "在做企业 AI 工作流，长期关注 Agent 落地、知识库检索和协作效率。",
    company: "雾帆智能",
    yearsOfExp: "8 年",
    interests: ["AI产品", "Agent", "工作流"]
  },
  {
    email: "zhouzhou@pmchat.cn",
    nickname: "周周",
    title: "增长产品经理",
    bio: "负责新用户增长和活动转化，喜欢把复杂增长问题拆成可执行的小实验。",
    company: "跃迁科技",
    yearsOfExp: "6 年",
    interests: ["用户增长", "活动机制", "留存"]
  },
  {
    email: "momo@pmchat.cn",
    nickname: "MoMo",
    title: "B端产品经理",
    bio: "主要做后台、流程和权限系统，对复杂场景梳理和产品交付比较敏感。",
    company: "星阙云服",
    yearsOfExp: "7 年",
    interests: ["B端产品", "权限系统", "后台设计"]
  },
  {
    email: "wanqing@pmchat.cn",
    nickname: "晚晴",
    title: "策略产品经理",
    bio: "偏商业分析和产品方向判断，习惯从行业结构和用户需求两侧看产品机会。",
    company: "北塔创新",
    yearsOfExp: "9 年",
    interests: ["策略产品", "商业分析", "赛道研究"]
  },
  {
    email: "qinghe@pmchat.cn",
    nickname: "清禾",
    title: "C端体验产品经理",
    bio: "做过内容和社区产品，比较在意体验细节、内容流节奏和创作者工具。",
    company: "西窗内容",
    yearsOfExp: "5 年",
    interests: ["C端产品", "社区产品", "内容体验"]
  },
  {
    email: "jiaqi@pmchat.cn",
    nickname: "嘉祺",
    title: "产品运营",
    bio: "负责内容运营和社区氛围，擅长把冷启动社区做出活人感和持续参与感。",
    company: "有光社区",
    yearsOfExp: "4 年",
    interests: ["产品运营", "社区运营", "内容策划"]
  }
];

const COMMUNITY_POSTS: SeedPost[] = [
  {
    title: "AI 工作流产品到底该先做通用能力，还是先做场景闭环？",
    type: "DISCUSSION",
    authorEmail: "linan@pmchat.cn",
    categorySlug: "ai-data",
    tags: ["Agent", "工作流", "产品策略"],
    excerpt: "如果资源有限，先做模型能力平台，还是先做一个高频闭环场景，更容易跑出真实价值？",
    likeCount: 18,
    favoriteCount: 9,
    viewCount: 436,
    content:
      "最近在推进企业 AI 工作流产品，团队内部争论很大。\n\n一派认为应该先把模型调用、知识库、流程编排这些底层能力抽象好，再让业务团队自己搭；另一派认为冷启动期最重要的是先做通一个高频场景，比如客服知识问答、售前材料生成或周报自动汇总。\n\n我自己的判断是：如果没有明确且高频的业务闭环，单纯做底层平台很容易陷入“看起来能力很多，但没有人持续用”的状态；但如果场景做得太窄，又担心后续扩展成本高。\n\n想听听大家在做 AI 产品时，是怎么判断平台化与场景化优先级的。"
  },
  {
    title: "B端权限系统重构时，哪些规则一定不能后补？",
    type: "ARTICLE",
    authorEmail: "momo@pmchat.cn",
    categorySlug: "b-end",
    tags: ["权限系统", "B端产品", "后台设计"],
    excerpt: "权限系统最怕的不是复杂，而是前期没把边界想清楚，后面只能一层层打补丁。",
    likeCount: 25,
    favoriteCount: 17,
    viewCount: 692,
    content:
      "权限系统改造常见的坑，不在于模型本身，而在于产品前期没有把数据边界、操作边界和角色边界拆清楚。\n\n我比较建议在重构前，先把 4 件事定下来：\n1. 主体是谁：用户、岗位、部门还是外部协作者。\n2. 资源是什么：页面、菜单、数据、操作按钮还是审批流节点。\n3. 控制维度是什么：看、编、删、导出、审批、转交是否拆开。\n4. 例外怎么处理：跨组织、跨角色、临时授权和代理权限能不能落进同一套规则。\n\n这四件事不定，后面再补只会越来越痛。"
  },
  {
    title: "内容社区首页为什么容易越做越像信息垃圾场？",
    type: "ARTICLE",
    authorEmail: "qinghe@pmchat.cn",
    categorySlug: "c-end",
    tags: ["社区产品", "内容流", "体验设计"],
    excerpt: "首页不是内容越多越好，而是要把用户最常返回的理由摆清楚。",
    likeCount: 21,
    favoriteCount: 14,
    viewCount: 531,
    content:
      "很多社区首页一开始很克制，后来为了“丰富”不断往上叠模块，结果首页越来越像信息垃圾场。\n\n首页最重要的不是塞多少东西，而是解决三个问题：\n1. 用户一眼能不能知道现在有什么值得看。\n2. 老用户回来的高频动作能不能两步内完成。\n3. 新用户在没有关注关系时，也能不能快速找到内容入口。\n\n所以我现在做首页会优先保证：主内容流、工作台入口、热门标签、实时活跃信号，这四件事的层级最稳定。"
  },
  {
    title: "增长实验做了一堆，为什么团队还是没有增长感？",
    type: "DISCUSSION",
    authorEmail: "zhouzhou@pmchat.cn",
    categorySlug: "growth",
    tags: ["增长", "实验设计", "团队协作"],
    excerpt: "很多时候不是实验做得不够，而是团队没有统一的增长叙事和复盘口径。",
    likeCount: 16,
    favoriteCount: 8,
    viewCount: 388,
    content:
      "最近发现一个很有意思的问题：团队每周都在做增长实验，但所有人都觉得“没什么增长感”。\n\n往下拆会发现两个根因：\n1. 实验指标只停留在活动页或某个转化环节，没人把实验和整体目标串起来。\n2. 复盘方式过于流水账，知道做了什么，但不知道哪些动作值得继续放大。\n\n所以我现在会强制要求：每个实验都要有统一目标、统一口径、统一复盘模板，不然实验越多，组织越疲劳。"
  },
  {
    title: "产品经理做策略分析时，最容易高估什么？",
    type: "QUESTION",
    authorEmail: "wanqing@pmchat.cn",
    categorySlug: "strategy",
    tags: ["策略产品", "商业分析", "机会判断"],
    excerpt: "我越来越觉得，策略分析最容易高估的是自己对市场规模的理解，而不是竞品动作。",
    likeCount: 13,
    favoriteCount: 7,
    viewCount: 274,
    content:
      "最近在做一个新方向判断，发现很多分析文档写得很满，但最后真正能指导决策的信息很少。\n\n我自己的体感是：策略分析最容易高估的不是竞品动作，而是自己对市场规模、用户付费意愿和替代路径的理解。\n\n想问问大家，在做新方向评估时，最容易被哪些“看起来很合理”的信息带偏？"
  },
  {
    title: "社区冷启动阶段，先做内容还是先做关系？",
    type: "QUESTION",
    authorEmail: "jiaqi@pmchat.cn",
    categorySlug: "operation",
    tags: ["社区运营", "冷启动", "用户关系"],
    excerpt: "如果首批种子用户进来什么都看不到，再好的视觉也留不住人。",
    likeCount: 30,
    favoriteCount: 23,
    viewCount: 745,
    content:
      "最近在搭一个产品经理交流社区，最明显的感受就是：如果首批用户进来后什么都看不到，留存会非常差。\n\n所以我在冷启动期会优先做三类事情：\n1. 提前准备能激发讨论的内容种子。\n2. 让不同方向的用户都能找到熟悉入口。\n3. 用聊天、通知、作者页这些轻关系结构把社区活人感做出来。\n\n问题是，资源有限时，到底应该先把内容铺起来，还是先让一批用户互相关注、互相评论，把关系网络点亮？"
  },
  {
    title: "我把 PRD 评审方式从“过文档”改成“过风险”，团队效率反而高了",
    type: "ARTICLE",
    authorEmail: "linan@pmchat.cn",
    categorySlug: "ai-data",
    tags: ["PRD", "评审", "协作效率"],
    excerpt: "与其逐段过文档，不如把时间集中在最容易出问题的边界、状态和异常处理上。",
    likeCount: 19,
    favoriteCount: 12,
    viewCount: 418,
    content:
      "以前做评审时，大家习惯按文档顺序一段一段过，结果经常开很久会，真正重要的风险反而没聊透。\n\n后来我改成了“过风险”的方式：\n1. 先看目标和范围是否一致。\n2. 再看状态流转、异常路径和风控规则。\n3. 最后再补具体文案、页面和展示细节。\n\n这个方式特别适合复杂业务，因为它能让团队优先对齐真正会导致返工的部分。"
  },
  {
    title: "后台复杂筛选为什么经常让用户越用越烦？",
    type: "DISCUSSION",
    authorEmail: "momo@pmchat.cn",
    categorySlug: "b-end",
    tags: ["后台产品", "筛选器", "体验优化"],
    excerpt: "筛选器的问题常常不是功能少，而是用户每次都得重新组织条件。",
    likeCount: 14,
    favoriteCount: 6,
    viewCount: 309,
    content:
      "很多后台系统的筛选能力其实不少，但用户还是觉得难用，原因通常有两个：\n\n一是筛选条件太像数据库结构，而不是用户的工作语言。\n二是用户上一次筛的结果完全不被记住，每次都要重新组织。\n\n如果你也在做后台，强烈建议把“最近筛选”“固定视图”“可读筛选摘要”这三件事一起补上。"
  },
  {
    title: "如果你在做 PM 社区，什么功能会让你愿意连续用一个月？",
    type: "DISCUSSION",
    authorEmail: "qinghe@pmchat.cn",
    categorySlug: "c-end",
    tags: ["社区产品", "连续使用", "功能优先级"],
    excerpt: "真正让人留下来的，往往不是花哨功能，而是稳定的信息流、关系感和低成本表达。",
    likeCount: 28,
    favoriteCount: 15,
    viewCount: 582,
    content:
      "如果把自己放到一个深度用户的位置，你会愿意连续用一个 PM 社区一个月的原因到底是什么？\n\n我自己的答案是：\n1. 首页每天回来都有值得看的内容。\n2. 想说话时能低成本表达，不想发长文也能参与。\n3. 自己的内容、收藏、评论、通知都能形成沉淀。\n\n很好奇大家的优先级排序。"
  }
];

const COMMUNITY_COMMENTS = [
  {
    key: "comment-1",
    authorEmail: "zhouzhou@pmchat.cn",
    postTitle: "AI 工作流产品到底该先做通用能力，还是先做场景闭环？",
    content: "我站先做场景闭环。增长侧的经验是，没有被持续使用的核心场景，再好的平台能力也很难建立组织共识。"
  },
  {
    authorEmail: "wanqing@pmchat.cn",
    postTitle: "AI 工作流产品到底该先做通用能力，还是先做场景闭环？",
    parentKey: "comment-1",
    content: "同意，而且场景闭环还能反过来逼出真正需要被平台化的能力，不会一开始就抽象过度。"
  },
  {
    key: "comment-2",
    authorEmail: "jiaqi@pmchat.cn",
    postTitle: "社区冷启动阶段，先做内容还是先做关系？",
    content: "冷启动期我会优先做内容种子，但这些内容最好能天然带出互动，而不是纯知识库。"
  },
  {
    authorEmail: "qinghe@pmchat.cn",
    postTitle: "社区冷启动阶段，先做内容还是先做关系？",
    parentKey: "comment-2",
    content: "对，纯内容没有关系承接时很像只读站，用户看完就走。"
  },
  {
    key: "comment-3",
    authorEmail: "linan@pmchat.cn",
    postTitle: "我把 PRD 评审方式从“过文档”改成“过风险”，团队效率反而高了",
    content: "这个思路非常实用，尤其是复杂系统里，边界和异常比页面文案重要太多。"
  },
  {
    key: "comment-4",
    authorEmail: "momo@pmchat.cn",
    postTitle: "后台复杂筛选为什么经常让用户越用越烦？",
    content: "最近刚做完一轮后台筛选改版，固定视图和最近筛选确实是最能立刻见效的两个点。"
  },
  {
    authorEmail: "zhouzhou@pmchat.cn",
    postTitle: "增长实验做了一堆，为什么团队还是没有增长感？",
    content: "我们后来把所有实验按同一套增长目标树归档，大家才第一次对“哪些实验有战略价值”有共同语言。"
  },
  {
    authorEmail: "linan@pmchat.cn",
    postTitle: "如果你在做 PM 社区，什么功能会让你愿意连续用一个月？",
    content: "对我来说是稳定内容流 + 茶水间 + 个人沉淀，这三块一起在，才有每天回来的理由。"
  }
] as Array<{
  key?: string;
  parentKey?: string;
  authorEmail: string;
  postTitle: string;
  content: string;
}>;

const FOLLOW_RELATIONS = [
  { followerEmail: "zhouzhou@pmchat.cn", followingEmail: "linan@pmchat.cn" },
  { followerEmail: "qinghe@pmchat.cn", followingEmail: "jiaqi@pmchat.cn" },
  { followerEmail: "linan@pmchat.cn", followingEmail: "momo@pmchat.cn" },
  { followerEmail: "momo@pmchat.cn", followingEmail: "wanqing@pmchat.cn" },
  { followerEmail: "jiaqi@pmchat.cn", followingEmail: "qinghe@pmchat.cn" },
  { followerEmail: "wanqing@pmchat.cn", followingEmail: "linan@pmchat.cn" }
];

const LIKE_RELATIONS = [
  { userEmail: "zhouzhou@pmchat.cn", postTitle: "内容社区首页为什么容易越做越像信息垃圾场？" },
  { userEmail: "jiaqi@pmchat.cn", postTitle: "内容社区首页为什么容易越做越像信息垃圾场？" },
  { userEmail: "qinghe@pmchat.cn", postTitle: "社区冷启动阶段，先做内容还是先做关系？" },
  { userEmail: "linan@pmchat.cn", postTitle: "社区冷启动阶段，先做内容还是先做关系？" },
  { userEmail: "wanqing@pmchat.cn", postTitle: "产品经理做策略分析时，最容易高估什么？" },
  { userEmail: "momo@pmchat.cn", postTitle: "我把 PRD 评审方式从“过文档”改成“过风险”，团队效率反而高了" },
  { userEmail: "qinghe@pmchat.cn", postTitle: "如果你在做 PM 社区，什么功能会让你愿意连续用一个月？" }
];

const FAVORITE_RELATIONS = [
  { userEmail: "jiaqi@pmchat.cn", postTitle: "B端权限系统重构时，哪些规则一定不能后补？" },
  { userEmail: "zhouzhou@pmchat.cn", postTitle: "我把 PRD 评审方式从“过文档”改成“过风险”，团队效率反而高了" },
  { userEmail: "linan@pmchat.cn", postTitle: "内容社区首页为什么容易越做越像信息垃圾场？" },
  { userEmail: "momo@pmchat.cn", postTitle: "增长实验做了一堆，为什么团队还是没有增长感？" },
  { userEmail: "qinghe@pmchat.cn", postTitle: "后台复杂筛选为什么经常让用户越用越烦？" }
];

const COMMUNITY_NOTIFICATIONS = [
  {
    userEmail: "linan@pmchat.cn",
    title: "你的讨论收到新回复",
    content: "周周回复了《AI 工作流产品到底该先做通用能力，还是先做场景闭环？》",
    type: "COMMENT" as const,
    postTitle: "AI 工作流产品到底该先做通用能力，还是先做场景闭环？",
    isRead: false
  },
  {
    userEmail: "jiaqi@pmchat.cn",
    title: "你的问题收到新回复",
    content: "清禾回复了《社区冷启动阶段，先做内容还是先做关系？》",
    type: "COMMENT" as const,
    postTitle: "社区冷启动阶段，先做内容还是先做关系？",
    isRead: false
  },
  {
    userEmail: "qinghe@pmchat.cn",
    title: "有人关注了你",
    content: "嘉祺开始关注你了",
    type: "FOLLOW" as const,
    link: "/me",
    isRead: true
  },
  {
    userEmail: "momo@pmchat.cn",
    title: "你的文章被加入收藏",
    content: "有成员收藏了《B端权限系统重构时，哪些规则一定不能后补？》",
    type: "SYSTEM" as const,
    postTitle: "B端权限系统重构时，哪些规则一定不能后补？",
    isRead: true
  }
];

const COMMUNITY_CHAT_MESSAGES = [
  {
    channelSlug: "general",
    authorEmail: "qinghe@pmchat.cn",
    content: "刚把首页信息层级重新收了一轮，最大的感受是：深度用户其实不需要那么多解释，只需要稳定入口。"
  },
  {
    channelSlug: "general",
    authorEmail: "jiaqi@pmchat.cn",
    content: "是的，社区最怕用户第一次进来就看到空白页，视觉再好也很难留住人。"
  },
  {
    channelSlug: "job",
    authorEmail: "zhouzhou@pmchat.cn",
    content: "最近面了几个增长岗，发现大家越来越看重实验设计和复盘能力，不只是写需求。"
  },
  {
    channelSlug: "job",
    authorEmail: "wanqing@pmchat.cn",
    content: "策略岗也是，行业理解和结构化判断能力比“会不会画原型”重要得多。"
  },
  {
    channelSlug: "ask",
    authorEmail: "momo@pmchat.cn",
    content: "大家做权限系统时，临时授权一般怎么设计回收机制？我最近在补这个坑。"
  },
  {
    channelSlug: "ask",
    authorEmail: "linan@pmchat.cn",
    content: "我们是做显式到期时间 + 续期审批，不然临时权限很容易变成永久权限。"
  },
  {
    channelSlug: "rumor",
    authorEmail: "jiaqi@pmchat.cn",
    content: "这两天明显感觉 AI 产品岗位讨论热起来了，不过真正有预算和真实场景的团队还是少数。"
  },
  {
    channelSlug: "rumor",
    authorEmail: "qinghe@pmchat.cn",
    content: "而且很多团队嘴上说做社区，最后还是在做内容站，活人感完全起不来。"
  }
];
