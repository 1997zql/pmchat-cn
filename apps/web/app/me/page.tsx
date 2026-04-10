import { AuthGuard } from "../../components/auth-guard";
import { ProfileDashboard } from "../../components/profile-dashboard";

export default function MePage() {
  return (
    <AuthGuard fallbackTitle="正在进入个人中心...">
      <ProfileDashboard />
    </AuthGuard>
  );
}
