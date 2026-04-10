# PMChat 上线方案（pmchat.cn）

## TL;DR

当前项目可直接按“静态站点”模式上线，不需要 Node、数据库或后端服务。  
但**现在不能直接发版**，原因有 3 个：

| 项目 | 当前状态 | 结论 |
|---|---|---|
| 项目部署形态 | 静态 HTML/CSS/JS | 可直接走 Nginx |
| 域名解析 | `pmchat.cn -> 198.18.0.80` | 未指向目标服务器 |
| 服务器 SSH | `103.73.161.133:22` 建连后被远端关闭 | 需要先排查 SSH / 安全组 / 白名单 |

结论：**先修 DNS 和 SSH，再执行部署脚本。**

---

## 1. 部署对象设计

### 1.1 部署范围

| 模块 | 类型 | 是否上线 |
|---|---|---|
| 首页 / 分类 / 详情 / 搜索 / 登录注册 / 设置页 | 静态页面 | 是 |
| `css/styles.css` / `js/app.js` | 静态资源 | 是 |
| `init-content/*` | 冷启动内容初始化页 | 是，首发后手动执行 |
| `deploy/*` | 运维脚本 / 文档 | 否，不对公网开放 |
| Markdown 文档 | 内部文档 | 否 |

### 1.2 部署状态设计

| 状态 | 触发条件 | 下一状态 | 说明 |
|---|---|---|---|
| `待上线` | 代码已整理，未传服务器 | `待传包` | 本地完成打包 |
| `待传包` | 产物已生成 | `待部署` | 需要 SCP 或控制台上传 |
| `待部署` | 服务器具备 Nginx / 权限 | `待验收` | 已落目录、已生效 |
| `待验收` | 域名 / HTTPS / 页面抽查中 | `已上线` | 首页、子页、初始化页可访问 |
| `已上线` | 验收完成 | `运营中` | 进入内容运营 |
| `异常中` | DNS / SSH / Nginx / 证书失败 | `待部署` / `待验收` | 修复后重试 |

---

## 2. 流程链路

### 2.1 正常上线链路

| 步骤 | 动作 | 输入 | 输出 |
|---|---|---|---|
| 1 | 本地确认站点产物 | `pm-community/` | 待发布目录 |
| 2 | 打包发布包 | `pmchat-cn-v1.0.tar.gz` | 可上传产物 |
| 3 | 域名解析指向服务器 | `pmchat.cn`、`www.pmchat.cn` | 指向 `103.73.161.133` |
| 4 | 上传到服务器 `/tmp/` | tar 包或 `pm-community/` | 待部署源 |
| 5 | 执行 `pmchat-deploy.sh` | 部署源 + 域名 | `/var/www/pmchat` |
| 6 | Nginx 生效 | 配置文件 | 80 端口可访问 |
| 7 | Certbot 签证书 | DNS 已生效 | HTTPS 可访问 |
| 8 | 执行内容初始化 | `/init-content/init.html` | 冷启动内容完成 |
| 9 | 验收 | 页面与资源抽查 | 已上线 |

### 2.2 实际文件链路

| 环节 | 路径 |
|---|---|
| 站点根目录 | `/var/www/pmchat` |
| Nginx 配置 | `/etc/nginx/sites-available/pmchat` |
| Nginx 启用链接 | `/etc/nginx/sites-enabled/pmchat` |
| 访问日志 | `/var/log/nginx/pmchat.access.log` |
| 错误日志 | `/var/log/nginx/pmchat.error.log` |
| 初始化地址 | `https://pmchat.cn/init-content/init.html` |

---

## 3. 规则说明

### 3.1 上线前置规则

| 规则 | 必须/可选 | 说明 |
|---|---|---|
| `pmchat.cn` A 记录指向 `103.73.161.133` | 必须 | 不满足则 Certbot 必失败 |
| `www.pmchat.cn` 指向同服务器 | 建议 | 保证裸域 / www 一致 |
| 服务器 80 / 443 对公网放开 | 必须 | 否则站点不可访问 |
| 服务器可 SSH 登录 | 必须 | 否则无法远程部署 |
| 部署目录归属 `www-data` | 必须 | 防止静态资源读取失败 |
| 禁止公网暴露 `deploy/` 运维脚本 | 必须 | 降低敏感信息泄露风险 |

### 3.2 发布规则

