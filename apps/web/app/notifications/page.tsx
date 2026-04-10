import { AuthGuard } from "../../components/auth-guard";
import { NotificationCenter } from "../../components/notification-center";

export default function NotificationsPage() {
  return (
    <AuthGuard fallbackTitle="正在进入通知中心...">
      <div className="stack">
        <section className="card notifications-hero">
          <div className="page-title">
            <span className="eyebrow">通知中心</span>
            <h1>把所有反馈收进一个可处理的收件箱</h1>
            <div className="page-subtitle">评论、点赞、关注、系统通知和审核结果统一沉淀，读完就能继续跳回对应内容。</div>
          </div>
        </section>
        <NotificationCenter />
      </div>
    </AuthGuard>
  );
}
