#!/bin/bash
# ============================================
# PM社区 一键部署脚本
# ============================================
# 使用前提：
# 1. 已通过 scp 或 git 上传网站文件到 /tmp/pm-community
# 2. Nginx 已安装
# 3. 已在 /etc/nginx/sites-available/ 配置好域名
#
# 使用方法：
#   chmod +x deploy.sh
#   ./deploy.sh
# ============================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SITE_NAME="pm-community"
WEB_ROOT="/var/www/${SITE_NAME}"
SOURCE_DIR="/tmp/${SITE_NAME}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}         PM社区 部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}错误：请使用 sudo 运行此脚本${NC}"
    exit 1
fi

echo -e "${YELLOW}步骤 1/4: 创建网站目录...${NC}"
mkdir -p "${WEB_ROOT}"
echo -e "${GREEN}✓ 目录创建完成: ${WEB_ROOT}${NC}"

echo -e "${YELLOW}步骤 2/4: 复制网站文件...${NC}"
if [ -d "${SOURCE_DIR}" ]; then
    # 排除 deploy 目录，只复制网站文件
    rsync -av --exclude='deploy' "${SOURCE_DIR}/" "${WEB_ROOT}/"
    echo -e "${GREEN}✓ 文件复制完成${NC}"
else
    echo -e "${YELLOW}⚠ 源目录不存在，跳过文件复制"
    echo -e "  请先上传文件到: ${SOURCE_DIR}${NC}"
fi

echo -e "${YELLOW}步骤 3/4: 设置权限...${NC}"
chown -R www-data:www-data "${WEB_ROOT}"
chmod -R 755 "${WEB_ROOT}"
echo -e "${GREEN}✓ 权限设置完成${NC}"

echo -e "${YELLOW}步骤 4/4: 重载 Nginx...${NC}"
nginx -t && systemctl reload nginx
echo -e "${GREEN}✓ Nginx 重载完成${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}       部署完成！🎉${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "网站地址: https://你的域名"
echo -e "网站目录: ${WEB_ROOT}"
echo ""
echo -e "常用命令："
echo -e "  查看状态:  systemctl status nginx"
echo -e "  查看日志:  tail -f /var/log/nginx/pm-community.access.log"
echo -e "  重启服务:  systemctl restart nginx"
echo -e "  重新部署:  ./deploy.sh"
echo ""
