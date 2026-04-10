"use client";

export type SessionUser = {
  id: string;
  nickname: string;
  email?: string;
  role?: string;
  title?: string | null;
};

const AUTH_EVENT = "pmchat:auth-changed";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("pmchat_access_token");
}

export function getStoredUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("pmchat_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("pmchat_access_token");
  window.localStorage.removeItem("pmchat_user");
  window.localStorage.removeItem("pmchat_user_id");
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function setSession(accessToken: string, user: SessionUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("pmchat_access_token", accessToken);
  window.localStorage.setItem("pmchat_user", JSON.stringify(user));
  window.localStorage.setItem("pmchat_user_id", user.id);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function buildLoginHref(nextPath?: string) {
  if (!nextPath) return "/login";
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export function onAuthChange(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => callback();
  const storageHandler = (event: StorageEvent) => {
    if (!event.key || event.key.startsWith("pmchat_")) {
      callback();
    }
  };
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
