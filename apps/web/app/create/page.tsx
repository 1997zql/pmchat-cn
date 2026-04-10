import { AuthGuard } from "../../components/auth-guard";
import { PostCreateForm } from "../../components/post-create-form";

export default function CreatePage() {
  return (
    <AuthGuard fallbackTitle="正在检查登录状态...">
      <div className="stack">
        <section className="card page-hero">
          <div className="page-title">
            <span className="eyebrow">创作中心</span>
            <h1>创作中心</h1>
            <div className="page-subtitle">支持文章、问答、讨论三种创作类型，并承接草稿保存、分类选择和标签管理。</div>
          </div>
          <div className="feature-banner">
            <strong>创作建议</strong>
            <div className="stack muted">
              <span>文章适合方法论和案例总结。</span>
              <span>问答适合求助、讨论具体问题。</span>
              <span>讨论适合快速抛观点和收集反馈。</span>
            </div>
          </div>
        </section>
        <div className="card">
        <PostCreateForm />
        </div>
      </div>
    </AuthGuard>
  );
}
