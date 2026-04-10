"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { getStoredUser } from "../lib/auth";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

type ChannelItem = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder?: number;
};

type AdminState = {
  users: Array<{ id: string; nickname: string; email: string; status: string }>;
  posts: Array<{ id: string; title: string; status: string; author: { nickname: string } }>;
  reports: Array<{ id: string; reason: string; status: string; reporter: { nickname: string } }>;
  categories: CategoryItem[];
  channels: ChannelItem[];
};

const emptyCategory = { slug: "", name: "", description: "", sortOrder: 0, isActive: true };
const emptyChannel = { slug: "", name: "", description: "", sortOrder: 0 };

export function AdminConsole() {
  const [data, setData] = useState<AdminState | null>(null);
  const [message, setMessage] = useState("");
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [channelForm, setChannelForm] = useState(emptyChannel);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);

  async function load() {
    try {
      const [users, posts, reports, categories, channels] = await Promise.all([
        apiFetch<AdminState["users"]>("/admin/users"),
        apiFetch<AdminState["posts"]>("/admin/posts"),
        apiFetch<AdminState["reports"]>("/admin/reports"),
        apiFetch<AdminState["categories"]>("/admin/categories"),
        apiFetch<AdminState["channels"]>("/admin/channels")
      ]);
      setData({ users, posts, reports, categories, channels });
      setMessage("");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "后台加载失败";
      setMessage(nextMessage.includes("403") ? "当前账号无权限访问后台。" : nextMessage);
    }
  }

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      setMessage("请先登录管理员账号");
      return;
    }
    void load();
  }, []);

  async function patch(path: string, body: Record<string, string>) {
    try {
      await apiFetch(path, { method: "PATCH", body: JSON.stringify(body) });
      setMessage("操作已生效");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "操作失败");
    }
  }

  function startEditCategory(item: CategoryItem) {
    setEditingCategoryId(item.id);
    setCategoryForm({
      slug: item.slug,
      name: item.name,
      description: item.description || "",
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive ?? true
    });
  }

  function startEditChannel(item: ChannelItem) {
    setEditingChannelId(item.id);
    setChannelForm({
      slug: item.slug,
      name: item.name,
      description: item.description || "",
      sortOrder: item.sortOrder || 0
    });
  }

  async function submitCategory() {
    try {
      await apiFetch(editingCategoryId ? `/admin/categories/${editingCategoryId}` : "/admin/categories", {
        method: editingCategoryId ? "PATCH" : "POST",
        body: JSON.stringify(categoryForm)
      });
      setCategoryForm(emptyCategory);
      setEditingCategoryId(null);
      setMessage(editingCategoryId ? "分类已更新" : "分类已创建");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "分类保存失败");
    }
  }

  async function submitChannel() {
    try {
      await apiFetch(editingChannelId ? `/admin/channels/${editingChannelId}` : "/admin/channels", {
        method: editingChannelId ? "PATCH" : "POST",
        body: JSON.stringify(channelForm)
      });
      setChannelForm(emptyChannel);
      setEditingChannelId(null);
      setMessage(editingChannelId ? "频道已更新" : "频道已创建");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "频道保存失败");
    }
  }

  if (!data) {
    return <div className="card muted">{message || "正在加载后台..."}</div>;
  }

  return (
    <div className="stack">
      <section className="card admin-hero">
        <div className="page-title">
          <span className="eyebrow">运营后台</span>
          <h1>把社区运营动作收进一个正式后台</h1>
          <div className="page-subtitle">这里不是只读看板，而是用户处理、内容审核、举报流转、分类配置和频道管理的真实工作台。</div>
        </div>
        <div className="admin-summary-grid">
          <div className="notification-summary-card">
            <strong>{data.users.length}</strong>
            <span>用户</span>
          </div>
          <div className="notification-summary-card">
            <strong>{data.posts.length}</strong>
            <span>帖子</span>
          </div>
          <div className="notification-summary-card">
            <strong>{data.reports.length}</strong>
            <span>举报单</span>
          </div>
          <div className="notification-summary-card">
            <strong>{data.channels.length}</strong>
            <span>频道</span>
          </div>
        </div>
      </section>

      {message ? <div className="card muted">{message}</div> : null}

      <div className="admin-console-grid">
        <div className="card admin-panel-card">
          <div className="list-card-header">
            <h3 className="section-title">用户管理</h3>
            <span className="pill">状态控制</span>
          </div>
          <div className="stack">
            {data.users.map((user) => (
              <div key={user.id} className="admin-list-card">
                <div className="stack" style={{ gap: 8 }}>
                  <strong>{user.nickname}</strong>
                  <div className="muted">{user.email} · 当前状态 {user.status}</div>
                </div>
                <div className="stats-row">
                  <button className="ghost" onClick={() => void patch(`/admin/users/${user.id}/status`, { status: "ACTIVE" })}>恢复</button>
                  <button className="ghost" onClick={() => void patch(`/admin/users/${user.id}/status`, { status: "MUTED" })}>禁言</button>
                  <button className="ghost" onClick={() => void patch(`/admin/users/${user.id}/status`, { status: "BANNED" })}>封禁</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card admin-panel-card">
          <div className="list-card-header">
            <h3 className="section-title">内容审核</h3>
            <span className="pill">状态流转</span>
          </div>
          <div className="stack">
            {data.posts.map((post) => (
              <div key={post.id} className="admin-list-card">
                <div className="stack" style={{ gap: 8 }}>
                  <strong>{post.title}</strong>
                  <div className="muted">{post.author.nickname} · 当前状态 {post.status}</div>
                </div>
                <div className="stats-row">
                  <button className="ghost" onClick={() => void patch(`/admin/posts/${post.id}/status`, { status: "PUBLISHED" })}>通过</button>
                  <button className="ghost" onClick={() => void patch(`/admin/posts/${post.id}/status`, { status: "OFFLINE" })}>下架</button>
                  <button className="ghost" onClick={() => void patch(`/admin/posts/${post.id}/status`, { status: "PENDING_REVIEW" })}>待审</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-console-grid">
        <div className="card admin-panel-card">
          <div className="list-card-header">
            <h3 className="section-title">举报中心</h3>
            <span className="pill">流转处理</span>
          </div>
          <div className="stack">
            {data.reports.map((report) => (
              <div key={report.id} className="admin-list-card">
                <div className="stack" style={{ gap: 8 }}>
                  <strong>{report.reason}</strong>
                  <div className="muted">{report.reporter.nickname} · 当前状态 {report.status}</div>
                </div>
                <div className="stats-row">
                  <button className="ghost" onClick={() => void patch(`/admin/reports/${report.id}/status`, { status: "IN_PROGRESS", handleNote: "处理中" })}>处理中</button>
                  <button className="ghost" onClick={() => void patch(`/admin/reports/${report.id}/status`, { status: "REJECTED", handleNote: "已驳回" })}>驳回</button>
                  <button className="ghost" onClick={() => void patch(`/admin/reports/${report.id}/status`, { status: "PUNISHED", handleNote: "已处罚" })}>处罚</button>
                  <button className="ghost" onClick={() => void patch(`/admin/reports/${report.id}/status`, { status: "CLOSED", handleNote: "已结案" })}>结案</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card admin-panel-card">
          <div className="list-card-header">
            <h3 className="section-title">分类与频道</h3>
            <span className="pill">基础配置</span>
          </div>
          <div className="stack">
            <div className="admin-form-card">
              <strong>{editingCategoryId ? "编辑分类" : "新增分类"}</strong>
              <div className="form" style={{ marginTop: 12 }}>
                <input placeholder="分类名称" value={categoryForm.name} onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))} />
                <input placeholder="分类 slug" value={categoryForm.slug} onChange={(event) => setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))} />
                <input placeholder="分类描述" value={categoryForm.description} onChange={(event) => setCategoryForm((prev) => ({ ...prev, description: event.target.value }))} />
                <input placeholder="排序值" type="number" value={categoryForm.sortOrder} onChange={(event) => setCategoryForm((prev) => ({ ...prev, sortOrder: Number(event.target.value) || 0 }))} />
                <label className="muted">
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(event) => setCategoryForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                    style={{ width: "auto", marginRight: 8 }}
                  />
                  启用分类
                </label>
                <div className="stats-row">
                  <button className="primary" type="button" onClick={() => void submitCategory()}>
                    {editingCategoryId ? "保存分类" : "新增分类"}
                  </button>
                  {editingCategoryId ? (
                    <button className="ghost" type="button" onClick={() => { setEditingCategoryId(null); setCategoryForm(emptyCategory); }}>
                      取消编辑
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {data.categories.map((item) => (
              <div key={item.id} className="admin-list-card">
                <div className="stack" style={{ gap: 8 }}>
                  <strong>{item.name}</strong>
                  <div className="muted">{item.slug} · 排序 {item.sortOrder || 0} · {item.isActive === false ? "停用" : "启用"}</div>
                  {item.description ? <div className="muted">{item.description}</div> : null}
                </div>
                <div className="stats-row">
                  <button className="ghost" type="button" onClick={() => startEditCategory(item)}>编辑</button>
                </div>
              </div>
            ))}

            <div className="admin-form-card">
              <strong>{editingChannelId ? "编辑频道" : "新增频道"}</strong>
              <div className="form" style={{ marginTop: 12 }}>
                <input placeholder="频道名称" value={channelForm.name} onChange={(event) => setChannelForm((prev) => ({ ...prev, name: event.target.value }))} />
                <input placeholder="频道 slug" value={channelForm.slug} onChange={(event) => setChannelForm((prev) => ({ ...prev, slug: event.target.value }))} />
                <input placeholder="频道描述" value={channelForm.description} onChange={(event) => setChannelForm((prev) => ({ ...prev, description: event.target.value }))} />
                <input placeholder="排序值" type="number" value={channelForm.sortOrder} onChange={(event) => setChannelForm((prev) => ({ ...prev, sortOrder: Number(event.target.value) || 0 }))} />
                <div className="stats-row">
                  <button className="primary" type="button" onClick={() => void submitChannel()}>
                    {editingChannelId ? "保存频道" : "新增频道"}
                  </button>
                  {editingChannelId ? (
                    <button className="ghost" type="button" onClick={() => { setEditingChannelId(null); setChannelForm(emptyChannel); }}>
                      取消编辑
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {data.channels.map((item) => (
              <div key={item.id} className="admin-list-card">
                <div className="stack" style={{ gap: 8 }}>
                  <strong>{item.name}</strong>
                  <div className="muted">{item.slug} · 排序 {item.sortOrder || 0}</div>
                  {item.description ? <div className="muted">{item.description}</div> : null}
                </div>
                <div className="stats-row">
                  <button className="ghost" type="button" onClick={() => startEditChannel(item)}>编辑</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
