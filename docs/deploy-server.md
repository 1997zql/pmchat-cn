# PM社区服务器部署说明

## 1. 目标

- 域名：`pmchat.cn`
- 前台：`Next.js` 监听 `3000`
- API：`NestJS` 监听 `4000`
- 反向代理：`Nginx`
- 基础设施：`Postgres` `Redis` `Meilisearch` `MinIO`

## 2. 服务器前置要求

| 项目 | 要求 |
|---|---|
| CPU/内存 | 建议 `4核 8G` 起 |
| 系统 | Ubuntu 22.04+ |
| 软件 | `Docker` `Docker Compose` `Node.js 20` `npm` `Nginx` |
| 域名解析 | `pmchat.cn` 和 `www.pmchat.cn` 指向服务器公网 IP |

## 3. 首次部署流程

```bash
git clone <your-repo-url> pmchat
cd pmchat
cp .env.server.example .env
npm install
docker compose up -d
npm run db:generate
npm run db:migrate:deploy
npm run build:api
npm run build:web
```

## 4. 生产启动命令

建议使用两个独立进程：

```bash
PORT=3000 npm run start:web
API_PORT=4000 npm run start:api
```

## 5. Nginx 配置

- 使用 [`infra/nginx/pmchat.conf`](/Users/seraph-allen/Downloads/代码仓库/产品经理交流网站/infra/nginx/pmchat.conf)
- 放到 `/etc/nginx/sites-available/pmchat.conf`
- 建立软链到 `/etc/nginx/sites-enabled/pmchat.conf`
- 完成 HTTPS 后补 `443 ssl http2`

验证命令：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. HTTPS

```bash
sudo certbot --nginx -d pmchat.cn -d www.pmchat.cn
```

## 7. 上线验收

| 场景 | 验收标准 |
|---|---|
| 首页访问 | `https://pmchat.cn` 正常打开 |
| 注册登录 | 新用户可注册并登录 |
| 发帖编辑 | 可创建帖子并再次编辑 |
| 评论回复 | 详情页可评论和回复 |
| 茶水间 | 可切频道、发消息、撤回 |
| 后台 | 管理员可登录并处理用户/内容/举报 |

## 8. 异常排查

| 场景 | 处理 |
|---|---|
| Web 404 或空白 | 检查 `PORT=3000 npm run start:web` 是否存活 |
| API 502 | 检查 `API_PORT=4000 npm run start:api` 是否存活 |
| Socket 不通 | 确认 `NEXT_PUBLIC_SOCKET_URL=https://pmchat.cn` |
| 数据库连接失败 | 检查 `.env` 的 `DATABASE_URL` 和 `docker compose ps` |
| 本机 `build:web` 失败 | 优先在服务器 Node 20 环境重新执行构建，当前已知本机存在 SWC 环境不稳定问题 |
