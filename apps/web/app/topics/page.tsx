import Link from "next/link";

const categories = [
  { icon: "📱", name: "C端产品", desc: "消费互联网、电商、社交等产品", count: "1.2k" },
  { icon: "🏢", name: "B端产品", desc: "企业服务、SaaS、ERP等产品", count: "980" },
  { icon: "🤖", name: "AI产品", desc: "大模型应用、AI工具等产品", count: "1.5k" },
  { icon: "📊", name: "数据产品", desc: "数据平台、BI分析等产品", count: "750" },
  { icon: "🎯", name: "策略产品", desc: "增长策略、变现策略等产品", count: "620" },
  { icon: "📦", name: "硬件产品", desc: "智能硬件、IoT设备等产品", count: "380" },
  { icon: "🌏", name: "出海产品", desc: "跨境电商、海外市场产品", count: "890" },
  { icon: "📋", name: "其他产品", desc: "其他领域产品经理话题", count: "450" },
];

const posts = [
  {
    id: "1",
    title: "B端和C端产品经理的核心差异是什么？",
    excerpt: "在转型B端产品的过程中，发现两个方向对能力模型的要求差异很大。比如C端更注重用户体验和数据驱动...",
    author: "产品汪小明",
    authorTitle: "高级产品经理",
    category: "B端产品",
    tags: ["职业发展", "B端", "转型"],
    date: "2026-04-10",
    likes: 156,
    comments: 42,
    views: "2.3k",
  },
  {
    id: "2",
    title: "AI产品经理需要掌握哪些技能？",
    excerpt: "随着AI浪潮席卷，各行各业都在布局AI产品。作为PM，我们应该具备哪些核心能力来把握这波机会...",
    author: "AI产品人",
    authorTitle: "AI产品负责人",
    category: "AI产品",
    tags: ["AI", "技能树", "职业规划"],
    date: "2026-04-09",
    likes: 289,
    comments: 67,
    views: "3.8k",
  },
  {
    id: "3",
    title: "如何优雅地拒绝产品需求变更？",
    excerpt: "需求变更几乎是每个PM都会遇到的难题。分享几个我用过比较好用的拒绝方式，既不伤和气，又能...",
    author: "摸鱼PM",
    authorTitle: "资深产品经理",
    category: "C端产品",
    tags: ["职场", "需求管理", "沟通技巧"],
    date: "2026-04-08",
    likes: 198,
    comments: 55,
    views: "2.1k",
  },
];

export default function TopicsPage() {
  return (
    <div className="page-container">
      {/* Hero */}
      <section className="page-hero products">
        <div className="page-hero-content">
          <div className="page-hero-icon">📦</div>
          <div className="page-hero-text">
            <h1>产品分类</h1>
            <p>按领域沉淀的知识库，找同行交流讨论</p>
          </div>
        </div>
        <div className="page-search">
          <input type="text" placeholder="搜索产品相关内容..." />
          <button>搜索</button>
        </div>
      </section>

      {/* 分类卡片 */}
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.name} className="category-card products">
            <div className="category-bar"></div>
            <div className="category-icon">{cat.icon}</div>
            <h3 className="category-name">{cat.name}</h3>
            <p className="category-desc">{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* 工具栏 */}
      <div className="page-toolbar">
        <div className="toolbar-tabs">
          <Link href="/topics" className="toolbar-tab products active">全部</Link>
          <Link href="?tab=C端产品" className="toolbar-tab products">C端产品</Link>
          <Link href="?tab=B端产品" className="toolbar-tab products">B端产品</Link>
          <Link href="?tab=AI产品" className="toolbar-tab products">AI产品</Link>
          <Link href="?tab=数据产品" className="toolbar-tab products">数据产品</Link>
          <Link href="?tab=策略产品" className="toolbar-tab products">策略产品</Link>
        </div>
        <div className="toolbar-sorts">
          <button className="sort-btn active">最新</button>
          <button className="sort-btn">最热</button>
          <button className="sort-btn">推荐</button>
        </div>
      </div>

      {/* 帖子列表 */}
      <div className="feed-list">
        {posts.map((post, index) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="feed-card">
            <div className="feed-card-header">
              <div className={`feed-avatar avatar-${index % 5}`}>
                {post.author.slice(0, 1)}
              </div>
              <div className="feed-author">
                <div className="feed-author-name">
                  <strong>{post.author}</strong>
                  <span className="feed-badge products">{post.authorTitle}</span>
                </div>
                <div className="feed-meta">{post.date}</div>
              </div>
              <span className="feed-badge products">{post.category}</span>
            </div>
            <h3 className="feed-card-title">{post.title}</h3>
            <p className="feed-card-excerpt">{post.excerpt}</p>
            <div className="feed-card-footer">
              <div className="feed-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="feed-tag">{tag}</span>
                ))}
              </div>
              <div className="feed-stats">
                <span className="feed-stat">👍 {post.likes}</span>
                <span className="feed-stat">💬 {post.comments}</span>
                <span className="feed-stat">👁️ {post.views}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
