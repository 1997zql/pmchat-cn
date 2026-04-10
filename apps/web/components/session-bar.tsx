"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, getStoredUser, onAuthChange, SessionUser } from "../lib/auth";

export function SessionBar() {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    sync();
    return onAuthChange(sync);
  }, []);

  if (!user) {
    return (
      <div className="card session-card">
        <span className="eyebrow">账号承接</span>
        <strong>登录后开启完整社区工作台</strong>
        <div className="muted">登录后可发帖、评论、收藏和进入完整茶水间。</div>
        <div className="stats-row" style={{ marginTop: 12 }}>
          <Link href="/login" className="button primary">
            登录
          </Link>
          <Link href="/register" className="button ghost">
            注册
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card session-card">
      <span className="eyebrow">我的账号</span>
      <strong>{user.nickname}</strong>
      <div className="muted">{user.title || "PM社区用户"}</div>
      <div className="stats-row" style={{ marginTop: 12 }}>
        <Link href="/me" className="button ghost">
          个人中心
        </Link>
        <Link href="/notifications" className="button ghost">
          通知
        </Link>
        <button
          className="ghost"
          onClick={() => {
            clearSession();
            window.location.href = "/";
          }}
        >
          退出
        </button>
      </div>
    </div>
  );
}
