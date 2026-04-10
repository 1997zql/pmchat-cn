#!/bin/bash
# ============================================
# SSL 证书申请脚本（Let's Encrypt + Certbot）
# ============================================
# 使用前提：
# 1. 域名已解析到服务器IP
# 2. Nginx 已安装并运行
# 3. 80端口未被占用
#
# 使用方法：
#   chmod +x ssl-setup.sh
#   ./ssl-setup.sh
# ============================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}    PM社区 SSL 证书自动配置脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}错误：请使用 sudo 运行此脚本${NC}"
    echo "示例：sudo ./ssl-setup.sh"
    exit 1
fi

# 提示输入域名
read -p "请输入你的域名（例如：pm.example.com）: " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}错误：域名不能为空${NC}"
    exit 1
fi

echo -e "${YELLOW}正在安装 Certbot...${NC}"

# 安装 Certbot（Ubuntu/Debian）
apt update
apt install -y certbot python3-certbot-nginx

echo -e "${YELLOW}正在申请 SSL 证书...${NC}"
echo -e "${YELLOW}域名：${DOMAIN}${NC}"

# 申请证书（自动配置 Nginx）
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN"

# 设置自动续期（证书有效期90天，自动续期脚本会检查是否还有60天）
echo -e "${YELLOW}配置自动续期...${NC}"
certbot renew --dry-run

# 添加 cron 定时任务（每天凌晨2点检查并续期）
CRON_JOB="0 2 * * * /usr/bin/certbot renew --quiet --deploy-hook 'systemctl reload nginx'"
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_JOB") | crontab -

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}    SSL 证书配置完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "证书位置："
echo -e "  证书文件：/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
echo -e "  私钥文件：/etc/letsencrypt/live/${DOMAIN}/privkey.pem"
echo ""
echo -e "自动续期已配置，证书到期前会自动续期。"
echo -e "你可以通过以下命令手动测试续期："
echo -e "  sudo certbot renew --dry-run"
echo ""
