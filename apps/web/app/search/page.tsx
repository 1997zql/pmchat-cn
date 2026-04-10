"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../../lib/api";

type SearchResult = {
  posts: Array<{
    id: string;
    title: string;
    excerpt: string;
    tags: string[];
    likeCount: number;
    favoriteCount: number;
    author: { id: string; nickname: string; title: string | null };
    category: { name: string; slug: string };
  }>;
  users: Array<{ id: string; nickname: string; title: string | null; bio?: string | null; company?: string | null }>;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchResult>({ posts: [], users: [] });
  const [history, setHistory] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "posts" | "users">("all");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setHistory(JSON.parse(window.localStorage.getItem("pmchat_search_history") || "[]"));
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initialQuery = new URLSearchParams(window.location.search).get("q")?.trim() || "";
    if (!initialQuery) return;
    setQuery(initialQuery);
    void runSearch(initialQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(rawQuery: string) {
    const keyword = rawQuery.trim();
    if (!keyword) {
      setMessage("请输入搜索词");
      return;
    }
    const result = await apiFetch<SearchResult>(`/search?q=${encodeURIComponent(keyword)}`);
    setData(result);
    setMessage(result.posts.length || result.users.length ? "" : "没有找到匹配结果");
    const nextHistory = [keyword, ...history.filter((item) => item !== keyword)].slice(0, 8);
    setHistory(nextHistory);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pmchat_search_history", JSON.stringify(nextHistory));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await runSearch(query);
  }

  const totalCount = data.posts.length + data.users.length;
  const topTags = useMemo(
    () => Array.from(new Set(data.posts.flatMap((post) => post.tags))).slice(0, 6),
    [data.posts]
  );

  return (
    <div className="stack">
      <section className="card search-hero">
        <div className="search-hero-copy">
          <div className="page-title">
            <span className="eyebrow">搜索工作台</span>
            <h1>把内容、作者和方向一次找全</h1>
            <div className="page-subtitle">
              搜索不只是查帖子，而是直接回到你关心的讨论、作者和工作主题，减少重复定位。
            </div>
          </div>
          <form className="search-hero-form" onSubmit={handleSubmit}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索话题、作者、内容关键词，例如：AI 工作流 / B端权限 / PRD 模板"
            />
            <button className="primary" type="submit">
              搜索
            </button>
          </form>
          <div className="search-trend-row">
            <span className="muted">热门搜索</span>
            {["AI产品经理", "B端产品", "用户增长", "PRD", "面试"].map((item) => (
              <button
                key={item}
                className="chip-tab"
                type="button"
                onClick={() => {
                  setQuery(item);
                  void runSearch(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="search-hero-stats">
            <div className="search-stat-card">
              <strong>{totalCount}</strong>
              <span>本次命中结果</span>
            </div>
            <div className="search-stat-card">
              <strong>{history.length}</strong>
              <span>最近搜索记录</span>
            </div>
            <div className="search-stat-card">
              <strong>{topTags.length || 6}</strong>
              <span>可追踪话题标签</span>
            </div>
          </div>
        </div>
        <div className="search-side-card">
          <h3 className="section-title">继续检索</h3>
          <div className="stack">
            <div>
              <div className="muted">最近搜索</div>
              <div className="search-pill-wrap">
                {history.length ? history.map((item) => (
                  <button
                    key={item}
                    className="ghost"
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      void runSearch(item);
                    }}
                  >
                    {item}
                  </button>
                )) : <span className="muted">还没有历史搜索，先试试热门关键词。</span>}
              </div>
            </div>
            <div>
              <div className="muted">常搜方向</div>
              <div className="search-workspace-list">
                {[
                  { label: "内容检索", value: "查帖子、问答、讨论" },
                  { label: "作者检索", value: "快速找到擅长某方向的人" },
                  { label: "标签追踪", value: "用关键词持续跟进主题变化" }
                ].map((item) => (
                  <div key={item.label} className="search-workspace-item">
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="main-grid">
        <div className="stack">
          <div className="card">
            <div className="page-toolbar">
              <div>
                <h3 className="section-title">搜索结果</h3>
                <div className="muted">支持内容和用户分栏查看，结果会保留标签、作者和互动数据。</div>
              </div>
              <div className="stats-row">
                <button className={`chip-tab ${activeTab === "all" ? "active" : ""}`} type="button" onClick={() => setActiveTab("all")}>
                  全部 {totalCount}
                </button>
                <button className={`chip-tab ${activeTab === "posts" ? "active" : ""}`} type="button" onClick={() => setActiveTab("posts")}>
                  内容 {data.posts.length}
                </button>
                <button className={`chip-tab ${activeTab === "users" ? "active" : ""}`} type="button" onClick={() => setActiveTab("users")}>
                  用户 {data.users.length}
                </button>
              </div>
            </div>
            <div className="stack">
              {(activeTab === "all" || activeTab === "posts") && data.posts.length ? data.posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`} className="feed-card search-result-card">
                  <div className="stats-row">
                    <span className="pill">{post.category.name}</span>
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="pill pill-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <strong>{post.title}</strong>
                  <p>{post.excerpt}</p>
                  <div className="muted">{post.author.nickname} · {post.author.title || "产品经理"}</div>
                  <div className="stats-row">
                    <span className="stat-chip">点赞 {post.likeCount}</span>
                    <span className="stat-chip">收藏 {post.favoriteCount}</span>
                  </div>
                </Link>
              )) : null}
              {(activeTab === "all" || activeTab === "posts") && !data.posts.length ? (
                <div className="search-empty-state">
                  <strong>没有找到匹配内容</strong>
                  <span>你可以换个关键词、先去分类广场浏览，或者直接发起一篇新讨论。</span>
                  <div className="stats-row">
                    <Link href="/topics" className="button ghost">去分类广场</Link>
                    <Link href="/create" className="button primary">发起讨论</Link>
                  </div>
                </div>
              ) : null}
              {activeTab === "users" ? (
                data.users.length ? data.users.map((user) => (
                  <Link key={user.id} href={`/users/${user.id}`} className="chat-message search-user-card">
                    <div className="search-user-avatar">{user.nickname.slice(0, 1)}</div>
                    <div className="stack" style={{ gap: 8 }}>
                      <strong>{user.nickname}</strong>
                      <div className="muted">{user.title || "产品经理"}</div>
                      {user.company ? <div className="muted">{user.company}</div> : null}
                      {user.bio ? <div className="muted">{user.bio}</div> : null}
                    </div>
                  </Link>
                )) : <div className="muted">暂无用户结果</div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="stack">
          <div className="card">
            <h3 className="section-title">推荐继续看</h3>
            <div className="search-workspace-list">
              {[
                { label: "分类广场", value: "按方向浏览内容，适合没有明确关键词时使用", href: "/topics" },
                { label: "工具箱", value: "需要模板、题库和方法资料时，从这里继续", href: "/toolbox" },
                { label: "茶水间", value: "想快速问人、看实时讨论，可以直接切入频道", href: "/chat" }
              ].map((item) => (
                <Link key={item.label} href={item.href} className="search-workspace-item link-card">
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="section-title">标签雷达</h3>
            <div className="search-pill-wrap">
              {(topTags.length ? topTags : ["AI工作流", "B端产品", "用户增长", "PRD模板", "产品面试"]).map((item) => (
                <button
                  key={item}
                  className="ghost"
                  onClick={() => {
                    setQuery(item);
                    void runSearch(item);
                  }}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            {message ? <div className="muted" style={{ marginTop: 12 }}>{message}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
