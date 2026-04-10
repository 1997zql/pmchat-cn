export type UserStatus = "ACTIVE" | "MUTED" | "BANNED" | "PENDING_DELETION";
export type UserRole = "GUEST" | "USER" | "VERIFIED" | "ADMIN";
export type PostType = "ARTICLE" | "QUESTION" | "DISCUSSION";
export type PostStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "OFFLINE" | "DELETED";
export type CommentStatus = "PUBLISHED" | "PENDING_REVIEW" | "HIDDEN" | "DELETED";
export type ReportStatus = "PENDING" | "IN_PROGRESS" | "REJECTED" | "PUNISHED" | "CLOSED";
export type ChatMessageStatus = "SENDING" | "DELIVERED" | "RECALLED" | "HIDDEN";
export type PresenceStatus = "ONLINE" | "OFFLINE" | "MUTED";

export const CATEGORY_OPTIONS = [
  { slug: "c-end", label: "C端产品" },
  { slug: "b-end", label: "B端产品" },
  { slug: "ai-data", label: "AI/大数据" },
  { slug: "growth", label: "用户增长" },
  { slug: "strategy", label: "策略产品" },
  { slug: "operation", label: "产品运营" }
];

export const CHAT_CHANNELS = [
  { slug: "general", name: "综合交流" },
  { slug: "job", name: "求职交流" },
  { slug: "ask", name: "求助问答" },
  { slug: "rumor", name: "行业八卦" }
];
