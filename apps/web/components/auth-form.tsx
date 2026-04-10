"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "../lib/api";
import { setSession } from "../lib/auth";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordStrong = password.length >= 8;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const payload =
        mode === "register"
          ? await apiFetch<{
              accessToken: string;
              user: { id: string; nickname: string; role?: string; title?: string | null; email?: string };
            }>("/auth/register", {
              method: "POST",
              body: JSON.stringify({ email, password, nickname })
            })
          : await apiFetch<{
              accessToken: string;
              user: { id: string; nickname: string; role?: string; title?: string | null; email?: string };
            }>("/auth/login", {
              method: "POST",
              body: JSON.stringify({ email, password })
            });

      setSession(payload.accessToken, payload.user);
      setMessage(`${payload.user.nickname}，欢迎进入 PM社区`);
      const next = searchParams.get("next");
      window.location.href = next || "/";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交失败");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form auth-form" onSubmit={handleSubmit}>
      <div className="auth-fields">
        {mode === "register" ? (
          <label className="field">
            <span>昵称</span>
            <input placeholder="例如：Allen / 体验设计 PM" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </label>
        ) : null}
        <label className="field">
          <div className="field-row">
            <span>邮箱</span>
          </div>
          <input placeholder="请输入您的邮箱" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <div className="field-row">
            <span>密码</span>
            {mode === "login" ? (
              <Link href="/forgot-password" className="helper-link">
                忘记密码？
              </Link>
            ) : null}
          </div>
          <input
            placeholder={mode === "register" ? "请设置至少 8 位密码" : "请输入您的密码"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      {mode === "register" ? (
        <div className={`muted auth-strength-copy ${password && passwordStrong ? "success" : ""}`}>
          {password ? (passwordStrong ? "密码强度符合要求" : "密码至少需要 8 位") : "请设置一个至少 8 位的密码"}
        </div>
      ) : (
        <label className="auth-check-row">
          <input type="checkbox" />
          <span>记住我 30 天</span>
        </label>
      )}
      <button className="primary auth-submit-button" type="submit">
        {isSubmitting ? "提交中..." : mode === "register" ? "注册并进入社区" : "登录"}
      </button>
      <div className="muted auth-helper-copy">
        {mode === "register"
          ? "注册成功后会自动登录，并回到你原本想访问的页面。"
          : "当前使用邮箱与密码作为正式登录方式，登录后会恢复通知、个人中心、发帖和茶水间权限。"}
      </div>
      {mode === "register" ? (
        <div className="muted">
          已有账号？<Link href="/login" className="inline-link">立即登录</Link>
        </div>
      ) : null}
      {message ? <div className="muted">{message}</div> : null}
    </form>
  );
}
