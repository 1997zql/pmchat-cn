"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { clearSession, getStoredUser, onAuthChange, SessionUser } from "../lib/auth";
import { APP_EVENTS, onAppEvent } from "../lib/app-events";

type Notice = {
  id: string;
  isRead: boolean;
};

export function SessionNav() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function sync() {
      const nextUser = getStoredUser();
      setUser(nextUser);
      if (!nextUser) {
        setUnreadCount(0);
        return;
      }
      try {
        const notifications = await apiFetch<Notice[]>("/notifications");
        setUnreadCount(notifications.filter((item) => !item.isRead).length);
      } catch {
        setUnreadCount(0);
      }
    }

    void sync();
    const offAuth = onAuthChange(() => {
      void sync();
    });
    const offNotifications = onAppEvent(APP_EVENTS.notificationsChanged, () => {
      void sync();
    });
    return () => {
      offAuth();
      offNotifications();
    };
  }, []);

  if (!user) {
    return (
      <>
        <Link href="/login" className="nav-link">
          登录
        </Link>
        <Link href="/register" className="button primary nav-cta">
          注册
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/notifications" className="nav-link nav-pill-link">
        通知{unreadCount ? ` ${unreadCount}` : ""}
      </Link>
      <Link href="/me" className="user-chip">
        <span className="user-chip-name">{user.nickname}</span>
        <span className="user-chip-role">{user.title || "PM社区用户"}</span>
      </Link>
      {user.role === "ADMIN" ? (
        <Link href="/admin" className="nav-link">
          中后台
        </Link>
      ) : null}
      <button
        className="nav-button"
        type="button"
        onClick={() => {
          clearSession();
          window.location.href = "/";
        }}
      >
        退出
      </button>
    </>
  );
}
