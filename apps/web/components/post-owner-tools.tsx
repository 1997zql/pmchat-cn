"use client";

import Link from "next/link";
import { getStoredUser } from "../lib/auth";

export function PostOwnerTools({
  authorId,
  postId,
  status,
  reviewReason
}: {
  authorId: string;
  postId: string;
  status?: string;
  reviewReason?: string | null;
}) {
  const user = getStoredUser();

  if (!user || user.id !== authorId) {
    return null;
  }

  return (
    <div className="card">
      <h3 className="section-title">作者操作</h3>
      <div className="detail-note">
        当前状态：{status || "PUBLISHED"}
        {reviewReason ? ` · 审核说明：${reviewReason}` : ""}
      </div>
      <div className="stats-row" style={{ marginTop: 12 }}>
        <Link href={`/posts/${postId}/edit`} className="button ghost">
          编辑内容
        </Link>
      </div>
    </div>
  );
}
