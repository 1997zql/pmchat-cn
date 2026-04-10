"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { getStoredUser, setSession } from "../lib/auth";

type SettingsData = {
  nickname: string;
  email?: string;
  title?: string | null;
  bio?: string | null;
  company?: string | null;
  yearsOfExp?: string | null;
  interests?: string[];
};

export function SettingsPanel() {
  const [form, setForm] = useState({
    nickname: "",
    title: "",
    bio: "",
    company: "",
    yearsOfExp: "",
    interests: ""
  });
  const [message, setMessage] = useState("");
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "notifications" | "privacy">("profile");

  useEffect(() => {
    apiFetch<SettingsData>("/users/me")
      .then((data) =>
        setForm({
          nickname: data.nickname || "",
          title: data.title || "",
          bio: data.bio || "",
          company: data.company || "",
          yearsOfExp: data.yearsOfExp || "",
          interests: (data.interests || []).join(", ")
        })
      )
      .catch((error) => setMessage(error instanceof Error ? error.message : "加载设置失败"));
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const result = await apiFetch<SettingsData>("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          nickname: form.nickname.trim(),
          title: form.title.trim(),
          bio: form.bio.trim(),
          company: form.company.trim(),
          yearsOfExp: form.yearsOfExp.trim(),
          interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean)
        })
      });
      const stored = getStoredUser();
      if (stored) {
        setSession(localStorage.getItem("pmchat_access_token") || "", {
          ...stored,
          nickname: result.nickname,
          title: result.title
        });
      }
      setMessage("设置已保存");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    }
  }

  return (
    <div className="stack">
      <section className="card settings-hero">
        <div className="page-title">
          <span className="eyebrow">账号设置</span>
          <h1>统一管理资料、安全与通知偏好</h1>
          <div className="page-subtitle">设置页不只是改资料，而是把公开形象、账号安全和消息承接集中到一个地方。</div>
        </div>
        <div className="settings-summary-row">
          <div className="settings-summary-card">
            <strong>{form.nickname || "未填写昵称"}</strong>
            <span>当前昵称</span>
          </div>
          <div className="settings-summary-card">
            <strong>{form.title || "待补充"}</strong>
            <span>个人头衔</span>
          </div>
          <div className="settings-summary-card">
            <strong>{form.interests ? form.interests.split(",").filter(Boolean).length : 0}</strong>
            <span>兴趣标签</span>
          </div>
        </div>
      </section>

      <div className="settings-layout">
        <aside className="card settings-side-nav">
          {[
            { key: "profile", label: "基本信息", desc: "昵称、头衔、公司、兴趣标签" },
            { key: "security", label: "账号安全", desc: "密码与找回流程" },
            { key: "notifications", label: "消息通知", desc: "评论、点赞、关注提醒" },
            { key: "privacy", label: "隐私说明", desc: "公开主页与展示范围" }
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={`settings-nav-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key as "profile" | "security" | "notifications" | "privacy")}
            >
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </button>
          ))}
        </aside>

        <div className="stack">
          <form className="card form" onSubmit={handleSubmit}>
            <div className="page-title">
              <span className="eyebrow">基本信息</span>
              <h2 className="section-title">公开展示资料</h2>
            </div>
            <label className="field">
              <span>昵称</span>
              <input value={form.nickname} onChange={(event) => setForm((prev) => ({ ...prev, nickname: event.target.value }))} />
            </label>
            <label className="field">
              <span>职位头衔</span>
              <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            </label>
            <label className="field">
              <span>公司</span>
              <input value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} />
            </label>
            <label className="field">
              <span>工作年限</span>
              <input value={form.yearsOfExp} onChange={(event) => setForm((prev) => ({ ...prev, yearsOfExp: event.target.value }))} />
            </label>
            <label className="field">
              <span>兴趣标签</span>
              <input value={form.interests} onChange={(event) => setForm((prev) => ({ ...prev, interests: event.target.value }))} placeholder="例如：AI产品, 增长策略, B端产品" />
            </label>
            <label className="field">
              <span>个人简介</span>
              <textarea value={form.bio} onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))} />
            </label>
            <button className="primary" type="submit">
              保存设置
            </button>
            {message ? <div className="muted">{message}</div> : null}
          </form>

          <div className="settings-detail-grid">
            <div className={`card ${activeSection === "security" ? "settings-focus-card" : ""}`}>
              <span className="eyebrow">账号安全</span>
              <h2 className="section-title">账号安全</h2>
              <div className="stack muted">
                <span>当前账号通过邮箱 + 密码进行登录与身份校验。</span>
                <span>如果忘记密码，可直接进入密码重置流程重新设置。</span>
                <span><a href="/forgot-password" className="inline-link">前往重置密码</a></span>
              </div>
            </div>
            <div className={`card ${activeSection === "notifications" ? "settings-focus-card" : ""}`}>
              <span className="eyebrow">通知偏好</span>
              <h2 className="section-title">消息通知</h2>
              <div className="stats-row">
                <span className="pill">评论提醒</span>
                <span className="pill">点赞提醒</span>
                <span className="pill">关注提醒</span>
                <span className="pill pill-muted">系统通知</span>
              </div>
              <div className="muted">建议保留评论、关注和审核通知，方便持续跟进互动与内容状态。</div>
            </div>
            <div className={`card ${activeSection === "privacy" ? "settings-focus-card" : ""}`}>
              <span className="eyebrow">隐私说明</span>
              <h2 className="section-title">公开展示范围</h2>
              <div className="stack muted">
                <span>个人资料默认公开展示昵称、title、简介和兴趣标签。</span>
                <span>公开主页主要用于展示你的内容、关注关系和专业方向。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
