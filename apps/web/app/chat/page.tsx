import Link from "next/link";

const channels = [
  { icon: "🚀", name: "职场成长", desc: "职业发展、技能提升", count: "2.3k" },
  { icon: "💼", name: "求职跳槽", desc: "简历优化、面试经验", count: "1.8k" },
  { icon: "😎", name: "摸鱼吐槽", desc: "茶水间闲聊、摸鱼时光", count: "5.2k" },
  { icon: "🤝", name: "内推招聘", desc: "职位发布、人才推荐", count: "980" },
  { icon: "📚", name: "资源分享", desc: "学习资料、干货分享", count: "1.5k" },
  { icon: "🔧", name: "工具技巧", desc: "效率工具、使用技巧", count: "890" },
];

export default function ChatPage() {
  return (
    <div className="page-container">
      {/* Hero */}
      <section className="page-hero chat">
        <div className="page-hero-content">
          <div className="page-hero-icon">💬</div>
          <div className="page-hero-text">
            <h1>闲聊话题</h1>
            <p>茶水间的轻松讨论，PM互助社区</p>
          </div>
          <div className="hero-badge">
            <span className="online-dot"></span>
            <span>2,341 在线</span>
          </div>
        </div>
        <div className="page-search">
          <input type="text" placeholder="搜索话题..." />
          <button>搜索</button>
        </div>
      </section>

      {/* 频道网格 */}
      <div className="channels-grid">
        {channels.map((channel) => (
          <div key={channel.name} className="channel-card chat">
            <div className="channel-icon">{channel.icon}</div>
            <div className="channel-info">
              <h3>{channel.name}</h3>
              <p>{channel.desc}</p>
            </div>
            <span className="channel-count">{channel.count}</span>
          </div>
        ))}
      </div>

      {/* 快捷开始 */}
      <div className="quick-start">
        <div className="quick-start-card">
          <h3>如何开始讨论？</h3>
          <p>加入我们，一起交流产品经验</p>
          <div className="quick-steps">
            <div className="quick-step">
              <span className="step-number">1</span>
              <div className="step-content">
                <strong>注册账号</strong>
                <span>创建你的PM茶水间账号</span>
              </div>
            </div>
            <div className="quick-step">
              <span className="step-number">2</span>
              <div className="step-content">
                <strong>选择话题</strong>
                <span>找到感兴趣的话题频道</span>
              </div>
            </div>
            <div className="quick-step">
              <span className="step-number">3</span>
              <div className="step-content">
                <strong>发表观点</strong>
                <span>分享你的经验和见解</span>
              </div>
            </div>
          </div>
        </div>
        <div className="quick-start-card">
          <h3>常用链接</h3>
          <div className="quick-links-list">
            <Link href="/create" className="quick-link-item">
              ✍️ 发布新帖子
            </Link>
            <Link href="/notifications" className="quick-link-item">
              🔔 我的消息
            </Link>
            <Link href="/me" className="quick-link-item">
              📊 我的主页
            </Link>
            <Link href="/topics" className="quick-link-item">
              📦 产品分类
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .page-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .page-hero {
          padding: 32px 36px;
          border-radius: var(--radius-xl);
          color: white;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .page-hero::before {
          content: "";
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .page-hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .page-hero-icon {
          font-size: 56px;
        }

        .page-hero-text {
          flex: 1;
        }

        .page-hero-text h1 {
          margin: 0 0 6px;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .page-hero-text p {
          margin: 0;
          font-size: 15px;
          opacity: 0.9;
        }

        .hero-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(255,255,255,0.2);
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 600;
        }

        .online-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .page-search {
          display: flex;
          gap: 10px;
          background: rgba(255,255,255,0.15);
          border-radius: var(--radius-md);
          padding: 6px;
        }

        .page-search input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 12px 16px;
          color: white;
          font-size: 15px;
        }

        .page-search input::placeholder {
          color: rgba(255,255,255,0.7);
        }

        .page-search input:focus {
          outline: none;
        }

        .page-search button {
          padding: 12px 20px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: var(--radius-sm);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .page-search button:hover {
          background: rgba(255,255,255,0.3);
        }

        .channels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .channel-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .channel-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: #10b981;
        }

        .channel-icon {
          font-size: 32px;
        }

        .channel-info {
          flex: 1;
        }

        .channel-info h3 {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .channel-info p {
          margin: 0;
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .channel-count {
          padding: 6px 12px;
          background: #ecfdf5;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          color: #10b981;
        }

        .quick-start {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 16px;
        }

        .quick-start-card {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          padding: 24px;
        }

        .quick-start-card h3 {
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .quick-start-card > p {
          margin: 0 0 20px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .quick-steps {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .quick-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .step-number {
          width: 24px;
          height: 24px;
          background: #ecfdf5;
          color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .step-content span {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .quick-links-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .quick-link-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          background: var(--bg-base);
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .quick-link-item:hover {
          background: #ecfdf5;
          color: #10b981;
        }

        @media (max-width: 1024px) {
          .channels-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .quick-start {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 24px;
          }
          .channels-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