| 规则 | 说明 |
|---|---|
| 首发只发布 `pm-community` 内站点资源，不发布根目录其他历史包 |
| 使用 tar 包或已上传目录作为部署源，不再依赖远端 `git clone` |
| 初始化内容只在首发或重置环境时执行，避免重复覆盖浏览器本地数据 |
| HTTPS 申请必须在 DNS 生效后执行，否则直接跳过并记录待办 |

---

## 4. 边界 / 异常处理

### 4.1 运维异常

| 异常场景 | 表现 | 原因判断 | 处理方案 |
|---|---|---|---|
| 域名打不开 | `curl http://pmchat.cn` 无响应 | DNS 未生效 / Nginx 未监听 / 防火墙拦截 | 先查解析，再查 `ss -ltnp`、`ufw status` |
| HTTPS 失败 | `curl -I https://pmchat.cn` 报 SSL 错 | 证书未签发 / 域名未指向服务器 | 修正 DNS 后重跑 `certbot --nginx -d pmchat.cn -d www.pmchat.cn` |
| SSH 连不上 | `kex_exchange_identification` / 连接被关闭 | `sshd` 未启动、root 登录被禁、安全组/白名单限制 | 控制台排查 `systemctl status ssh`、`sshd_config`、安全组 |
| 页面样式丢失 | 首页可开，CSS/JS 404 | 目录结构错误或资源未复制完整 | 检查 `/var/www/pmchat/css`、`/var/www/pmchat/js` |
| 子页面 404 | 只有首页可访问 | 文件未上传完整 | 重新同步站点目录 |

### 4.2 业务异常

| 异常场景 | 风险 | 处理规则 |
|---|---|---|
| 冷启动内容未初始化 | 社区首屏空、活跃度弱 | 上线后立即访问初始化页执行一次 |
| 重复初始化 | 浏览器本地内容重复 | 仅首发执行；若需重置，先清浏览器本地存储 |
| 外部字体/CDN 不可用 | 页面图标或字体降级 | 页面仍可打开，但 UI 会降级；后续可改成本地静态资源 |
| 静态原型被误认为正式产品 | 用户期待真实注册/互动 | 首页或登录页建议补“演示版 / 内测版”标识 |

---

## 5. 已识别风险清单

| 风险项 | 风险等级 | 当前状态 | 处理建议 |
|---|---|---|---|
| 域名未指向目标服务器 | P0 | 未解决 | 立刻修改 DNS |
| SSH 远端主动断开 | P0 | 未解决 | 需控制台检查 SSH 服务与安全策略 |
| 远端 GitHub 拉取脚本可能发布错代码 | P1 | 已规避 | 改为本地 tar 包发布 |
| 部署文档初始化路径不一致 | P1 | 已修复 | 统一为 `/init-content/init.html` |
| 运维目录暴露风险 | P1 | 待服务器侧执行 | 仅同步站点资源，不发布 `deploy/` |

---

## 6. 推荐执行命令

### 6.1 本地打包

```bash
cd /Users/seraph-allen/Downloads/代码仓库/产品经理交流网站
tar -czf pmchat-cn-v1.0.tar.gz pm-community
```

### 6.2 上传服务器

```bash
scp pmchat-cn-v1.0.tar.gz root@103.73.161.133:/tmp/
```

### 6.3 服务器执行

```bash
cd /tmp
bash /var/www/pmchat/deploy/pmchat-deploy.sh
```

如果先传的是脚本而不是站点目录，则建议：

```bash
chmod +x pmchat-deploy.sh
SERVER_IP=103.73.161.133 DOMAIN=pmchat.cn WWW_DOMAIN=www.pmchat.cn bash pmchat-deploy.sh
```

---

## 7. 验收清单

| 验收项 | 验收标准 |
|---|---|
| 域名访问 | `http://pmchat.cn` 自动跳转或可打开 |
| HTTPS | `https://pmchat.cn` 正常返回 200 |
| 首页 | 样式、图标、头像正常加载 |
| 子页面 | `categories.html`、`chat.html`、`detail.html`、`login.html` 可打开 |
| 初始化页 | `/init-content/init.html` 可访问 |
| 日志 | Nginx access/error log 正常写入 |

---

## 8. 当前结论

| 结论项 | 结论 |
|---|---|
| 项目是否可部署 | 可 |
| 推荐部署方式 | Nginx 静态站 |
| 当前阻塞点 | DNS 未指向、SSH 无法登录 |
| 下一步最优先动作 | 先把 `pmchat.cn` 和 `www.pmchat.cn` 解析到 `103.73.161.133`，并从服务器控制台恢复 SSH |
