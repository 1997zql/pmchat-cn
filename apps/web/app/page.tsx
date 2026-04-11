"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// SVG 图标组件
const Icons = {
  logo: () => (
    <svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
  ),
  home: () => (
    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
  ),
  grid: () => (
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
  chat: () => (
    <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  tool: () => (
    <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  ),
  edit: () => (
    <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  search: () => (
    <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  ),
  arrowRight: () => (
    <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
  ),
  chevronUp: () => (
    <svg viewBox="0 0 24 24"><polyline points="18,15 12,9 6,15"/></svg>
  ),
  chevronDown: () => (
    <svg viewBox="0 0 24 24"><polyline points="6,9 12,15 18,9"/></svg>
  ),
  message: () => (
    <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  ),
  eye: () => (
    <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  info: () => (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  ),
  fire: () => (
    <svg viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  ),
  users: () => (
    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
};

// 帖子数据
const posts = [
  {
    id: 1,
    title: "【重磅】ChatGPT-5 即将发布！对PM工作方式的影响深度分析",
    author: "产品汪小明",
    node: "AI产品",
    tags: ["AI产品", "精华"],
    votes: 256,
    comments: 128,
    views: "3.2k",
    isTop: true,
    preview: "🔥 重磅消息！OpenAI刚刚发布了GPT-5，性能提升300%！作为PM，我们需要思考：1）哪些工作会被AI替代？2）如何用AI提升产品体验？3）人机协作的正确姿势是什么？本文深度分析..."
  },
  {
    id: 2,
    title: "做了3年B端产品，这些坑你一定要避开（附避坑指南）",
    author: "B端老王",
    node: "B端产品",
    tags: ["B端产品"],
    votes: 89,
    comments: 56,
    views: "1.8k",
    preview: "在B端产品领域摸爬滚打3年，总结了12个容易踩的坑：1）需求变更没有记录 2）验收标准不清晰 3）忽略异常流程 4）不重视技术债务...希望对新人有帮助。"
  },
  {
    id: 3,
    title: "字节跳动面经：3轮面试 + 笔试，完整复盘分享",
    author: "求职小能手",
    node: "求职面试",
    tags: ["求职面试"],
    votes: 67,
    comments: 43,
    views: "2.1k",
    preview: "刚刚结束字节跳动3轮面试+笔试，整个流程非常严格。第一轮是业务leader，主要问项目经验；第二轮是总监，注重逻辑思维；第三轮是HR，谈薪资福利。整理了一份详细面经..."
  },
  {
    id: 4,
    title: "从功能PM到产品总监，我的5年成长路径",
    author: "产品总监老李",
    node: "职场成长",
    tags: ["职场成长"],
    votes: 45,
    comments: 38,
    views: "1.5k",
    preview: "从功能PM到产品总监，5年时间，我的成长路径是：功能PM(1年)→ 需求PM(1年) → 产品负责人(1.5年) → 产品总监(1.5年)。每个阶段需要的能力模型不同..."
  },
  {
    id: 5,
    title: "老板说\"这个需求很简单\"，然后我做了3周...",
    author: "摸鱼达人",
    node: "摸鱼吐槽",
    tags: ["摸鱼吐槽"],
    votes: 32,
    comments: 89,
    views: "2.8k",
    preview: "老板：这个小需求很简单嘛，两天能做完吧？\n\n我内心：...\n\n实际：这个需求涉及5个系统对接、3个异常流程、2个数据迁移、1个历史包袱...\n\n两周后还在改bug中😭"
  },
];

// 社交证明数据
const socialProofs = [
  { avatar: "李", text: "李产品 刚刚加入了社区" },
  { avatar: "王", text: "王小龙 发帖被点赞 +56" },
  { avatar: "张", text: "张经理 收藏了资料包" },
  { avatar: "陈", text: "陈PM 刚刚加入了社区" },
  { avatar: "刘", text: "刘产品 发帖被点赞 +23" },
  { avatar: "周", text: "周总 收藏了资料包" },
];

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [hotPostVisible, setHotPostVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState("最新");
  const [votedPosts, setVotedPosts] = useState<Set<number>>(new Set());
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>(
    posts.reduce((acc, p) => ({ ...acc, [p.id]: p.votes }), {})
  );

  // 处理投票
  const handleVote = (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    setVotedPosts(prev => {
      const newSet = new Set(prev);
      const isVoted = newSet.has(postId);
      
      setVoteCounts(counts => ({
        ...counts,
        [postId]: isVoted ? counts[postId] - 1 : counts[postId] + 1
      }));
      
      if (isVoted) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // 显示帖子预览
  const showPreview = (text: string) => {
    setPreviewText(text);
    setPreviewOpen(true);
  };

  // 切换登录/注册
  const switchToRegister = () => {
    setLoginOpen(false);
    setTimeout(() => setRegisterOpen(true), 200);
  };

  return (
    <>
      {/* 顶部公告栏 */}
      <div className="top-banner">
        <div className="top-banner-content">
          <span className="banner-icon">🎉</span>
          <span className="banner-text">欢迎新PM！今日已有 <strong>23</strong> 位产品经理加入社区</span>
        </div>
      </div>

      <div className="layout">
        {/* 左侧边栏 */}
        <aside className="sidebar">
          <Link href="/" className="sidebar-logo">
            <span className="sidebar-logo-icon">
              <Icons.logo />
            </span>
            <span className="sidebar-logo-text">PM茶水间</span>
          </Link>

          <nav className="sidebar-nav">
            <Link href="/" className="sidebar-nav-item active">
              <span className="nav-icon"><Icons.home /></span>
              首页
            </Link>
            <Link href="/categories" className="sidebar-nav-item">
              <span className="nav-icon"><Icons.grid /></span>
              产品分类
            </Link>
            <Link href="/chat" className="sidebar-nav-item">
              <span className="nav-icon"><Icons.chat /></span>
              闲聊话题
            </Link>
            <Link href="/tools" className="sidebar-nav-item">
              <span className="nav-icon"><Icons.tool /></span>
              工具集合
            </Link>
            <Link href="/create" className="sidebar-nav-item">
              <span className="nav-icon"><Icons.edit /></span>
              发帖子
            </Link>
          </nav>

          <div className="sidebar-divider"></div>

          <div className="sidebar-tags">
            <h4 className="sidebar-tags-title">热门节点</h4>
            {["B端产品", "C端产品", "AI产品", "求职面试", "职场成长", "摸鱼吐槽"].map(tag => (
              <span key={tag} className="sidebar-tag">{tag}</span>
            ))}
          </div>

          <div className="sidebar-user">
            <button className="btn btn-outline btn-full" onClick={() => setLoginOpen(true)}>登录</button>
            <button className="btn btn-primary btn-full" onClick={() => setRegisterOpen(true)}>加入社区</button>
          </div>
        </aside>

        {/* 中间主内容 */}
        <main className="content">
          {/* Hero Banner */}
          <div className="hero-section">
            <div className="hero-content">
              <span className="hero-label">产品经理专属社区</span>
              <h1 className="hero-title">欢迎来到 <span className="hero-highlight">PM茶水间</span></h1>
              <p className="hero-desc">产品经理的知识库、讨论区、工具箱 — 在这里成长，不孤独</p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <div className="hero-stat-num">12,847</div>
                  <div className="hero-stat-label">产品经理</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-num">35,621</div>
                  <div className="hero-stat-label">讨论帖子</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-num">8,432</div>
                  <div className="hero-stat-label">工具资源</div>
                </div>
              </div>
            </div>
            
            {/* 实时社交证明滚动 */}
            <div className="social-proof-scroll">
              <div className="social-proof-track">
                {[...socialProofs, ...socialProofs].map((item, idx) => (
                  <div key={idx} className="social-proof-item">
                    <span className="proof-avatar">{item.avatar}</span>
                    <span className="proof-text" dangerouslySetInnerHTML={{ 
                      __html: item.text.replace(/(.*?) (.*)/, '<strong>$1</strong> $2') 
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 三大板块入口 */}
          <div className="section-grid">
            {/* 产品分类 */}
            <div className="section-card section-card-primary">
              <div className="section-card-header">
                <div className="section-card-icon">
                  <Icons.grid />
                </div>
                <h3 className="section-card-title">产品分类</h3>
                <span className="section-card-badge">1.2k+ 资源</span>
              </div>
              <p className="section-card-desc">B端产品、C端产品、AI产品、数据产品...体系化知识整理</p>
              <div className="section-card-search">
                <input type="text" placeholder="搜索产品分类..." className="search-input" />
                <button className="search-btn">
                  <Icons.search />
                </button>
              </div>
              <div className="section-card-tags">
                <span className="section-tag">B端产品</span>
                <span className="section-tag">C端产品</span>
                <span className="section-tag">AI产品</span>
              </div>
              <Link href="/categories" className="section-card-link">
                查看全部
                <Icons.arrowRight />
              </Link>
            </div>

            {/* 闲聊话题 */}
            <div className="section-card section-card-secondary">
              <div className="section-card-header">
                <div className="section-card-icon">
                  <Icons.chat />
                </div>
                <h3 className="section-card-title">闲聊话题</h3>
                <span className="section-card-badge section-badge-hot">热门</span>
              </div>
              <p className="section-card-desc">和产品同行聊聊职场、面试、薪资...有温度的社区</p>
              <div className="section-card-tags">
                <span className="section-tag">求职面试</span>
                <span className="section-tag">职场成长</span>
                <span className="section-tag">摸鱼吐槽</span>
              </div>
              <Link href="/chat" className="section-card-link">
                进入讨论
                <Icons.arrowRight />
              </Link>
            </div>

            {/* 工具集合 */}
            <div className="section-card section-card-accent">
              <div className="section-card-header">
                <div className="section-card-icon">
                  <Icons.tool />
                </div>
                <h3 className="section-card-title">工具集合</h3>
                <span className="section-card-badge">500+ 工具</span>
              </div>
              <p className="section-card-desc">PRD模板、Axure素材、数据看板...效率提升神器</p>
              <div className="section-card-tags">
                <span className="section-tag">模板下载</span>
                <span className="section-tag">素材库</span>
                <span className="section-tag">效率工具</span>
              </div>
              <Link href="/tools" className="section-card-link">
                探索工具
                <Icons.arrowRight />
              </Link>
            </div>
          </div>

          {/* 帖子列表 */}
          <div className="posts-section">
            <div className="posts-header">
              <h2 className="posts-title">最新帖子</h2>
              <div className="posts-filter">
                {["最新", "热门", "推荐"].map(filter => (
                  <button 
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="post-list">
              {posts.map(post => (
                <div 
                  key={post.id} 
                  className={`post-item ${post.isTop ? 'post-top' : ''}`}
                  onClick={() => showPreview(post.preview)}
                >
                  <div className="post-vote">
                    <button 
                      className={`vote-btn up ${votedPosts.has(post.id) ? 'voted' : ''}`}
                      onClick={(e) => handleVote(e, post.id)}
                    >
                      <Icons.chevronUp />
                    </button>
                    <span className="vote-count">{voteCounts[post.id]}</span>
                    <button className="vote-btn down">
                      <Icons.chevronDown />
                    </button>
                  </div>
                  <div className="post-main">
                    <div className="post-node">
                      {post.tags.map(tag => (
                        <span key={tag} className="node-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="post-title-wrap">
                      <Link href={`/post/${post.id}`} className="post-title" onClick={e => e.stopPropagation()}>
                        {post.title}
                      </Link>
                    </div>
                    <div className="post-meta">
                      <span className="meta-author">{post.author}</span>
                      <span className="meta-item">
                        <Icons.message />
                        {post.comments}
                      </span>
                      <span className="meta-item">
                        <Icons.eye />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="load-more">
              <button className="load-more-btn">
                加载更多
                <Icons.chevronDown />
              </button>
            </div>
          </div>
        </main>

        {/* 右侧边栏 */}
        <aside className="rightbar">
          {/* 搜索 */}
          <div className="quick-search">
            <input type="text" placeholder="搜索话题..." className="quick-search-input" />
            <button className="quick-search-btn">
              <Icons.search />
            </button>
          </div>

          {/* 社区介绍 */}
          <div className="right-card right-card-highlight">
            <div className="right-card-header">
              <Icons.info />
              关于社区
            </div>
            <div className="right-card-body">
              <p className="right-desc">PM茶水间是产品经理专属的知识分享社区，汇聚B端、C端、AI、数据等各方向产品人。</p>
              <div className="right-stats">
                <div className="right-stat">
                  <span className="right-stat-num">12k+</span>
                  <span className="right-stat-label">PM会员</span>
                </div>
                <div className="right-stat">
                  <span className="right-stat-num">35k+</span>
                  <span className="right-stat-label">帖子</span>
                </div>
                <div className="right-stat">
                  <span className="right-stat-num">500+</span>
                  <span className="right-stat-label">工具</span>
                </div>
              </div>
            </div>
          </div>

          {/* 热门节点 */}
          <div className="right-card">
            <div className="right-card-header">
              <Icons.fire />
              热门节点
            </div>
            <div className="right-card-body">
              <div className="hot-nodes">
                {[
                  { name: "AI产品", count: "2.3k" },
                  { name: "B端产品", count: "1.8k" },
                  { name: "求职面试", count: "1.5k" },
                  { name: "C端产品", count: "1.2k" },
                  { name: "职场成长", count: "980" },
                ].map(node => (
                  <div key={node.name} className="hot-node">
                    <span className="hot-node-name">{node.name}</span>
                    <span className="hot-node-count">{node.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 活跃用户 */}
          <div className="right-card">
            <div className="right-card-header">
              <Icons.users />
              活跃用户
            </div>
            <div className="right-card-body">
              <div className="active-users">
                {[
                  { name: "张产品", title: "字节跳动高级PM", badge: "达人", avatar: "张" },
                  { name: "李小龙", title: "阿里产品专家", badge: "专家", avatar: "李" },
                  { name: "王小米", title: "腾讯产品经理", badge: "新秀", avatar: "王" },
                ].map(user => (
                  <div key={user.name} className="active-user">
                    <div className="active-user-avatar">{user.avatar}</div>
                    <div className="active-user-info">
                      <div className="active-user-name">{user.name}</div>
                      <div className="active-user-title">{user.title}</div>
                    </div>
                    <span className="active-user-badge">{user.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部 */}
          <div className="rightbar-footer">
            <Link href="/about">关于我们</Link>
            <Link href="/terms">用户协议</Link>
            <Link href="/contact">联系方式</Link>
            <div className="copyright">© 2024 PM茶水间</div>
          </div>
        </aside>
      </div>

      {/* 今日热帖浮窗 */}
      {hotPostVisible && (
        <div className="hot-post-float">
          <div className="hot-post-float-header">
            <span className="hot-icon">🔥</span>
            <span>今日最热</span>
            <button className="hot-close" onClick={() => setHotPostVisible(false)}>×</button>
          </div>
          <Link href="/post/hot" className="hot-post-float-content">
            <div className="hot-post-title">【精华】20年PM老兵复盘：我踩过的那些坑</div>
            <div className="hot-post-meta">
              <span>阅读 5.2k</span>
              <span>点赞 328</span>
            </div>
          </Link>
        </div>
      )}

      {/* 登录抽屉 */}
      <div 
        className={`drawer-overlay ${loginOpen ? 'open' : ''}`} 
        onClick={() => setLoginOpen(false)}
      ></div>
      <div className={`drawer ${loginOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>登录 PM茶水间</h3>
          <button className="drawer-close" onClick={() => setLoginOpen(false)}>×</button>
        </div>
        <div className="drawer-body">
          <div className="form-group">
            <label>邮箱 / 手机号</label>
            <input type="text" className="form-input" placeholder="请输入邮箱或手机号" />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input type="password" className="form-input" placeholder="请输入密码" />
          </div>
          <div className="form-row">
            <label className="checkbox-label">
              <input type="checkbox" /> 记住我
            </label>
            <Link href="/forgot" className="forgot-link">忘记密码？</Link>
          </div>
          <button className="btn btn-primary btn-full">登录</button>
          <div className="drawer-divider">
            <span>或</span>
          </div>
          <button className="btn btn-outline btn-full">微信登录</button>
          <p className="drawer-footer-text">
            还没有账号？<a href="#" onClick={(e) => { e.preventDefault(); switchToRegister(); }}>立即注册</a>
          </p>
        </div>
      </div>

      {/* 注册抽屉 */}
      <div 
        className={`drawer-overlay ${registerOpen ? 'open' : ''}`} 
        onClick={() => setRegisterOpen(false)}
      ></div>
      <div className={`drawer ${registerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>加入 PM茶水间</h3>
          <button className="drawer-close" onClick={() => setRegisterOpen(false)}>×</button>
        </div>
        <div className="drawer-body">
          <div className="form-group">
            <label>昵称</label>
            <input type="text" className="form-input" placeholder="给自己起个名字" />
          </div>
          <div className="form-group">
            <label>邮箱</label>
            <input type="email" className="form-input" placeholder="用于登录和找回密码" />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input type="password" className="form-input" placeholder="6位以上密码" />
          </div>
          <div className="form-group">
            <label>身份（选填）</label>
            <select className="form-input">
              <option>产品经理</option>
              <option>产品助理</option>
              <option>产品总监</option>
              <option>创业中</option>
              <option>学生</option>
              <option>其他</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full">立即加入</button>
          <p className="drawer-footer-text">
            登录即表示同意<Link href="/terms">用户协议</Link>
          </p>
        </div>
      </div>

      {/* 帖子预览弹窗 */}
      {previewOpen && (
        <div className="post-preview-popup" style={{ display: 'block' }}>
          <div className="post-preview-content">{previewText}</div>
          <Link href="/post/1" className="btn btn-primary post-preview-btn">阅读全文</Link>
        </div>
      )}
      {previewOpen && (
        <div 
          className="drawer-overlay open" 
          onClick={() => setPreviewOpen(false)}
          style={{ zIndex: 2999 }}
        ></div>
      )}
    </>
  );
}
