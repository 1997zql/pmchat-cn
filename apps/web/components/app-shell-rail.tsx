"use client";

import Link from "next/link";

const quickActions = [
  { href: "/create", icon: "✍️", label: "写帖子" },
  { href: "/notifications", icon: "🔔", label: "消息" },
  { href: "/me", icon: "📊", label: "我的" },
];

const hotTopics = [
  { title: "B端和C端产品经理的核心差异是什么？", views: "2.3k" },
  { title: "AI产品经理需要掌握哪些技能？", views: "1.8k" },
  { title: "如何优雅地拒绝产品需求变更？", views: "1.5k" },
];

export function AppShellRail() {
  return (
    <aside className="rail-container">
      {/* 用户卡片 */}
      <div className="user-card">
        <div className="user-avatar">访客</div>
        <div className="user-info">
          <div className="user-name">欢迎来到PM茶水间</div>
          <div className="user-desc">登录后参与讨论</div>
        </div>
        <div className="user-actions">
          <Link href="/login" className="user-btn login">
            登录
          </Link>
          <Link href="/register" className="user-btn register">
            注册
          </Link>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="rail-section">
        <div className="rail-section-title">快捷入口</div>
        <div className="quick-actions">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="quick-action">
              <span className="quick-icon">{action.icon}</span>
              <span className="quick-label">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 热门话题 */}
      <div className="rail-section">
        <div className="rail-section-title">🔥 热门话题</div>
        <div className="hot-topics">
          {hotTopics.map((topic, index) => (
            <Link key={index} href="/topics" className="hot-topic">
              <span className="topic-rank">{index + 1}</span>
              <div className="topic-content">
                <div className="topic-title">{topic.title}</div>
                <div className="topic-views">{topic.views} 浏览</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 社区规则 */}
      <div className="rail-section">
        <div className="rail-section-title">📋 社区规范</div>
        <ul className="rules-list">
          <li>友善交流，互相尊重</li>
          <li>分享经验，共同成长</li>
          <li>禁止广告，纯粹交流</li>
        </ul>
      </div>

      {/* 底部信息 */}
      <div className="rail-footer">
        <div className="footer-links">
          <Link href="/about">关于我们</Link>
          <Link href="/contact">联系我们</Link>
          <Link href="/privacy">隐私政策</Link>
        </div>
        <div className="footer-copyright">
          © 2026 PM茶水间
        </div>
      </div>

      <style>{`
        .rail-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* 用户卡片 */
        .user-card {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          padding: 20px;
          text-align: center;
        }

        .user-avatar {
          width: 64px;
          height: 64px;
          margin: 0 auto 12px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-products), var(--color-products-dark));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .user-info {
          margin-bottom: 16px;
        }

        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .user-desc {
          font-size: 13px;
          color: var(--text-tertiary);
        }

        .user-actions {
          display: flex;
          gap: 10px;
        }

        .user-btn {
          flex: 1;
          padding: 10px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .user-btn.login {
          background: var(--bg-base);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
        }

        .user-btn.login:hover {
          background: var(--border-subtle);
        }

        .user-btn.register {
          background: var(--color-products);
          color: white;
        }

        .user-btn.register:hover {
          background: var(--color-products-dark);
        }

        /* Rail 区块 */
        .rail-section {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          padding: 20px;
        }

        .rail-section-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 14px;
        }

        /* 快捷入口 */
        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-base);
          border-radius: var(--radius-sm);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .quick-action:hover {
          background: var(--color-products-light);
        }

        .quick-icon {
          font-size: 20px;
        }

        .quick-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        /* 热门话题 */
        .hot-topics {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hot-topic {
          display: flex;
          gap: 12px;
          text-decoration: none;
          padding: 10px;
          margin: -10px;
          border-radius: var(--radius-sm);
          transition: background 0.15s ease;
        }

        .hot-topic:hover {
          background: var(--bg-base);
        }

        .topic-rank {
          width: 20px;
          height: 20px;
          background: var(--color-hot);
          color: white;
          font-size: 12px;
          font-weight: 600;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hot-topic:nth-child(2) .topic-rank {
          background: var(--text-tertiary);
        }

        .hot-topic:nth-child(3) .topic-rank {
          background: #b45309;
        }

        .topic-content {
          flex: 1;
          min-width: 0;
        }

        .topic-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .topic-views {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        /* 社区规则 */
        .rules-list {
          margin: 0;
          padding-left: 20px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.8;
        }

        /* 底部 */
        .rail-footer {
          padding: 16px 0;
          text-align: center;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 8px;
        }

        .footer-links a {
          font-size: 12px;
          color: var(--text-tertiary);
          text-decoration: none;
        }

        .footer-links a:hover {
          color: var(--color-products);
        }

        .footer-copyright {
          font-size: 12px;
          color: var(--text-tertiary);
        }
      `}</style>
    </aside>
  );
}
