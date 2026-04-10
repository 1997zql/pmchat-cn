const APP_EVENT_PREFIX = "pmchat:";

export const APP_EVENTS = {
  notificationsChanged: `${APP_EVENT_PREFIX}notifications-changed`
} as const;

export function emitAppEvent(name: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(name));
}

export function onAppEvent(name: string, callback: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => callback();
  window.addEventListener(name, handler);
  return () => {
    window.removeEventListener(name, handler);
  };
}
