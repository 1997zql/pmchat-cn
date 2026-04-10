import { AuthGuard } from "../../../../components/auth-guard";
import { PostCreateForm } from "../../../../components/post-create-form";
import { apiFetch } from "../../../../lib/api";

type EditPostDetail = {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  reviewReason?: string | null;
  coverUrl?: string | null;
  tags?: string[];
  author: { id: string };
  category: { id: string };
};

async function getPost(id: string) {
  return apiFetch<EditPostDetail>(`/posts/${id}`).catch(() => null);
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return <div className="card muted">帖子不存在或当前无法编辑。</div>;
  }

  return (
    <AuthGuard ownerId={post.author.id} fallbackTitle="正在进入编辑页...">
      <div className="card" style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1 className="section-title">编辑内容</h1>
        <p className="muted">修改后将按最新状态重新展示，待审核内容会继续保留状态说明。</p>
        <PostCreateForm
          mode="edit"
          postId={post.id}
          initialData={{
            title: post.title,
            content: post.content,
            categoryId: post.category.id,
            type: post.type,
            tags: post.tags || [],
            coverUrl: post.coverUrl,
            status: post.status,
            reviewReason: post.reviewReason
          }}
        />
      </div>
    </AuthGuard>
  );
}
