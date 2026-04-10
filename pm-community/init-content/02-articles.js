// ============================================
// PM社区 初始文章数据
// 使用说明：将此数据注入到首页文章列表中
// ============================================

const INITIAL_ARTICLES = [
    {
        id: "a001",
        title: "B端产品经理面试指南：如何回答「你如何证明自己适合B端」",
        excerpt: "很多同学转型B端时都会遇到这个问题，其实面试官想考察的是你对B端产品本质的理解...",
        author: INITIAL_USERS[0], // 李产品
        category: "B端产品",
        tags: ["面试", "B端", "转型"],
        views: 3256,
        likes: 189,
        comments: 42,
        createdAt: "2026-04-08T10:30:00",
        isHot: true,
        cover: "https://picsum.photos/seed/pm1/800/400"
    },
    {
        id: "a002",
        title: "竞品分析不是抄作业：我是如何做出一份让老板眼前一亮的竞品报告",
        excerpt: "上次发了一篇竞品分析模板，很多同学私信问具体怎么写。今天结合我实际的竞品分析案例...",
        author: INITIAL_USERS[2], // 张策略
        category: "方法论",
        tags: ["竞品分析", "方法", "模板"],
        views: 4521,
        likes: 312,
        comments: 78,
        createdAt: "2026-04-07T15:20:00",
        isHot: true,
        cover: "https://picsum.photos/seed/pm2/800/400"
    },
    {
        id: "a003",
        title: "用户增长必备：拆解拼多多如何用「砍一刀」撬动3亿用户",
        excerpt: "很多人说拼多多的增长靠的是低价和微信流量，但我觉得最核心的是对人性弱点的精准把控...",
        author: INITIAL_USERS[6], // 孙运营
        category: "用户增长",
        tags: ["增长", "案例", "拼多多"],
        views: 8932,
        likes: 567,
        comments: 134,
        createdAt: "2026-04-06T09:15:00",
        isHot: true,
        cover: "https://picsum.photos/seed/pm3/800/400"
    },
    {
        id: "a004",
        title: "PRD写作避坑指南：我见过的最差的10种PRD写法",
        excerpt: "最近review团队的PRD，发现很多新人的PRD写得千奇百怪。今天来盘点一下那些让人头疼的PRD...",
        author: INITIAL_USERS[0], // 李产品
        category: "工具模板",
        tags: ["PRD", "文档", "避坑"],
        views: 2156,
        likes: 198,
        comments: 56,
        createdAt: "2026-04-05T14:00:00",
        isHot: false,
        cover: "https://picsum.photos/seed/pm4/800/400"
    },
    {
        id: "a005",
        title: "数据产品经理：从0到1搭建数据指标体系的方法论",
        excerpt: "数据指标体系是数据产品经理的核心能力之一。今天分享我常用的四步法...",
        author: INITIAL_USERS[4], // 刘数据
        category: "数据产品",
        tags: ["数据", "指标体系", "方法"],
        views: 1890,
        likes: 145,
        comments: 38,
        createdAt: "2026-04-04T11:30:00",
        isHot: false,
        cover: "https://picsum.photos/seed/pm5/800/400"
    },
    {
        id: "a006",
        title: "C端转B端这一年：我的思考、踩坑与收获",
        excerpt: "从C端转到B端整整一年了，从最初的迷茫到现在找到感觉，踩过很多坑，也有很多思考...",
        author: INITIAL_USERS[3], // 陈小白
        category: "职业发展",
        tags: ["转型", "B端", "C端", "感悟"],
        views: 6789,
        likes: 423,
        comments: 92,
        createdAt: "2026-04-03T20:45:00",
        isHot: false,
        cover: "https://picsum.photos/seed/pm6/800/400"
    },
    {
        id: "a007",
        title: "Axure进阶技巧：如何做出一份专业度爆棚的原型",
        excerpt: "很多PM的原型看起来很糙，其实不是功能没实现，而是一些小细节没处理好...",
        author: INITIAL_USERS[5], // 赵设计
        category: "工具模板",
        tags: ["Axure", "原型", "技巧"],
        views: 1543,
        likes: 112,
        comments: 29,
        createdAt: "2026-04-02T16:20:00",
        isHot: false,
        cover: "https://picsum.photos/seed/pm7/800/400"
    },
    {
        id: "a008",
        title: "35岁产品经理的出路在哪里？我访谈了10位从业者",
        excerpt: "最近很多同学问我35岁之后PM还能干什么，我花了两个月时间访谈了10位前辈...",
        author: INITIAL_USERS[7], // 周经验
        category: "职业发展",
        tags: ["职业规划", "35岁", "转型"],
        views: 12456,
        likes: 892,
        comments: 203,
        createdAt: "2026-04-01T08:00:00",
        isHot: true,
        cover: "https://picsum.photos/seed/pm8/800/400"
    },
    {
        id: "a009",
        title: "AI时代产品经理的新机遇：我是如何用ChatGPT提升10倍效率的",
        excerpt: "ChatGPT发布一年了，我算是重度用户了。今天来聊聊AI如何重塑PM的工作方式...",
        author: INITIAL_USERS[8], // 吴技术
        category: "AI应用",
        tags: ["AI", "效率", "ChatGPT"],
        views: 7890,
        likes: 534,
        comments: 118,
        createdAt: "2026-03-30T12:00:00",
        isHot: false,
        cover: "https://picsum.photos/seed/pm9/800/400"
    },
    {
        id: "a010",
        title: "面试作品集怎么做？附赠我的作品集框架模板",
        excerpt: "很多同学问我面试PM岗位需要准备作品集吗？答案是肯定的，而且好的作品集能让你脱颖而出...",
        author: INITIAL_USERS[9], // 郑求职
        category: "求职技巧",
        tags: ["面试", "作品集", "模板"],
        views: 4567,
        likes: 345,
        comments: 87,
        createdAt: "2026-03-28T18:30:00",
        isHot: false,
        cover: "https://picsum.photos/seed/pm10/800/400"
    }
];

console.log('✅ 文章数据准备完成，共 ' + INITIAL_ARTICLES.length + ' 篇');
