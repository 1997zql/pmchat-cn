"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { buildLoginHref, getStoredUser } from "../lib/auth";

export function PostActions({
  postId,
  authorId,
  initialLikeCount,
  initialFavoriteCount,
  initialViewer
}: {
  postId: string;
  authorId: string;
  initialLikeCount: number;
  initialFavoriteCount: number;
  initialViewer?: {
    hasLiked: boolean;
    hasFavorited: boolean;
    isFollowingAuthor: boolean;
  };
}) {
  const [message, setMessage] = useState("");
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);
  const [hasLiked, setHasLiked] = useState(initialViewer?.hasLiked || false);
  const [hasFavorited, setHasFavorited] = useState(initialViewer?.hasFavorited || false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(initialViewer?.isFollowingAuthor || false);
  const [reported, setReported] = useState(false);
  const user = getStoredUser();
  const isAuthor = user?.id === authorId;

  useEffect(() => {
    if (!user) return;
    apiFetch<{
      viewer?: { hasLiked: boolean; hasFavorited: boolean; isFollowingAuthor: boolean };
      likeCount?: number;
      favoriteCount?: number;
    }>(`/posts/${postId}`)
      .then((post) => {
        setHasLiked(Boolean(post.viewer?.hasLiked));
        setHasFavorited(Boolean(post.viewer?.hasFavorited));
        setIsFollowingAuthor(Boolean(post.viewer?.isFollowingAuthor));
        setLikeCount(post.likeCount || 0);
        setFavoriteCount(post.favoriteCount || 0);
      })
      .catch(() => undefined);
  }, [postId, user]);

  async function requireAuth(action: () => Promise<void>) {
    if (!user) {
      window.location.href = buildLoginHref(`/posts/${postId}`);
      return;
    }
    await action();
  }

  return (
    <div className="card detail-action-card">
      <h3 className="section-title">互动操作</h3>
      <div className="stats-row detail-action-row">
        <button className={`button ${hasLiked ? "primary" : "ghost"}`} onClick={() => requireAuth(async () => {
          const result = await apiFetch<{ likeCount: number; hasLiked: boolean }>(`/posts/${postId}/like`, { method: hasLiked ? "DELETE" : "POST" });
          setHasLiked(result.hasLiked);
          setLikeCount(result.likeCount);
          setMessage(result.hasLiked ? "已点赞" : "已取消点赞");
        })}>
          {hasLiked ? `已点赞 ${likeCount}` : `点赞 ${likeCount}`}
        </button>
        <button className={`button ${hasFavorited ? "primary" : "ghost"}`} onClick={() => requireAuth(async () => {
          const result = await apiFetch<{ favoriteCount: number; hasFavorited: boolean }>(`/posts/${postId}/favorite`, { method: hasFavorited ? "DELETE" : "POST" });
          setHasFavorited(result.hasFavorited);
          setFavoriteCount(result.favoriteCount);
          setMessage(result.hasFavorited ? "已收藏" : "已取消收藏");
        })}>
          {hasFavorited ? `已收藏 ${favoriteCount}` : `收藏 ${favoriteCount}`}
        </button>
        {!isAuthor ? (
          <button className={`button ${isFollowingAuthor ? "primary" : "ghost"}`} onClick={() => requireAuth(async () => {
            const result = await apiFetch<{ isFollowing: boolean }>(`/users/${authorId}/follow`, { method: isFollowingAuthor ? "DELETE" : "POST" });
            setIsFollowingAuthor(result.isFollowing);
            setMessage(result.isFollowing ? "已关注作者" : "已取消关注");
          })}>
            {isFollowingAuthor ? "已关注作者" : "关注作者"}
          </button>
        ) : null}
        <button className={`button ${reported ? "primary" : "ghost"}`} disabled={reported} onClick={() => requireAuth(async () => {
          const result = await apiFetch<{ message?: string }>(`/posts/${postId}/report`, {
            method: "POST",
            body: JSON.stringify({ reason: "内容疑似违规", detail: "请后台审核" })
          });
          setReported(true);
          setMessage(result.message || "已提交举报");
        })}>
          {reported ? "已提交举报" : "举报"}
        </button>
      </div>
      {message ? <div className="muted" style={{ marginTop: 12 }}>{message}</div> : null}
    </div>
  );
}
