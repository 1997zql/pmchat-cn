import Link from "next/link";
import { CommentThread } from "../../../components/comment-thread";
import { PostActions } from "../../../components/post-actions";
import { PostOwnerTools } from "../../../components/post-owner-tools";
import { apiFetch } from "../../../lib/api";

type Comment = {
  id: string;
  content: string;
  author: { nickname: string };
  replies: Array<{ id: string; content: string; author: { nickname: string } }>;
};

type PostDetail = {
  id: string;
  title: string;
  content: string;
  type: string;
  status?: string;
  reviewReason?: string | null;
  likeCount?: number;
  favoriteCount?: number;
  viewer?: {
    hasLiked: boolean;
    hasFavorited: boolean;
    isFollowingAuthor: boolean;
  };
  author: { id: string; nickname: string; title: string | null };
  authorStats?: { posts: number; followers: number; following: number };
  category: { name: string };
  tags?: string[];
  comments: Comment[];
  relatedPosts?: Array<{
    id: string;
    title: string;
    excerpt?: string | null;
    author: { nickname: string; title: string | null };
    category: { name: string };
  }>;
};

async function getPost(id: string) {
  return apiFetch<PostDetail>(`/posts/${id}`).catch(() => null);
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return <div className="empty card">帖子不存在或暂时无法访问。</div>;
  }

  return (
    <div className="detail-layout detail-layout-formal">
      <section className="stack">
        <article className="card detail-article-card">
          <div className="pill-row">
            <span className="pill">{post.category.name}</span>
            <span className="pill pill-muted">{post.type}</span>
            {post.status && post.status !== "PUBLISHED" ? <span className="pill">{post.status}</span> : null}
          </div>

          <div className="feed-author-row">
            <div className="feed-avatar">{post.author.nickname.slice(0, 1)}</div>
            <div className="feed-author-meta">
              <div className="feed-author-name">
                <strong>{post.author.nickname}</strong>
                {post.author.title ? <span className="feed-badge subtle">{post.author.title}</span> : null}
              </div>
              <div className="feed-author-sub">来自 {post.category.name} 交流区</div>
            </div>
          </div>

          <div className="page-title">
            <h1>{post.title}</h1>
          </div>

          <div className="headline-stats">
            <span>点赞 {post.likeCount || 0}</span>
            <span>收藏 {post.favoriteCount || 0}</span>
            <span>评论 {post.comments.length}</span>
          </div>

          {post.reviewReason ? <div className="detail-note">审核说明：{post.reviewReason}</div> : null}

          <div className="detail-content-body" style={{ whiteSpace: "pre-wrap" }}>
            {post.content}
          </div>

          <div className="stats-row">
            {(post.tags || []).map((tag) => (
              <span key={tag} className="pill tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        <PostActions
          postId={post.id}
          authorId={post.author.id}
          initialLikeCount={post.likeCount || 0}
          initialFavoriteCount={post.favoriteCount || 0}
          initialViewer={post.viewer}
        />

        <div className="card detail-comment-card">
          <div className="list-card-header">
            <h2 className="section-title">评论区</h2>
            <span className="pill">共 {post.comments.length} 条</span>
          </div>
          <CommentThread postId={post.id} comments={post.comments} />
        </div>
      </section>

      <aside className="stack">
        <PostOwnerTools authorId={post.author.id} postId={post.id} status={post.status} reviewReason={post.reviewReason} />

        <div className="card">
          <span className="eyebrow">作者信息</span>
          <h3 className="section-title">作者主页</h3>
          <Link href={`/users/${post.author.id}`} className="compact-link-card">
            <strong>{post.author.nickname}</strong>
            <span>{post.author.title || "产品经理"}</span>
          </Link>
          <div className="summary-metrics detail-author-metrics">
            <div>
              <strong>{post.authorStats?.posts || 0}</strong>
              <span>内容</span>
            </div>
            <div>
              <strong>{post.authorStats?.followers || 0}</strong>
              <span>粉丝</span>
            </div>
            <div>
              <strong>{post.authorStats?.following || 0}</strong>
              <span>关注</span>
            </div>
          </div>
        </div>

        <div className="card">
          <span className="eyebrow">相关推荐</span>
          <h3 className="section-title">继续看</h3>
          <div className="stack">
            {post.relatedPosts?.length ? (
              post.relatedPosts.map((item) => (
                <Link key={item.id} href={`/posts/${item.id}`} className="compact-link-card">
                  <strong>{item.title}</strong>
                  <span>
                    {item.category.name} · {item.author.nickname}
                  </span>
                  {item.excerpt ? <span>{item.excerpt}</span> : null}
                </Link>
              ))
            ) : (
              <div className="muted">当前没有更多相关内容。</div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
