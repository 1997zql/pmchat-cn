"use client";

import { FormEvent, useState } from "react";
import { apiFetch } from "../lib/api";
import { buildLoginHref, getStoredUser } from "../lib/auth";

export function CommentForm({
  postId,
  parentId,
  placeholder = "写下你的评论",
  submitLabel = "发布评论",
  onSuccess,
  onCancel
}: {
  postId: string;
  parentId?: string;
  placeholder?: string;
  submitLabel?: string;
  onSuccess?: (comment?: {
    id: string;
    content: string;
    author: { nickname: string };
    replies?: Array<{ id: string; content: string; author: { nickname: string } }>;
  }) => void;
  onCancel?: () => void;
}) {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      if (!getStoredUser()) {
        window.location.href = buildLoginHref(`/posts/${postId}`);
        return;
      }
      if (!content.trim()) {
        setMessage("请输入评论内容");
        return;
      }
      const result = await apiFetch<{
        id: string;
        content: string;
        author: { nickname: string };
        replies?: Array<{ id: string; content: string; author: { nickname: string } }>;
      }>(parentId ? `/comments/${parentId}/reply` : `/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(parentId ? { content } : { content })
      });
      setContent("");
      setMessage(parentId ? "回复已提交" : "评论已提交");
      if (onSuccess) {
        onSuccess(result);
        return;
      }
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : parentId ? "回复失败" : "评论失败");
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className="primary" type="submit">
        {submitLabel}
      </button>
      {onCancel ? (
        <button className="ghost" type="button" onClick={onCancel}>
          取消
        </button>
      ) : null}
      {message ? <div className="muted">{message}</div> : null}
    </form>
  );
}
