"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "🏠", label: "首页" },
  { href: "/topics", icon: "📦", label: "产品分类" },
  { href: "/chat", icon: "💬", label: "闲聊话题" },
  { href: "/toolbox", icon: "🛠️", label: "工具集合" },
];

const userItems = [
  { href: "/notifications", icon: "🔔", label: "消息通知" },
  { href: "/me", icon: "👤", label: "个人主页" },
  { href: "/settings", icon: "⚙️", label: "设置" },
];

export function AppShellNav() {
  const pathname = usePathname();

  return (
    <nav className="nav-container">
      {/* Logo */}
      <div className="nav-logo">
        <Link href="/">
          <span className="logo-emoji">🍵</span>
          <span className="logo-text">PM茶水间</span>
        </Link>
      </div>

      {/* 主导航 */}
      <div className="nav-section">
        <div className="nav-section-title">导航</div>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 用户相关 */}
      <div className="nav-section">
        <div className="nav-section-title">账号</div>
        <div className="nav-links">
          {userItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 底部 */}
      <div className="nav-footer">
        <Link href="/create" className="nav-create-btn">
          <span>+</span>
          <span>发布帖子</span>
        </Link>
      </div>

      <style>{`
        .nav-container {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .nav-logo a {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          transition: background 0.15s ease;
        }

        .nav-logo a:hover {
          background: var(--bg-base);
        }

        .logo-emoji {
          font-size: 28px;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .nav-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-tertiary);
          padding: 0 12px;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .nav-link:hover {
          background: var(--bg-base);
          color: var(--text-primary);
        }

        .nav-link.active {
          background: var(--color-products-light);
          color: var(--color-products);
        }

        .nav-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .nav-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .nav-create-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          background: var(--color-products);
          color: white;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .nav-create-btn:hover {
          background: var(--color-products-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .nav-create-btn span:first-child {
          font-size: 18px;
        }
      `}</style>
    </nav>
  );
}
