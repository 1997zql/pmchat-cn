import "./globals.css";
import "./topics-chat-toolbox.css";
import Link from "next/link";
import { ReactNode } from "react";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { AppShellNav } from "../components/app-shell-nav";
import { AppShellRail } from "../components/app-shell-rail";
import { SessionBar } from "../components/session-bar";
import { SessionNav } from "../components/session-nav";
import { TopPrimaryNav } from "../components/top-primary-nav";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading"
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <header className="header">
          <div className="header-inner">
            <Link href="/" className="brand">
              <span className="brand-mark">PM</span>
              <span className="brand-copy">
                <strong>PM社区</strong>
                <span className="brand-version">1.0</span>
              </span>
            </Link>
            <TopPrimaryNav />
            <nav className="nav">
              <SessionNav />
            </nav>
          </div>
        </header>
        <div className="app-shell layout">
          <AppShellNav />
          <main className="shell-content">{children}</main>
          <AppShellRail />
        </div>
        <div className="layout layout-footer">
          <SessionBar />
        </div>
      </body>
    </html>
  );
}
