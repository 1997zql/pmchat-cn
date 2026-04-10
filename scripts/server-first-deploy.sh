#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f ".env" ]]; then
  echo ".env 不存在，请先复制 .env.server.example 为 .env"
  exit 1
fi

echo "[1/6] 安装依赖"
npm install

echo "[2/6] 启动基础设施"
docker compose up -d

echo "[3/6] 生成 Prisma Client"
npm run db:generate

echo "[4/6] 执行正式迁移"
npm run db:migrate:deploy

echo "[5/6] 构建 API / Web"
npm run build:api
npm run build:web

echo "[6/6] 部署完成，接下来请使用 systemd 或进程管理器启动 API / Web"
