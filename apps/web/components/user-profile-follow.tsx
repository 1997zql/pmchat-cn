"use client";

import { useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { buildLoginHref, getStoredUser } from "../lib/auth";

export function UserProfileFollow({
  userId,
  followerIds
}: {
  userId: string;
  followerIds: string[];
}) {
  const currentUser = getStoredUser();
  const isSelf = currentUser?.id === userId;
  const initialFollowing = useMemo(
    () => Boolean(currentUser && followerIds.includes(currentUser.id)),
    [currentUser, followerIds]
  );
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [followersCount, setFollowersCount] = useState(followerIds.length);
  const [message, setMessage] = useState("");

  if (isSelf) {
    return null;
  }

  async function handleFollow() {
    if (!currentUser) {
      window.location.href = buildLoginHref(`/users/${userId}`);
      return;
    }

    try {
      const result = await apiFetch<{ isFollowing: boolean; followersCount: number }>(`/users/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST"
      });
      setIsFollowing(result.isFollowing);
      setFollowersCount(result.followersCount);
      setMessage(result.isFollowing ? "已关注这位作者" : "已取消关注");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "操作失败");
    }
  }

  return (
    <div className="stack">
      <button className={isFollowing ? "ghost" : "primary"} type="button" onClick={handleFollow}>
        {isFollowing ? "已关注" : "关注作者"}
      </button>
      <div className="muted">粉丝 {followersCount}</div>
      {message ? <div className="muted">{message}</div> : null}
    </div>
  );
}
