import { Suspense } from "react";
import { PasswordRecoveryForm } from "../../components/password-recovery-form";

export default function ForgotPasswordPage() {
  return (
    <section className="auth-shell">
      <div className="auth-side card auth-side-polished">
        <span className="eyebrow">找回密码</span>
        <h1 className="section-title">找回账号访问权限</h1>
        <p className="muted">输入注册邮箱后，继续进入密码重置流程，重新拿回账号访问权限。</p>
        <div className="auth-benefit-list">
          <div className="auth-benefit-item">
            <strong>旧会话自动失效</strong>
            <span>密码重置完成后，旧设备上的登录态会自动失效。</span>
          </div>
          <div className="auth-benefit-item">
            <strong>重新登录继续工作</strong>
            <span>创作、通知、收藏和茶水间数据都会保留，不会影响你的站内沉淀。</span>
          </div>
        </div>
      </div>
      <div className="card auth-panel auth-panel-polished">
        <div className="auth-logo-mark">PM</div>
        <div className="auth-heading">
          <h1>通过邮箱重置密码</h1>
          <p>提交邮箱后，系统会生成继续设置新密码的入口。</p>
        </div>
        <Suspense fallback={<div className="muted">正在加载重置流程...</div>}>
          <PasswordRecoveryForm mode="forgot" />
        </Suspense>
      </div>
    </section>
  );
}
