"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { apiFetch } from "../lib/api";
import { buildLoginHref, getStoredUser, SessionUser } from "../lib/auth";

type Channel = { id: string; name: string; slug: string };
type Message = {
  id: string;
  content: string;
  status?: string;
  tempClientId?: string;
  author: { id?: string; nickname: string };
  createdAt: string;
};

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
  autoConnect: false
});

const CHANNEL_COPY: Record<string, string> = {
  general: "欢迎交流行业经验、求职信息和日常吐槽。",
  ai: "聚焦 AI 产品、模型能力、Agent 和自动化工作流。",
  growth: "围绕拉新、留存、活动、转化和数据复盘。",
  b2b: "后台、流程、权限、协作和企业产品实践。",
  career: "求职、转岗、晋升、团队协作和职场经验。",
  feedback: "产品吐槽、需求争议和一线真实反馈。",
  tools: "模板、工具、方法论和效率实践。",
  random: "轻松聊天，适合挂着看和即时互动。"
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "numeric",
  day: "numeric"
});

export function ChatRoom() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelId, setChannelId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ id?: string; nickname: string }>>([]);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const streamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    apiFetch<Channel[]>("/chat/channels")
      .then((result) => {
        setChannels(result);
        if (!result.length) return;
        const storedChannelId =
          typeof window !== "undefined" ? window.localStorage.getItem("pmchat_chat_channel") : null;
        const matched = result.find((item) => item.id === storedChannelId);
        setChannelId((matched || result[0]).id);
      })
      .catch((error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    if (!channelId) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pmchat_chat_channel", channelId);
    }
    apiFetch<Message[]>(`/chat/channels/${channelId}/messages`)
      .then((result) => {
        setMessages(result);
        setMessage("");
      })
      .catch((error) => setMessage(error.message));
  }, [channelId]);

  useEffect(() => {
    socket.connect();
    socket.on("chat:message", (nextMessage: Message) => {
      setMessages((prev) => {
        if (nextMessage.tempClientId) {
          const pendingIndex = prev.findIndex((item) => item.id === nextMessage.tempClientId);
          if (pendingIndex >= 0) {
            const next = [...prev];
            next[pendingIndex] = nextMessage;
            return next;
          }
        }
        if (prev.some((item) => item.id === nextMessage.id)) {
          return prev;
        }
        return [...prev, nextMessage];
      });
    });
    socket.on("chat:error", (payload: { message: string; code?: string }) => {
      if (payload.code === "CHANNEL_UNAVAILABLE" && channels.length) {
        setChannelId(channels[0].id);
      }
      setMessage(getErrorMessage(payload));
      setMessages((prev) => prev.map((item) => (item.status === "SENDING" ? { ...item, status: "FAILED" } : item)));
    });
    socket.on(
      "presence:update",
      (payload: { channelId: string; onlineCount: number; users?: Array<{ id?: string; nickname: string }> }) => {
        if (payload.channelId === channelId) {
          setOnlineCount(payload.onlineCount);
          setOnlineUsers(payload.users || []);
        }
      }
    );
    socket.on("chat:recall", (nextMessage: Message) => {
      setMessages((prev) => prev.map((item) => (item.id === nextMessage.id ? nextMessage : item)));
    });
    return () => {
      socket.off("chat:message");
      socket.off("chat:error");
      socket.off("presence:update");
      socket.off("chat:recall");
      socket.disconnect();
    };
  }, [channelId, channels]);

  useEffect(() => {
    if (!channelId) return;
    const payload = {
      channelId,
      userId: currentUser?.id,
      nickname: currentUser?.nickname
    };
    if (socket.connected) {
      socket.emit("join", payload);
      return;
    }
    const connectHandler = () => socket.emit("join", payload);
    socket.once("connect", connectHandler);
    return () => {
      socket.off("connect", connectHandler);
    };
  }, [channelId, currentUser]);

  useEffect(() => {
    if (!streamRef.current) return;
    streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [messages]);

  const currentChannel = useMemo(() => channels.find((item) => item.id === channelId), [channels, channelId]);
  const todayText = `今天是 ${dateFormatter.format(new Date())}，欢迎大家畅所欲言`;

  function formatTime(value: string) {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }

  function getErrorMessage(payload: { message: string; code?: string }) {
    if (payload.code === "UNAUTHORIZED") return "请先登录后再发送频道消息";
    if (payload.code === "MUTED") return "当前账号已被禁言";
    if (payload.code === "SENSITIVE") return "消息未发送成功，请调整内容后重试";
    if (payload.code === "EMPTY_CONTENT") return "请输入消息内容";
    if (payload.code === "CHANNEL_UNAVAILABLE") return "当前频道暂不可用，已为你切换到可用频道";
    return payload.message;
  }

  function redirectToLogin() {
    window.location.href = buildLoginHref("/chat");
  }

  function handleRecall(messageId: string) {
    if (!channelId || !currentUser) return;
    socket.emit("chat:recall", { messageId, channelId, userId: currentUser.id });
  }

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!channelId) {
      setMessage("请先选择频道");
      return;
    }
    if (!currentUser) {
      redirectToLogin();
      return;
    }
    if (!content.trim()) {
      setMessage("请输入消息内容");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        tempClientId: tempId,
        content: content.trim(),
        status: "SENDING",
        author: { id: currentUser.id, nickname: currentUser.nickname },
        createdAt: new Date().toISOString()
      }
    ]);
    socket.emit("chat:send", { channelId, userId: currentUser.id, content: content.trim(), clientId: tempId });
    setContent("");
  }

  return (
    <section className="card chat-room-panel">
      <div className="chat-room-top">
        <div className="chat-room-top-main">
          <label className="field chat-select-field">
            <span>选择频道</span>
            <select value={channelId} onChange={(event) => setChannelId(event.target.value)}>
              {channels.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </select>
          </label>
          <div className="chat-online-row">
            <span className="chat-online-dot" />
            <span>当前在线 {onlineCount} 人</span>
          </div>
        </div>
        <div className="chat-room-top-note">
          {!currentUser ? (
            <span>登录后可发消息、撤回自己的消息，并记住上次所在频道。</span>
          ) : (
            <span>{CHANNEL_COPY[currentChannel?.slug || "general"] || "欢迎进入 PM 茶水间持续交流。"}</span>
          )}
        </div>
      </div>

      {message ? <div className="chat-status-banner">{message}</div> : null}

      <div className="chat-empty-intro">
        <div className="chat-empty-icon">聊</div>
        <h2>欢迎来到 PM 茶水间</h2>
        <p>{CHANNEL_COPY[currentChannel?.slug || "general"] || "这是产品经理的专属聊天频道。"} </p>
      </div>

      <div className="chat-message-surface" ref={streamRef}>
        <div className="chat-date-divider">{todayText}</div>
        {messages.length ? (
          messages.map((item, index) => {
            const isSelf = currentUser?.id === item.author.id;
            const canRecall = item.status !== "RECALLED" && (isSelf || currentUser?.role === "ADMIN");
            return (
              <div key={item.id} className={`chat-bubble-row ${isSelf ? "self" : ""}`}>
                <div className={`chat-bubble-avatar avatar-${index % 5}`}>{item.author.nickname.slice(0, 1)}</div>
                <div className="chat-bubble-content">
                  <div className="chat-bubble-meta">
                    <strong>{item.author.nickname}</strong>
                    <span>{formatTime(item.createdAt)}</span>
                  </div>
                  <div className={`chat-bubble ${isSelf ? "self" : ""}`}>
                    {item.status === "RECALLED" ? "这条消息已被撤回" : item.content}
                  </div>
                  <div className="chat-bubble-actions">
                    <span>
                      {item.status === "FAILED"
                        ? "发送失败"
                        : item.status === "SENDING"
                          ? "发送中"
                          : item.status === "RECALLED"
                            ? "已撤回"
                            : "已送达"}
                    </span>
                    {canRecall ? (
                      <button type="button" className="text-button" onClick={() => handleRecall(item.id)}>
                        撤回
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="chat-message-empty">当前频道还没有消息，欢迎发第一条。</div>
        )}
      </div>

      <form className="chat-composer" onSubmit={handleSend}>
        <textarea
          placeholder={currentUser ? "输入频道消息" : "登录后可发送频道消息"}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        <div className="chat-composer-footer">
          <div className="chat-online-users">
            {onlineUsers.slice(0, 4).map((item) => (
              <span key={`${item.id || item.nickname}`} className="pill pill-muted">
                {item.nickname}
              </span>
            ))}
          </div>
          <button className="button primary" type="submit">
            发送消息
          </button>
        </div>
      </form>
    </section>
  );
}
