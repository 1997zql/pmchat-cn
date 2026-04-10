"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { buildLoginHref, getStoredToken } from "../lib/auth";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type PostFormData = {
  title: string;
  content: string;
  categoryId: string;
  type: string;
  tags: string[];
  coverUrl?: string | null;
  status?: string;
  reviewReason?: string | null;
};

export function PostCreateForm({
  mode = "create",
  postId,
  initialData
}: {
  mode?: "create" | "edit";
  postId?: string;
  initialData?: PostFormData;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("ARTICLE");
  const [tags, setTags] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const draftKey = mode === "edit" && postId ? `pmchat_draft_post_${postId}` : "pmchat_draft_create";

  useEffect(() => {
    apiFetch<Category[]>("/posts/meta/categories")
      .then(setCategories)
      .catch((error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setCategoryId(initialData.categoryId || "");
      setType(initialData.type || "ARTICLE");
      setTags((initialData.tags || []).join(", "));
      setCoverUrl(initialData.coverUrl || "");
      return;
    }
  }, [initialData]);

  useEffect(() => {
    if (mode === "edit" && initialData) return;
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as {
        title?: string;
        content?: string;
        categoryId?: string;
        type?: string;
        tags?: string;
        coverUrl?: string;
      };
      setTitle(draft.title || "");
      setContent(draft.content || "");
      setCategoryId(draft.categoryId || "");
      setType(draft.type || "ARTICLE");
      setTags(draft.tags || "");
      setCoverUrl(draft.coverUrl || "");
      setDraftSaved(true);
    } catch {
      // ignore invalid draft
    }
  }, [draftKey, initialData, mode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(
        draftKey,
        JSON.stringify({ title, content, categoryId, type, tags, coverUrl })
      );
      if (title || content || categoryId || tags || coverUrl) {
        setDraftSaved(true);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [title, content, categoryId, type, tags, coverUrl, draftKey]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      if (!getStoredToken()) {
        window.location.href = buildLoginHref(mode === "edit" && postId ? `/posts/${postId}/edit` : "/create");
        return;
      }
      if (!title.trim()) {
        setMessage("请输入标题");
        return;
      }
      if (!categoryId) {
        setMessage("请选择分类");
        return;
      }
      if (!content.trim()) {
        setMessage("请输入正文内容");
        return;
      }
      const result = await apiFetch<{ id: string; status: string; reviewReason?: string | null }>(
        mode === "edit" && postId ? `/posts/${postId}` : "/posts",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          body: JSON.stringify({
            title,
            content,
            categoryId,
            type,
            coverUrl: coverUrl || undefined,
            tags: tags
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          })
        }
      );
      window.localStorage.removeItem(draftKey);
      setMessage(
        mode === "edit"
          ? `更新成功，当前状态：${result.status}${result.reviewReason ? `，审核说明：${result.reviewReason}` : ""}`
          : `发布成功，状态：${result.status}`
      );
      window.location.href = `/posts/${result.id}`;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : mode === "edit" ? "更新失败" : "发布失败");
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="field">
        <span>标题</span>
        <input placeholder="给这篇内容起一个清晰标题" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <div className="split">
        <label className="field">
          <span>内容类型</span>
          <select value={type} onChange={(e) => setType(e.target.value)} disabled={mode === "edit"}>
            <option value="ARTICLE">文章</option>
            <option value="QUESTION">问答</option>
            <option value="DISCUSSION">讨论</option>
          </select>
        </label>
        <label className="field">
          <span>分类</span>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">选择分类</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>封面链接</span>
        <input
          placeholder="可填写封面图片链接"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
        />
      </label>
      <label className="field">
        <span>标签</span>
        <input
          placeholder="标签，使用英文逗号分隔"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </label>
      <label className="field">
        <span>正文</span>
        <textarea
          placeholder="输入正文内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      {mode === "edit" && initialData?.status ? (
        <div className="muted">
          当前状态：{initialData.status}
          {initialData.reviewReason ? ` · 审核说明：${initialData.reviewReason}` : ""}
        </div>
      ) : null}
      {draftSaved ? (
        <div className="muted">{mode === "edit" ? "编辑草稿已自动保存" : "草稿已自动保存"}</div>
      ) : null}
      <div className="stats-row" style={{ justifyContent: "space-between" }}>
        <div className="stats-row">
          <span className="pill pill-muted">支持草稿恢复</span>
          <span className="pill pill-muted">分类必填</span>
        </div>
        <button className="primary" type="submit">
          {mode === "edit" ? "保存更新" : "发布内容"}
        </button>
      </div>
      {message ? <div className="muted">{message}</div> : null}
    </form>
  );
}
