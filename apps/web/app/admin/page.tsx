import { AuthGuard } from "../../components/auth-guard";
import { AdminConsole } from "../../components/admin-console";

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin fallbackTitle="正在校验后台权限...">
      <AdminConsole />
    </AuthGuard>
  );
}
