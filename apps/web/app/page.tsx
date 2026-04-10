"use client";

import Link from "next/link";

// 模拟帖子数据
const posts = [
  {
    id: 1,
    title: "B端后台产品经理如何突破职业瓶颈？",
    author: "产品小王",
    avatar: "👨‍💼",
    tag: "职业发展",
    tagType: "default",
    time: "10分钟前",
    votes: 42,
    replies: 28,
    views: 1256,
  },
  {
    id: 2,
    title: "求推荐：适合产品经理用的数据可视化工具",
    author: "数据派",
    avatar: "📊",
    tag: "工具推荐",
    tagType: "toolbox",
    time: "25分钟前",
    votes: 18,
    replies: 15,
    views: 456,
  },
  {
    id: 3,
    title: "创业公司产品经理的一天是怎么过的？",
    author: "创业者老张",
    avatar: "🚀",
    tag: "闲聊",
    tagType: "chat",
    time: "1小时前",
    votes: 89,
    replies: 56,
    views: 2341,
  },
  {
    id: 4,
    title: "PRD文档写作规范与模板分享",
    author: "文档达人",
    avatar: "📝",
    tag: "资源分享",
    tagType: "default",
    time: "2小时前",
    votes: 156,
    replies: 42,
    views: 5620,
  },
  {
    id: 5,
    title: "AIGC时代，产品经理需要具备哪些新能力？",
    author: "AI探索者",
    avatar: "🤖",
    tag: "AI产品",
    tagType: "default",
    time: "3小时前",
    votes: 203,
    replies: 89,
    views: 8932,
  },
  {
    id: 6,
    title: "面试被问到「你最大的缺点是什么」，怎么回答比较好？",
    author: "求职中",
    avatar: "🎯",
    tag: "求职面试",
    tagType: "default",
    time: "4小时前",
    votes: 67,
    replies: 34,
    views: 3210,
  },
  {
    id: 7,
    title: "大家平时用什么工具画原型？Figma还是Axure？",
    author: "设计师小李",
    avatar: "🎨",
    tag: "工具讨论",
    tagType: "toolbox",
    time: "5小时前",
    votes: 91,
    replies: 67,
    views: 4532,
  },
  {
    id: 8,
    title: "如何优雅地拒绝产品需求？",
    author: "老油条",
    avatar: "😎",
    tag: "职场生存",
    tagType: "default",
    time: "6小时前",
    votes: 234,
    replies: 78,
    views: 12000,
  },
];

