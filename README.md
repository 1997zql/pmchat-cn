# PMChat 正式产品版

## TL;DR

- 前台：`Next.js App Router`
- 后台 API：`NestJS + Prisma`
- 基础设施：`Postgres + Redis + Meilisearch + MinIO`
- 当前已具备：注册、登录、发帖、编辑、评论回复、搜索、通知、茶水间、运营后台
- 默认管理员：`admin@pmchat.cn / Admin123456`

## 状态设计

| 对象 | 当前状态 |
|---|---|
| 数据库结构 | 已有正式 Prisma migration |
| 本地开发 | `docker compose + npm` 可启动 |
| API 构建 | 已可 build |
| Web 类型检查 | 已通过 |
| Web 构建 | 当前机器存在 SWC 环境不稳定问题，建议在服务器 Node 20 环境复验 |

## 目录结构

- `apps/web`: Next.js 前台与中后台页面
- `apps/api`: NestJS API、Prisma 模型、Socket 网关
- `packages/shared`: 前后端共享类型与常量
- `docker-compose.yml`: Postgres / Redis / Meilisearch / MinIO
- `docs/deploy-server.md`: 服务器部署说明
- `docs/ui-style-baseline.md`: 前端长期设计基线
- `infra/nginx/pmchat.conf`: Nginx 反向代理模板
- `infra/systemd/`: API / Web 服务模板

## 快速启动

### 1. 初始化环境变量

```bash
cp .env.example .env
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动基础设施

```bash
docker compose up -d
```

### 4. 生成 Prisma Client 并执行数据库迁移

```bash
npm run db:generate
npm run db:migrate
```

### 5. 启动 API 与 Web

```bash
npm run dev:api
npm run dev:web
```

## 流程链路

| 步骤 | 说明 |
|---|---|
| 基础设施启动 | 启动 `postgres redis meilisearch minio` |
| 数据准备 | 执行 `db:generate + db:migrate` |
| API 启动 | API 自动跑 bootstrap，补齐管理员、分类、频道 |
| Web 启动 | 前台直接连接 `/api` 和 Socket |
| 本地验收 | 注册、登录、发帖、编辑、评论、后台、聊天 |

## 规则说明

| 项目 | 规则 |
|---|---|
| API 前缀 | 统一 `/api` |
| 默认管理员 | `admin@pmchat.cn / Admin123456` |
| 种子方式 | 当前通过 API 启动时的 `BootstrapService` 自动初始化 |
| 迁移策略 | 开发环境使用 `npm run db:migrate`，服务器使用 `npm run db:migrate:deploy` |
| 生产环境 | 建议使用 `.env.server.example` 作为模板 |

## 当前已落地功能

- 邮箱注册 / 登录 / 退出 / 忘记密码
- 内容发布、编辑、列表、详情、评论、回复
- 搜索、通知、个人中心
- 茶水间频道 / 历史消息 / Socket 实时消息 / 撤回
- 后台用户、内容、举报、分类、频道管理
- 分类、频道、管理员默认种子数据

## 前端设计基线

- 默认参考 `ui-ux-pro-max` skill
- 默认参考 [`docs/ui-style-baseline.md`](/Users/seraph-allen/Downloads/代码仓库/产品经理交流网站/docs/ui-style-baseline.md)
- 新页面优先保持深色社区风格、紫粉高光、统一卡片层级和正式网站文案

## 边界 / 异常处理

| 场景 | 处理 |
|---|---|
| 本机 `build:web` 失败 | 优先在服务器 Node 20 环境重试，当前已知存在 SWC 环境问题 |
| 首次部署数据库为空 | 先执行 `npm run db:migrate:deploy` |
| 后台无法访问 | 检查当前账号是否为 `ADMIN` |
| Socket 不通 | 检查 `NEXT_PUBLIC_SOCKET_URL` 与 Nginx `/socket.io/` 反代 |

## 服务器部署

部署请直接看 [`docs/deploy-server.md`](/Users/seraph-allen/Downloads/代码仓库/产品经理交流网站/docs/deploy-server.md)。
