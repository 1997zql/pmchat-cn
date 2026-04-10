"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/create", label: "发帖" },
  { href: "/search", label: "搜索" },
  { href: "/chat", label: "茶水间" }
];

export function TopPrimaryNav() {
  const pathname = usePathname();

  return (
    <div className="top-primary-nav">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className={`top-primary-link ${active ? "active" : ""}`}>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
