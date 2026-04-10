"use client";

import { useState } from "react";
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
    preview: "做了3年B端产品，感觉遇到了天花板。每天就是画原型、写PRD，和开发撕需求。想转C端但又担心经验不匹配...有没有大佬有类似经历可以分享下？",
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
    preview: "领导让我做一个数据看板展示给客户看，要求既能看数据趋势，又要做得很炫酷。有什么工具可以快速上手？",
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
    preview: "刚从大厂跳到创业公司，节奏完全不一样了。之前每天按排期走，现在恨不得一个人当三个人用...",
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
    preview: "整理了一份内部使用的PRD模板，包含需求背景、功能列表、原型链接、验收标准等模块，直接可用！",
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
    preview: "最近在研究怎么用AI提效，发现Prompt工程能力很重要。还有什么能力是PM在AI时代需要重点培养的？",
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
    preview: "投了几个大厂，面试都挂在这个问题上。说太真诚显得没能力，说太圆滑又显得不真诚，到底该怎么回答？",
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
    preview: "公司之前用Axure，但最近大家都在说Figma。想问问各位PM的真实使用体验，哪个更适合产品经理快速出原型？",
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
    preview: "运营天天提需求，技术说做不了，老板说必须上...夹在中间太难了。有什么高情商拒绝需求的方法吗？",
  },
];

// 社交证明数据
const socialProofItems = [
  { name: "李产品", action: "刚刚加入了社区" },
  { name: "王经理", action: "发布了新帖子" },
  { name: "张PM", action: "回复了热门话题" },
  { name: "赵总监", action: "刚刚加入了社区" },
  { name: "刘设计", action: "发布了新帖子" },
  { name: "陈产品", action: "收藏了工具合集" },
  { name: "周经理", action: "刚刚加入了社区" },
  { name: "吴PM", action: "回复了热门话题" },
];

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<typeof posts[0] | null>(null);

  const hotPost = posts[4]; // AIGC那个最热

  return (
    <div className="main-layout">
      {/* 顶部公告栏 */}
      <div className="top-banner">
        <div className="top-banner-content">
          <span>🎉</span>
          <span>PM茶水间全新升级，<strong>产品经理的聚集地</strong></span>
        </div>
      </div>

      {/* 社交证明滚动 */}
      <div className="social-proof-bar">
        <div className="social-proof-track">
          {[...socialProofItems, ...socialProofItems].map((item, i) => (
            <div key={i} className="social-proof-item">
              <div className="proof-avatar">{item.name[0]}</div>
              <span>
                <strong>{item.name}</strong> {item.action}
              </span>
            </div>
          ))}
        </div>
      </div>

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
          <Link href="#" className="nav-item" onClick={(e) => { e.preventDefault(); setDrawerOpen(true); }}>
            <span className="nav-item-icon">📧</span>
            <span>登录 / 注册</span>
          </Link>
        </nav>

        <div className="nav-user">
          <div className="nav-user-info" onClick={() => setDrawerOpen(true)}>
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
              <article
                key={post.id}
                className="post-item"
                onClick={() => setPreviewPost(post)}
              >
                <div className="post-avatar">{post.avatar}</div>
                <div className="post-main">
                  <Link href={`/post/${post.id}`} className="post-title" onClick={(e) => e.stopPropagation()}>
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
        <button className="new-post-btn" onClick={() => setDrawerOpen(true)}>
          <span>✏️</span>
          <span>发布新帖</span>
        </button>

        {/* 登录卡片 */}
        <div className="rail-card login-card">
          <p>登录后可发布帖子、参与讨论</p>
          <button className="login-btn" onClick={() => setDrawerOpen(true)}>登录 / 注册</button>
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
          <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: 2 }}>
            <li>友善交流，互相尊重</li>
            <li>禁止发布广告、软文</li>
            <li>优质内容优先展示</li>
            <li>禁止人身攻击、阴阳怪气</li>
          </ul>
        </div>
      </aside>

      {/* 今日热帖浮窗 */}
      <div className="hot-post-float">
        <div className="hot-post-float-header">
          <span>🔥</span>
          <span>今日最热</span>
        </div>
        <div className="hot-post-float-content" onClick={() => setPreviewPost(hotPost)}>
          <div className="hot-post-title">{hotPost.title}</div>
          <div className="hot-post-meta">
            <span>👁️ {hotPost.views}</span>
            <span>💬 {hotPost.replies}</span>
          </div>
        </div>
      </div>

      {/* 抽屉遮罩 */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* 登录抽屉 */}
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>欢迎回来</h3>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>×</button>
        </div>
        <div className="drawer-body">
          <div className="form-group">
            <label>邮箱</label>
            <input type="email" className="form-input" placeholder="请输入邮箱" />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input type="password" className="form-input" placeholder="请输入密码" />
          </div>
          <button className="new-post-btn" style={{ marginTop: '8px' }}>
            登录
          </button>

          <div className="drawer-divider">或</div>

          <button className="login-btn">
            📧 使用邮箱注册
          </button>

          <p className="drawer-footer-text">
            还没有账号？<a href="#">立即注册</a>
          </p>
        </div>
      </div>

      {/* 帖子预览弹窗 */}
      {previewPost && (
        <>
          <div
            className={`drawer-overlay open`}
            onClick={() => setPreviewPost(null)}
          />
          <div className="hot-post-float" style={{ top: '50%', left: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)', width: '500px', maxWidth: '90vw' }}>
            <div className="hot-post-float-header">
              <span>📖</span>
              <span>帖子预览</span>
              <button className="drawer-close" onClick={() => setPreviewPost(null)} style={{ marginLeft: 'auto' }}>×</button>
            </div>
            <div className="hot-post-float-content" style={{ padding: '24px' }}>
              <div className="hot-post-title" style={{ fontSize: '18px', marginBottom: '16px' }}>{previewPost.title}</div>
              <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '20px' }}>
                {previewPost.preview}
              </p>
              <Link
                href={`/post/${previewPost.id}`}
                className="new-post-btn"
                style={{ textDecoration: 'none' }}
                onClick={() => setPreviewPost(null)}
              >
                查看完整帖子 →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
