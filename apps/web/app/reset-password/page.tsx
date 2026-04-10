import { Suspense } from "react";
import { PasswordRecoveryForm } from "../../components/password-recovery-form";

export default function ResetPasswordPage() {
  return (
    <section className="auth-shell">
      <div className="auth-side card auth-side-polished">
        <span className="eyebrow">重置密码</span>
        <h1 className="section-title">设置一个新的登录密码</h1>
        <p className="muted">输入新密码后，就可以重新登录 PM 社区，继续使用你的内容、通知和关系数据。</p>
        <div className="auth-benefit-list">
          <div className="auth-benefit-item">
            <strong>密码强度要求</strong>
            <span>新密码至少需要 8 位，建议使用更长的组合，避免简单重复。</span>
          </div>
          <div className="auth-benefit-item">
            <strong>旧密码立即失效</strong>
            <span>保存成功后，旧密码将不再可用，后续请使用新密码登录。</span>
          </div>
        </div>
      </div>
      <div className="card auth-panel auth-panel-polished">
        <div className="auth-logo-mark">PM</div>
        <div className="auth-heading">
          <h1>保存你的新密码</h1>
          <p>设置完成后，直接回到登录页重新进入社区。</p>
        </div>
        <Suspense fallback={<div className="muted">正在加载密码设置...</div>}>
          <PasswordRecoveryForm mode="reset" />
        </Suspense>
      </div>
    </section>
  );
}
