"use client";

import { useEffect, useState } from "react";
import { CommentForm } from "./comment-form";

type CommentItem = {
  id: string;
  content: string;
  author: { nickname: string };
  replies: Array<{ id: string; content: string; author: { nickname: string } }>;
};

export function CommentThread({ postId, comments }: { postId: string; comments: CommentItem[] }) {
  const [list, setList] = useState<CommentItem[]>(comments);
  const [replyingId, setReplyingId] = useState<string | null>(null);

  useEffect(() => {
    setList(comments);
  }, [comments]);

  return (
    <div className="stack detail-comment-thread" style={{ marginTop: 20 }}>
      <CommentForm
        postId={postId}
        onSuccess={(comment) => {
          if (!comment) return;
          setList((prev) => [
            ...prev,
            {
              id: comment.id,
              content: comment.content,
              author: comment.author,
              replies: []
            }
          ]);
        }}
      />
      {list.length ? (
        list.map((comment) => (
          <div key={comment.id} className="feed-card comment-card">
            <div className="feed-author-row">
              <div className="feed-avatar">{comment.author.nickname.slice(0, 1)}</div>
              <div className="feed-author-meta">
                <div className="feed-author-name">
                  <strong>{comment.author.nickname}</strong>
                </div>
                <div className="feed-author-sub">评论内容</div>
              </div>
            </div>
            <p>{comment.content}</p>
            <div className="stats-row">
              <button className="button ghost" type="button" onClick={() => setReplyingId((current) => (current === comment.id ? null : comment.id))}>
                {replyingId === comment.id ? "取消回复" : "回复"}
              </button>
            </div>
            {replyingId === comment.id ? (
              <CommentForm
                postId={postId}
                parentId={comment.id}
                placeholder={`回复 ${comment.author.nickname}`}
                submitLabel="提交回复"
                onSuccess={(reply) => {
                  if (!reply) return;
                  setList((prev) =>
                    prev.map((item) =>
                      item.id === comment.id
                        ? {
                            ...item,
                            replies: [...item.replies, { id: reply.id, content: reply.content, author: reply.author }]
                          }
                        : item
                    )
                  );
                  setReplyingId(null);
                }}
                onCancel={() => setReplyingId(null)}
              />
            ) : null}
            {comment.replies.length ? (
              <div className="stack comment-reply-list" style={{ marginTop: 12 }}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="chat-message comment-reply-card">
                    <strong>{reply.author.nickname}</strong>
                    <div>{reply.content}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <div className="muted">还没有评论，来留下第一条反馈吧。</div>
      )}
    </div>
  );
}
