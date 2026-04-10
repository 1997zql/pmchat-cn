"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { getStoredUser, setSession } from "../lib/auth";

type PostSummary = { id: string; title: string; status?: string };
type FavoriteSummary = { id: string; title: string };
type CommentSummary = { id: string; content: string; post: { id: string; title: string } };
type NotificationSummary = { id: string; title: string; isRead: boolean };

type MeData = {
  id: string;
  email?: string;
  nickname: string;
  bio?: string | null;
  title?: string | null;
  company?: string | null;
  yearsOfExp?: string | null;
  interests?: string[];
  role?: string;
  followers: unknown[];
  following: unknown[];
  posts: PostSummary[];
  favorites: FavoriteSummary[];
  comments: CommentSummary[];
  notifications: NotificationSummary[];
};

export function ProfileDashboard() {
  const [data, setData] = useState<MeData | null>(null);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nickname: "",
    title: "",
    bio: "",
    company: "",
    yearsOfExp: "",
    interests: ""
  });

  useEffect(() => {
    if (!getStoredUser()) {
      setMessage("请先登录后查看个人中心");
      return;
    }

    apiFetch<MeData>("/users/me")
      .then((result) => {
        setData(result);
        setForm({
          nickname: result.nickname || "",
          title: result.title || "",
          bio: result.bio || "",
          company: result.company || "",
          yearsOfExp: result.yearsOfExp || "",
          interests: (result.interests || []).join(", ")
        });
      })
      .catch((error) => setMessage(error.message));
  }, []);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    try {
      const result = await apiFetch<MeData>("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          nickname: form.nickname.trim(),
          title: form.title.trim(),
          bio: form.bio.trim(),
          company: form.company.trim(),
          yearsOfExp: form.yearsOfExp.trim(),
          interests: form.interests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        })
      });
      setData((prev) => (prev ? { ...prev, ...result } : result));
      const stored = getStoredUser();
      if (stored) {
        setSession(localStorage.getItem("pmchat_access_token") || "", {
          ...stored,
          nickname: result.nickname,
          title: result.title
        });
      }
      setEditing(false);
      setMessage("个人资料已更新");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "资料保存失败");
    }
  }

  if (message && !data) {
    return <div className="card muted">{message}</div>;
  }

  if (!data) {
    return <div className="card muted">正在加载个人中心...</div>;
  }

  return (
    <div className="stack">
      <section className="profile-shell">
        <div className="card profile-main-card">
          <div className="feed-author-row">
            <div className="feed-avatar">{data.nickname.slice(0, 1)}</div>
            <div className="feed-author-meta">
              <div className="feed-author-name">
                <strong>{data.nickname}</strong>
                <span className="feed-badge subtle">{data.title || "PM社区用户"}</span>
              </div>
              <div className="feed-author-sub">{data.company || "暂未填写公司"} · {data.yearsOfExp || "经验待补充"}</div>
            </div>
          </div>
          <p className="profile-bio">{data.bio || "这个用户还没有填写简介。"}</p>
          <div className="stats-row rail-tag-grid">
            {(data.interests || []).map((item) => (
              <span key={item} className="pill pill-muted">
                #{item}
              </span>
            ))}
          </div>
          <div className="summary-actions">
            <button className="button ghost" type="button" onClick={() => setEditing((prev) => !prev)}>
              {editing ? "收起资料编辑" : "编辑资料"}
            </button>
            <Link href="/notifications" className="button ghost">
              查看通知
            </Link>
            <Link href="/settings" className="button ghost">
              账号设置
            </Link>
          </div>
          {editing ? (
            <form className="form profile-edit-form" onSubmit={handleSave}>
              <input
                placeholder="昵称"
                value={form.nickname}
                onChange={(event) => setForm((prev) => ({ ...prev, nickname: event.target.value }))}
              />
              <input
                placeholder="职位头衔"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
              <input
                placeholder="公司"
                value={form.company}
                onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              />
              <input
                placeholder="工作年限"
                value={form.yearsOfExp}
                onChange={(event) => setForm((prev) => ({ ...prev, yearsOfExp: event.target.value }))}
              />
              <input
                placeholder="兴趣标签，英文逗号分隔"
                value={form.interests}
                onChange={(event) => setForm((prev) => ({ ...prev, interests: event.target.value }))}
              />
              <textarea
                placeholder="个人简介"
                value={form.bio}
                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
              />
              <div className="stats-row">
                <button className="button primary" type="submit">
                  保存资料
                </button>
                <button className="button ghost" type="button" onClick={() => setEditing(false)}>
                  取消
                </button>
              </div>
            </form>
          ) : null}
          {message ? <div className="muted">{message}</div> : null}
        </div>

        <div className="card profile-side-card">
          <span className="eyebrow">个人概览</span>
          <h2 className="section-title">我的沉淀</h2>
          <div className="summary-metrics detail-author-metrics">
            <div>
              <strong>{data.posts.length}</strong>
              <span>帖子</span>
            </div>
            <div>
              <strong>{data.followers.length}</strong>
              <span>粉丝</span>
            </div>
            <div>
              <strong>{data.following.length}</strong>
              <span>关注</span>
            </div>
          </div>
          <div className="stack muted">
            <span>邮箱：{data.email || "暂未显示"}</span>
            <span>公司：{data.company || "暂未填写"}</span>
            <span>经验：{data.yearsOfExp || "暂未填写"}</span>
          </div>
        </div>
      </section>

      <section className="profile-grid">
        <div className="card">
          <div className="list-card-header">
            <h3 className="section-title">我的帖子</h3>
            <span className="pill">共 {data.posts.length} 条</span>
          </div>
          <div className="stack">
            {data.posts.length ? (
              data.posts.map((post) => (
                <div key={post.id} className="compact-link-card">
                  <Link href={`/posts/${post.id}`}>
                    <strong>{post.title}</strong>
                  </Link>
                  <span>状态：{post.status || "PUBLISHED"}</span>
                  <div className="stats-row">
                    <Link href={`/posts/${post.id}/edit`} className="button ghost">
                      编辑
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="muted">还没有发布内容。</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="list-card-header">
            <h3 className="section-title">我的收藏</h3>
            <span className="pill">共 {data.favorites.length} 条</span>
          </div>
          <div className="stack">
            {data.favorites.length ? (
              data.favorites.map((item) => (
                <Link key={item.id} href={`/posts/${item.id}`} className="compact-link-card">
                  <strong>{item.title}</strong>
                  <span>收藏后可随时回看</span>
                </Link>
              ))
            ) : (
              <div className="muted">还没有收藏内容。</div>
            )}
          </div>
        </div>
      </section>

      <section className="profile-grid">
        <div className="card">
          <div className="list-card-header">
            <h3 className="section-title">我的评论</h3>
            <span className="pill">共 {data.comments.length} 条</span>
          </div>
          <div className="stack">
            {data.comments.length ? (
              data.comments.map((comment) => (
                <div key={comment.id} className="compact-link-card">
                  <strong>{comment.content}</strong>
                  <span>
                    帖子：<Link href={`/posts/${comment.post.id}`}>{comment.post.title}</Link>
                  </span>
                </div>
              ))
            ) : (
              <div className="muted">还没有评论记录。</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="list-card-header">
            <h3 className="section-title">最近通知</h3>
            <span className="pill">共 {data.notifications.length} 条</span>
          </div>
          <div className="stack">
            {data.notifications.length ? (
              data.notifications.map((notice) => (
                <div key={notice.id} className={`compact-link-card notification-card ${notice.isRead ? "" : "unread"}`}>
                  <strong>{notice.title}</strong>
                  <span>{notice.isRead ? "已读" : "未读"}</span>
                </div>
              ))
            ) : (
              <div className="muted">暂无通知。</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
