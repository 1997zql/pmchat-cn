import Link from "next/link";
import { UserProfileFollow } from "./user-profile-follow";

type PublicProfile = {
  id: string;
  nickname: string;
  bio?: string | null;
  avatarUrl?: string | null;
  title?: string | null;
  company?: string | null;
  yearsOfExp?: string | null;
  interests?: string[];
  posts: Array<{
    id: string;
    title: string;
    excerpt?: string | null;
    type: string;
    likeCount: number;
    favoriteCount: number;
    category: { name: string };
  }>;
  followers: Array<{ followerId: string }>;
  following: Array<{ followingId: string }>;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
};

export function UserProfileView({ profile }: { profile: PublicProfile }) {
  const featuredInterests = (profile.interests || []).slice(0, 6);

  return (
    <div className="stack">
      <section className="card user-public-hero">
        <div className="page-title">
          <span className="eyebrow">公开主页</span>
          <h1>{profile.nickname} 的内容主页</h1>
          <div className="page-subtitle">
            查看这位产品经理公开分享的内容、擅长方向和社区沉淀，也可以直接建立关注关系。
          </div>
        </div>
        <div className="user-public-summary">
          <div className="settings-summary-card">
            <strong>{profile.stats.posts}</strong>
            <span>公开内容</span>
          </div>
          <div className="settings-summary-card">
            <strong>{profile.stats.followers}</strong>
            <span>粉丝</span>
          </div>
          <div className="settings-summary-card">
            <strong>{profile.stats.following}</strong>
            <span>关注</span>
          </div>
        </div>
      </section>

      <section className="profile-shell">
        <div className="card profile-main-card">
          <div className="feed-author-row">
            <div className="feed-avatar">{profile.nickname.slice(0, 1)}</div>
            <div className="feed-author-meta">
              <div className="feed-author-name">
                <strong>{profile.nickname}</strong>
                <span className="feed-badge subtle">{profile.title || "产品经理"}</span>
              </div>
              <div className="feed-author-sub">{profile.company || "未填写公司"} · {profile.yearsOfExp || "经验待补充"}</div>
            </div>
          </div>
          <p className="profile-bio">{profile.bio || "这位用户还没有填写个人简介。"}</p>
          <div className="stats-row">
            {featuredInterests.length ? featuredInterests.map((item) => (
              <span key={item} className="pill pill-muted">
                #{item}
              </span>
            )) : <span className="muted">暂未公开兴趣标签</span>}
          </div>
        </div>

        <div className="card profile-side-card">
          <span className="eyebrow">主页概览</span>
          <h2 className="section-title">这位用户正在沉淀什么</h2>
          <div className="summary-metrics detail-author-metrics">
            <div>
              <strong>{profile.stats.posts}</strong>
              <span>内容</span>
            </div>
            <div>
              <strong>{profile.stats.followers}</strong>
              <span>粉丝</span>
            </div>
            <div>
              <strong>{profile.stats.following}</strong>
              <span>关注</span>
            </div>
          </div>
          <div className="search-workspace-item">
            <strong>擅长方向</strong>
            <span>{profile.title || "产品经理"}{profile.company ? ` · ${profile.company}` : ""}</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <UserProfileFollow userId={profile.id} followerIds={profile.followers.map((item) => item.followerId)} />
          </div>
        </div>
      </section>

      <section className="card">
        <div className="list-card-header">
          <h2 className="section-title">公开内容</h2>
          <span className="pill">共 {profile.posts.length} 条</span>
        </div>
        <div className="stack">
          {profile.posts.length ? (
            profile.posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="feed-card formal-feed-card">
                <div className="stats-row">
                  <span className="pill">{post.category.name}</span>
                  <span className="pill pill-muted">{post.type}</span>
                </div>
                <strong className="feed-title">{post.title}</strong>
                {post.excerpt ? <p>{post.excerpt}</p> : null}
                <div className="stats-row">
                  <span className="stat-chip">点赞 {post.likeCount}</span>
                  <span className="stat-chip">收藏 {post.favoriteCount}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty">这位用户暂时还没有公开内容。</div>
          )}
        </div>
      </section>

      <section className="user-public-bottom-grid">
        <div className="card">
          <span className="eyebrow">继续浏览</span>
          <h2 className="section-title">从这个主页继续去哪里</h2>
          <div className="search-workspace-list">
            <Link href="/topics" className="search-workspace-item link-card">
              <strong>去分类广场</strong>
              <span>继续按方向浏览更多内容和讨论。</span>
            </Link>
            <Link href="/chat" className="search-workspace-item link-card">
              <strong>进入茶水间</strong>
              <span>如果你想快速交流或跟进实时话题，可以直接切换频道。</span>
            </Link>
          </div>
        </div>
        <div className="card">
          <span className="eyebrow">标签轨迹</span>
          <h2 className="section-title">这位用户关注的主题</h2>
          <div className="search-pill-wrap">
            {featuredInterests.length ? featuredInterests.map((item) => (
              <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="pill pill-muted">
                #{item}
              </Link>
            )) : <span className="muted">还没有公开可追踪的话题标签。</span>}
          </div>
        </div>
      </section>
    </div>
  );
}
