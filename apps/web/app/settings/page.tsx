import { AuthGuard } from "../../components/auth-guard";
import { SettingsPanel } from "../../components/settings-panel";

export default function SettingsPage() {
  return (
    <AuthGuard fallbackTitle="正在进入设置页...">
      <SettingsPanel />
    </AuthGuard>
  );
}