export default function HomePage() {
  return (
    <div className="main-layout">
      {/* 左侧导航 */}
      <aside className="left-nav">
        <div className="nav-logo">
          <h1>PM茶水间</h1>
          <span>产品经理的聚集地</span>
        </div>

        <nav className="nav-section">
          <div className="nav-section-title">首页</div>
          <Link href="/" className="nav-item active">
            <span className="nav-item-icon">🏠</span>
            <span>全部帖子</span>
            <span className="nav-item-count">1.2k</span>
          </Link>
        </nav>

        <nav className="nav-section">
          <div className="nav-section-title">产品分类</div>
          <Link href="/topics" className="nav-item">
            <span className="nav-item-icon">📦</span>
            <span>产品分类</span>
          </Link>
          <Link href="/topics" className="nav-item">
            <span className="nav-item-icon">💼</span>
            <span>B端产品</span>
          </Link>
          <Link href="/topics" className="nav-item">
            <span className="nav-item-icon">📱</span>
            <span>C端产品</span>
          </Link>
          <Link href="/topics" className="nav-item">
            <span className="nav-item-icon">🤖</span>
            <span>AI产品</span>
          </Link>
        </nav>

        <nav className="nav-section">
          <div className="nav-section-title">社区</div>
          <Link href="/chat" className="nav-item">
            <span className="nav-item-icon">💬</span>
            <span>闲聊话题</span>
          </Link>
          <Link href="/toolbox" className="nav-item">
            <span className="nav-item-icon">🛠️</span>
            <span>工具集合</span>
          </Link>
        </nav>

        <nav className="nav-section">
          <div className="nav-section-title">账号</div>
          <Link href="#" className="nav-item">
            <span className="nav-item-icon">📧</span>
            <span>登录 / 注册</span>
          </Link>
        </nav>

        <div className="nav-user">
          <div className="nav-user-info">
            <div className="nav-avatar">游</div>
            <div className="nav-user-name">
              <strong>游客用户</strong>
              <span>登录后参与讨论</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="main-content">
        <header className="content-header">
          <h2>全部帖子</h2>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="搜索帖子..."
            />
          </div>
        </header>

        <div className="content-body">
          <div className="post-list">
            {posts.map((post) => (
              <article key={post.id} className="post-item">
                <div className="post-avatar">{post.avatar}</div>
                <div className="post-main">
                  <Link href={`/post/${post.id}`} className="post-title">
                    {post.title}
                  </Link>
                  <div className="post-meta">
                    <span className={`post-tag ${post.tagType}`}>
                      {post.tag}
                    </span>
                    <span className="post-author">{post.author}</span>
                    <span className="post-time">{post.time}</span>
                  </div>
                </div>
                <div className="post-stats">
                  <span className="post-stat">
                    <span>💬</span>
                    {post.replies}
                  </span>
                  <span className="post-stat">
                    <span>👁️</span>
                    {post.views}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* 分页 */}
          <div className="pagination">
            <button className="page-btn">上一页</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">...</button>
            <button className="page-btn">50</button>
            <button className="page-btn">下一页</button>
          </div>
        </div>
      </main>

      {/* 右侧边栏 */}
      <aside className="right-rail">
        {/* 发帖按钮 */}
        <button className="new-post-btn">
          <span>✏️</span>
          <span>发布新帖</span>
        </button>

        {/* 登录卡片 */}
        <div className="rail-card login-card">
          <p>登录后可发布帖子、参与讨论</p>
          <button className="login-btn">登录 / 注册</button>
        </div>

        {/* 快捷入口 */}
        <div className="rail-card">
          <div className="rail-card-title">
            <span>⚡</span>
            快捷入口
          </div>
          <div className="quick-links">
            <Link href="/topics" className="quick-link">
              <span className="quick-link-icon">📦</span>
              <span>产品分类</span>
            </Link>
            <Link href="/chat" className="quick-link">
              <span className="quick-link-icon">💬</span>
              <span>闲聊话题</span>
            </Link>
            <Link href="/toolbox" className="quick-link">
              <span className="quick-link-icon">🛠️</span>
              <span>工具集合</span>
            </Link>
          </div>
        </div>

        {/* 热门话题 */}
        <div className="rail-card">
          <div className="rail-card-title">
            <span>🔥</span>
            热门话题
          </div>
          <div className="hot-topics">
            <div className="hot-topic">
              <span className="hot-topic-num">1</span>
              <span className="hot-topic-title">产品经理简历怎么写</span>
              <span className="hot-topic-count">2.3k</span>
            </div>
            <div className="hot-topic">
              <span className="hot-topic-num">2</span>
              <span className="hot-topic-title">AIGC工具盘点</span>
              <span className="hot-topic-count">1.8k</span>
            </div>
            <div className="hot-topic">
              <span className="hot-topic-num">3</span>
              <span className="hot-topic-title">B端vsC端产品经理</span>
              <span className="hot-topic-count">1.5k</span>
            </div>
            <div className="hot-topic">
              <span className="hot-topic-num">4</span>
              <span className="hot-topic-title">需求评审怎么做</span>
              <span className="hot-topic-count">1.2k</span>
            </div>
            <div className="hot-topic">
              <span className="hot-topic-num">5</span>
              <span className="hot-topic-title">PRD模板推荐</span>
              <span className="hot-topic-count">980</span>
            </div>
          </div>
        </div>

        {/* 社区规范 */}
        <div className="rail-card">
          <div className="rail-card-title">
            <span>📋</span>
            社区规范
          </div>
          <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: 1.8 }}>
            <li>友善交流，互相尊重</li>
            <li>禁止发布广告、软文</li>
            <li>优质内容优先展示</li>
            <li>禁止人身攻击、阴阳怪气</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
