"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { buildLoginHref, getStoredUser } from "../lib/auth";

export function AuthGuard({
  children,
  requireAdmin = false,
  fallbackTitle = "请先登录后继续",
  ownerId
}: {
  children: ReactNode;
  requireAdmin?: boolean;
  fallbackTitle?: string;
  ownerId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.replace(buildLoginHref(pathname || "/"));
      return;
    }
    if (requireAdmin && user.role !== "ADMIN") {
      setForbidden(true);
      setReady(true);
      return;
    }
    if (ownerId && user.id !== ownerId) {
      setForbidden(true);
      setReady(true);
      return;
    }
    setReady(true);
  }, [ownerId, pathname, requireAdmin, router]);

  if (forbidden) {
    return (
      <div className="card stack">
        <span className="eyebrow">访问受限</span>
        <strong>当前账号无权限访问该页面</strong>
        <div className="muted">如果你需要继续处理该操作，请切换到具备权限的账号后重试。</div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="card stack">
        <span className="eyebrow">正在校验</span>
        <strong>{fallbackTitle}</strong>
      </div>
    );
  }

  return <>{children}</>;
}
