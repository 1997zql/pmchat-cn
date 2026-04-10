#!/bin/bash
# PMChat 服务器部署脚本
# 适用场景：Ubuntu + Nginx + Certbot + 静态站点

set -euo pipefail

DOMAIN="${DOMAIN:-pmchat.cn}"
WWW_DOMAIN="${WWW_DOMAIN:-www.pmchat.cn}"
SITE_NAME="${SITE_NAME:-pmchat}"
WEB_ROOT="${WEB_ROOT:-/var/www/${SITE_NAME}}"
PACKAGE_PATH="${PACKAGE_PATH:-/tmp/pmchat-cn-v1.0.tar.gz}"
SOURCE_DIR="${SOURCE_DIR:-/tmp/pm-community}"
EXTRACT_DIR="${EXTRACT_DIR:-/tmp/pmchat-release}"
NGINX_CONF="/etc/nginx/sites-available/${SITE_NAME}"
EMAIL="${EMAIL:-admin@pmchat.cn}"
SERVER_IP="${SERVER_IP:-}"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    printf "%b%s%b\n" "${BLUE}" "$1" "${NC}"
}

warn() {
    printf "%b%s%b\n" "${YELLOW}" "$1" "${NC}"
}

fail() {
    printf "%b%s%b\n" "${RED}" "$1" "${NC}"
    exit 1
}

if [ "${EUID}" -ne 0 ]; then
    fail "请使用 root 或 sudo 执行该脚本"
fi

log "步骤 1/7: 安装依赖"
apt update
apt install -y nginx certbot python3-certbot-nginx rsync tar curl

log "步骤 2/7: 准备站点文件"
rm -rf "${EXTRACT_DIR}"
mkdir -p "${EXTRACT_DIR}" "${WEB_ROOT}"

if [ -f "${PACKAGE_PATH}" ]; then
    tar -xzf "${PACKAGE_PATH}" -C "${EXTRACT_DIR}"
    rsync -av --delete \
        --exclude='deploy' \
        "${EXTRACT_DIR}/pm-community/" "${WEB_ROOT}/"
elif [ -d "${SOURCE_DIR}" ]; then
    rsync -av --delete \
        --exclude='deploy' \
        "${SOURCE_DIR}/" "${WEB_ROOT}/"
else
    fail "未找到部署源。请上传 ${PACKAGE_PATH} 或 ${SOURCE_DIR}"
fi

log "步骤 3/7: 设置权限"
chown -R www-data:www-data "${WEB_ROOT}"
find "${WEB_ROOT}" -type d -exec chmod 755 {} \;
find "${WEB_ROOT}" -type f -exec chmod 644 {} \;

log "步骤 4/7: 写入 Nginx 配置"
cat > "${NGINX_CONF}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} ${WWW_DOMAIN};

    root ${WEB_ROOT};
    index index.html;

    access_log /var/log/nginx/${SITE_NAME}.access.log;
    error_log /var/log/nginx/${SITE_NAME}.error.log;

    location /.well-known/acme-challenge/ {
        allow all;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    location ~ /\. {
        deny all;
    }
}
EOF

ln -sf "${NGINX_CONF}" "/etc/nginx/sites-enabled/${SITE_NAME}"
rm -f /etc/nginx/sites-enabled/default

log "步骤 5/7: 校验并重载 Nginx"
nginx -t
systemctl reload nginx
systemctl enable nginx

log "步骤 6/7: 校验 DNS 状态"
CURRENT_DNS_IP="$(getent ahostsv4 "${DOMAIN}" | awk 'NR==1 {print $1}')"
if [ -n "${CURRENT_DNS_IP}" ]; then
    echo "当前 ${DOMAIN} 解析 IP: ${CURRENT_DNS_IP}"
else
    warn "未查询到 ${DOMAIN} 的 A 记录，先跳过证书申请"
fi

if [ -n "${SERVER_IP}" ] && [ -n "${CURRENT_DNS_IP}" ] && [ "${CURRENT_DNS_IP}" != "${SERVER_IP}" ]; then
    warn "域名未指向目标服务器 ${SERVER_IP}，跳过 Certbot。请先修正 DNS。"
elif [ -n "${CURRENT_DNS_IP}" ]; then
    log "步骤 7/7: 申请或续签 SSL 证书"
    certbot --nginx -d "${DOMAIN}" -d "${WWW_DOMAIN}" \
        --noninteractive --agree-tos -m "${EMAIL}" --redirect
else
    warn "证书步骤已跳过，待 DNS 生效后执行：certbot --nginx -d ${DOMAIN} -d ${WWW_DOMAIN}"
fi

echo
printf "%b部署完成%b\n" "${GREEN}" "${NC}"
echo "站点目录: ${WEB_ROOT}"
echo "站点地址: https://${DOMAIN}"
echo "初始化入口: https://${DOMAIN}/init-content/init.html"
echo "日志目录: /var/log/nginx/${SITE_NAME}.access.log"
