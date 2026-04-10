"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { getStoredUser } from "../lib/auth";
import { APP_EVENTS, emitAppEvent } from "../lib/app-events";

type Notice = {
  id: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt?: string;
};

const FILTER_OPTIONS = [
  { value: "ALL", label: "全部" },
  { value: "LIKE", label: "点赞" },
  { value: "COMMENT", label: "评论" },
  { value: "FOLLOW", label: "关注" },
  { value: "SYSTEM", label: "系统" },
  { value: "REVIEW", label: "审核" }
];

function getFilterLabel(value: string) {
  return FILTER_OPTIONS.find((item) => item.value === value)?.label || value;
}

export function NotificationCenter() {
  const [list, setList] = useState<Notice[]>([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("ALL");

  async function load() {
    try {
      const data = await apiFetch<Notice[]>("/notifications");
      setList(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "加载失败");
    }
  }

  useEffect(() => {
    if (!getStoredUser()) {
      setMessage("请先登录后查看通知");
      return;
    }
    void load();
  }, []);

  async function markAllRead() {
    await apiFetch("/notifications/read", { method: "POST" });
    setList((prev) => prev.map((item) => ({ ...item, isRead: true })));
    emitAppEvent(APP_EVENTS.notificationsChanged);
  }

  async function markOneRead(id: string, link?: string | null) {
    await apiFetch(`/notifications/${id}/read`, { method: "POST" });
    setList((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
    emitAppEvent(APP_EVENTS.notificationsChanged);
    if (link) {
      window.location.href = link;
      return;
    }
  }

  const filtered = filter === "ALL" ? list : list.filter((item) => item.type === filter);
  const unreadCount = list.filter((item) => !item.isRead).length;
  const todayCount = list.filter((item) => {
    if (!item.createdAt) return false;
    return new Date(item.createdAt).toDateString() === new Date().toDateString();
  }).length;

  if (message) {
    return <div className="card muted">{message}</div>;
  }

  return (
    <div className="stack">
      <section className="notification-summary-grid">
        <div className="card notification-summary-card">
          <strong>{unreadCount}</strong>
          <span>未读通知</span>
        </div>
        <div className="card notification-summary-card">
          <strong>{todayCount}</strong>
          <span>今日新增</span>
        </div>
        <div className="card notification-summary-card">
          <strong>{list.length}</strong>
          <span>全部通知</span>
        </div>
      </section>

      <div className="card stack">
        <div className="stats-row" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="section-title" style={{ margin: 0 }}>通知收件箱</h1>
            <div className="muted">未读 {unreadCount} 条，按类型筛选后可以直接跳到对应内容继续处理。</div>
          </div>
          <div className="stats-row">
            <Link href="/settings" className="button ghost">
              通知设置
            </Link>
            <button className="ghost" onClick={() => void markAllRead()}>
              全部已读
            </button>
          </div>
        </div>
        <div className="stats-row">
          {FILTER_OPTIONS.map((item) => (
            <button
              key={item.value}
              className={filter === item.value ? "primary" : "ghost"}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {filtered.length ? filtered.map((item) => (
          <div key={item.id} className={`chat-message stack notification-card ${item.isRead ? "" : "unread"}`}>
            <div className="stats-row" style={{ justifyContent: "space-between" }}>
              <div className="stack" style={{ gap: 8 }}>
                <strong>{item.title}</strong>
                <span className="muted">
                  {getFilterLabel(item.type)}
                  {item.createdAt ? ` · ${new Date(item.createdAt).toLocaleString("zh-CN")}` : ""}
                </span>
              </div>
              <span className={`pill ${item.isRead ? "pill-muted" : ""}`}>
                {item.isRead ? "已读" : "未读"}
              </span>
            </div>
            <div>{item.content}</div>
            <div className="stats-row" style={{ justifyContent: "space-between" }}>
              <span className="muted">打开后会继续带你回到对应内容，不需要自己二次查找。</span>
              <div className="stats-row">
                {!item.isRead ? (
                  <button className="ghost" onClick={() => void markOneRead(item.id)}>
                    标记已读
                  </button>
                ) : null}
                {item.link ? (
                  <Link className="button ghost" href={item.link} onClick={() => void markOneRead(item.id, item.link)}>
                    查看详情
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        )) : <div className="muted">该类型暂无通知，换个筛选看看，或继续参与社区互动。</div>}
      </div>
    </div>
  );
}
