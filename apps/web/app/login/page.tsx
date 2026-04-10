import { Suspense } from "react";
import { AuthForm } from "../../components/auth-form";

export default function LoginPage() {
  return (
    <section className="auth-shell auth-shell-centered">
      <div className="card auth-panel auth-panel-polished">
        <div className="auth-logo-mark">PM</div>
        <div className="auth-heading">
          <h1>登录 PM社区</h1>
          <p>使用邮箱 + 密码进入正式版社区。</p>
        </div>
        <Suspense fallback={<div className="muted">正在加载登录状态...</div>}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </section>
  );
}
