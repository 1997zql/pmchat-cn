import Link from "next/link";

const toolCategories = [
  {
    icon: "🎨",
    name: "原型设计",
    tools: ["Figma", "Sketch", "Axure", "摹客", "MasterGo"],
  },
  {
    icon: "📝",
    name: "文档协作",
    tools: ["飞书", "Notion", "语雀", "腾讯文档", "OneNote"],
  },
  {
    icon: "📊",
    name: "数据看板",
    tools: ["Tableau", "PowerBI", "FineBI", "帆软", "Metabase"],
  },
  {
    icon: "🤖",
    name: "AI助手",
    tools: ["ChatGPT", "Claude", "文心一言", "通义千问", "Kimi"],
  },
  {
    icon: "🔄",
    name: "流程图工具",
    tools: ["ProcessOn", "draw.io", "Visio", "Lucidchart", "Whimsical"],
  },
  {
    icon: "🎭",
    name: "设计资源",
    tools: ["IconFont", "Unsplash", "Pexels", "Dribbble", "Behance"],
  },
];

const featuredTools = [
  {
    icon: "🎨",
    name: "Figma",
    category: "原型设计",
    desc: "在线协作设计工具，支持实时协作和强大的原型功能",
    rating: 4.9,
    users: "12.5k",
  },
  {
    icon: "📝",
    name: "飞书",
    category: "文档协作",
    desc: "字节跳动出品的一站式协作平台，集成文档、表格、IM",
    rating: 4.8,
    users: "8.2k",
  },
  {
    icon: "🤖",
    name: "ChatGPT",
    category: "AI助手",
    desc: "OpenAI开发的AI对话助手，可以辅助产品日常工作",
    rating: 4.9,
    users: "25.3k",
  },
  {
    icon: "📊",
    name: "Tableau",
    category: "数据看板",
    desc: "强大的数据可视化工具，支持多种数据源连接",
    rating: 4.7,
    users: "5.8k",
  },
];

export default function ToolboxPage() {
  return (
    <div className="page-container">
      {/* Hero */}
      <section className="page-hero tools">
        <div className="page-hero-content">
          <div className="page-hero-icon">🛠️</div>
          <div className="page-hero-text">
            <h1>工具集合</h1>
            <p>PM 必备工具导航，提升工作效率</p>
          </div>
        </div>
        <div className="page-search">
          <input type="text" placeholder="搜索工具..." />
          <button>搜索</button>
        </div>
      </section>

      {/* 工具分类 */}
      <div className="tools-categories">
        {toolCategories.map((cat) => (
          <div key={cat.name} className="tool-category">
            <div className="tool-category-header">
              <span className="tool-category-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
            </div>
            <div className="tool-items">
              {cat.tools.map((tool) => (
                <span key={tool} className="tool-item">{tool}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 精选工具 */}
      <div className="featured-section">
        <div className="featured-header">
          <span style={{ fontSize: "24px" }}>⭐</span>
          <h2>精选工具推荐</h2>
        </div>
        <div className="featured-grid">
          {featuredTools.map((tool) => (
            <div key={tool.name} className="featured-card">
              <div className="featured-card-header">
                <div className="featured-card-icon">{tool.icon}</div>
                <div className="featured-card-info">
                  <h3>{tool.name}</h3>
                  <span>{tool.category}</span>
                </div>
                <div className="featured-rating">
                  <span className="star">⭐</span>
                  {tool.rating}
                </div>
              </div>
              <p className="featured-desc">{tool.desc}</p>
              <div className="featured-footer">
                <span className="featured-users">{tool.users} PM 在用</span>
                <Link href="#" className="featured-btn">查看详情</Link>
              </div>
            </div>
          ))}
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
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

        .tools-categories {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .tool-category {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          padding: 20px;
          transition: all 0.2s ease;
        }

        .tool-category:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .tool-category-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .tool-category-icon {
          font-size: 24px;
        }

        .tool-category h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .tool-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tool-item {
          padding: 8px 14px;
          background: var(--bg-base);
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.15s ease;
          cursor: pointer;
        }

        .tool-item:hover {
          background: #f59e0b;
          color: white;
        }

        .featured-section {
          background: white;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-subtle);
          padding: 24px;
        }

        .featured-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .featured-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .featured-card {
          padding: 20px;
          background: var(--bg-base);
          border-radius: var(--radius-md);
          transition: all 0.15s ease;
        }

        .featured-card:hover {
          box-shadow: var(--shadow-md);
        }

        .featured-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }

        .featured-card-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: #fffbeb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .featured-card-info {
          flex: 1;
        }

        .featured-card-info h3 {
          margin: 0 0 4px;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .featured-card-info span {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .featured-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: white;
          border-radius: var(--radius-full);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .star {
          font-size: 14px;
        }

        .featured-desc {
          margin: 0 0 14px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .featured-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .featured-users {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .featured-btn {
          padding: 8px 16px;
          background: #f59e0b;
          color: white;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .featured-btn:hover {
          background: #d97706;
        }

        @media (max-width: 1024px) {
          .tools-categories,
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .page-hero {
            padding: 24px;
          }
          .tools-categories,
          .featured-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
