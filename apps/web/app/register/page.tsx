import { Suspense } from "react";
import { AuthForm } from "../../components/auth-form";

export default function RegisterPage() {
  return (
    <section className="auth-shell">
      <div className="auth-side card auth-side-polished">
        <span className="eyebrow">注册加入</span>
        <h1 className="section-title">进入 PM 社区，开始沉淀你的内容和关系</h1>
        <p className="muted">使用邮箱和密码创建正式账号，完成后会自动登录，并回到你刚刚想去的页面。</p>
        <div className="auth-benefit-list">
          <div className="auth-benefit-item">
            <strong>写文章、提问题、发讨论</strong>
            <span>把经验、观点和案例沉淀成可持续被看见的内容。</span>
          </div>
          <div className="auth-benefit-item">
            <strong>收藏、关注、接收通知</strong>
            <span>把你关心的人和话题留在自己的工作台里。</span>
          </div>
          <div className="auth-benefit-item">
            <strong>加入茶水间和分类广场</strong>
            <span>实时看讨论，也能按方向稳定追踪内容更新。</span>
          </div>
        </div>
      </div>
      <div className="card auth-panel auth-panel-polished">
        <div className="auth-logo-mark">PM</div>
        <div className="auth-heading">
          <h1>创建你的 PM 社区账号</h1>
          <p>只保留真实可用的注册链路，注册后立即进入正式社区。</p>
        </div>
        <Suspense fallback={<div className="muted">正在加载注册状态...</div>}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </section>
  );
}
