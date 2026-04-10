"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "../lib/api";

export function PasswordRecoveryForm({ mode }: { mode: "forgot" | "reset" }) {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPath, setResetPath] = useState<string | null>(searchParams.get("token") ? `/reset-password?token=${encodeURIComponent(searchParams.get("token") || "")}` : null);
  const passwordStrong = password.length >= 8;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      if (mode === "forgot") {
        if (!email.trim()) {
          setMessage("请输入邮箱");
          return;
        }
        const result = await apiFetch<{ message: string; resetPath?: string | null }>("/auth/forgot-password", {
          method: "POST",
          body: JSON.stringify({ email: email.trim() })
        });
        setMessage(result.message);
        setResetPath(result.resetPath || null);
        return;
      }

      const token = searchParams.get("token");
      if (!token) {
        setMessage("重置链接无效，请重新发起密码重置");
        return;
      }
      if (password.length < 8) {
        setMessage("密码至少需要 8 位");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("两次输入的密码不一致");
        return;
      }
      await apiFetch<{ success: boolean }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });
      setMessage("密码已更新，现在可以使用新密码登录");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "提交失败");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form auth-form" onSubmit={handleSubmit}>
      {mode === "forgot" ? (
        <label className="field">
          <span>邮箱</span>
          <input type="email" placeholder="请输入注册邮箱" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
      ) : (
        <>
          <label className="field">
            <span>新密码</span>
            <input type="password" placeholder="至少 8 位" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <label className="field">
            <span>确认密码</span>
            <input type="password" placeholder="再次输入新密码" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
        </>
      )}
      {mode === "reset" ? (
        <div className={`muted auth-strength-copy ${password && passwordStrong ? "success" : ""}`}>
          {password ? (passwordStrong ? "密码强度符合要求" : "密码至少需要 8 位") : "请设置一个至少 8 位的新密码"}
        </div>
      ) : null}
      <button className="primary" type="submit">
        {isSubmitting ? "提交中..." : mode === "forgot" ? "继续重置密码" : "保存新密码"}
      </button>
      {resetPath && mode === "forgot" ? (
        <Link href={resetPath} className="button ghost">
          前往设置新密码
        </Link>
      ) : null}
      <div className="muted">
        {mode === "forgot"
          ? "输入注册邮箱后，系统会生成可继续使用的密码重置入口。"
          : "设置完成后，旧登录会话会自动失效。"}
      </div>
      <div className="muted">
        <Link href="/login" className="inline-link">返回登录</Link>
      </div>
      {message ? <div className="muted">{message}</div> : null}
    </form>
  );
}
