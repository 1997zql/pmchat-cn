# PM社区 部署指南

## 环境要求
- Ubuntu 20.04+ / Debian 11+
- Nginx
- 域名（已解析到服务器IP）
- SSL证书（Let's Encrypt 免费）

---

## 第一步：上传网站文件

### 方式1：SCP（推荐）
```bash
# 在本地电脑上执行
cd pm-community
tar -czvf pm-community.tar.gz --exclude='deploy' .

scp pm-community.tar.gz root@你的服务器IP:/tmp/
```

### 方式2：Git（如果用Git管理）
```bash
# 在服务器上执行
cd /tmp
git clone 你的仓库地址
```

### 方式3：直接打包上传
```bash
# 打包时排除 deploy 目录
tar -czvf pm-community.tar.gz --exclude='pm-community/deploy' pm-community/
```
然后通过宝塔面板、FileZilla 等工具上传。

---

## 第二步：安装 Nginx

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

验证安装：
```bash
nginx -v
sudo systemctl status nginx
```

---

## 第三步：配置 Nginx

### 3.1 创建配置文件
```bash
sudo nano /etc/nginx/sites-available/pm-community
```

复制 `deploy/nginx.conf` 的内容，**记得修改**：
- `YOUR_DOMAIN` → 你的实际域名

### 3.2 启用站点
```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/pm-community /etc/nginx/sites-enabled/

# 删除默认站点（可选）
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 3.3 临时放行 80/443 端口
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

---

## 第四步：申请 SSL 证书

### 4.1 安装 Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 4.2 申请证书（交互式）
```bash
sudo certbot --nginx -d 你的域名
```
按提示完成：
- 输入邮箱（接收过期通知）
- 同意服务条款
- 选择是否自动跳转（选是）

### 4.3 验证证书
```bash
sudo certbot certificates
```

### 4.4 配置自动续期
Let's Encrypt 证书有效期90天，Certbot 自动配置了续期任务。
验证自动续期是否正常：
```bash
sudo certbot renew --dry-run
```

---

## 第五步：部署网站文件

### 5.1 解压文件
```bash
cd /tmp
sudo tar -xzvf pm-community.tar.gz
```

### 5.2 移动到网站目录
```bash
sudo mkdir -p /var/www/pm-community
sudo cp -r pm-community/* /var/www/pm-community/

# 设置权限
sudo chown -R www-data:www-data /var/www/pm-community
sudo chmod -R 755 /var/www/pm-community
```

### 5.3 或者使用一键脚本
```bash
cd /tmp/pm-community/deploy
chmod +x deploy.sh
sudo ./deploy.sh
```

---

## 第六步：验证部署

### 访问测试
```
https://你的域名
```

### 检查项
- [ ] 页面正常加载
- [ ] CSS/JS 正常显示
- [ ] 页面切换正常
- [ ] HTTPS 显示绿色锁
- [ ] 没有混合内容警告

### 查看日志
```bash
# 访问日志
sudo tail -f /var/log/nginx/pm-community.access.log

# 错误日志
sudo tail -f /var/log/nginx/pm-community.error.log
```

---

## 维护命令

| 操作 | 命令 |
|------|------|
| 重启 Nginx | `sudo systemctl restart nginx` |
| 重载配置 | `sudo systemctl reload nginx` |
| 检查配置 | `sudo nginx -t` |
| 查看证书 | `sudo certbot certificates` |
| 续期证书 | `sudo certbot renew` |
| 查看日志 | `sudo tail -f /var/log/nginx/pm-community.access.log` |

---

## 常见问题

### Q: 页面显示 502 Bad Gateway
```bash
sudo systemctl status nginx
sudo chown -R www-data:www-data /var/www/pm-community
sudo systemctl restart nginx
```

### Q: SSL 证书申请失败
- 确认域名已解析到服务器IP
- 确认 80/443 端口已开放
- 确认 Nginx 已运行

### Q: 证书过期了怎么办
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Q: 如何更新网站内容
1. 上传新文件到 `/tmp/pm-community`
2. 运行部署脚本或手动复制
3. 清除浏览器缓存

---

## 目录结构（部署后）
```
/var/www/pm-community/
├── index.html
├── chat.html
├── categories.html
├── ...
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── ...
```

---

## 技术支持

如有问题，检查：
1. Nginx 配置：`sudo nginx -t`
2. 端口占用：`sudo netstat -tlnp | grep -E '80|443'`
3. 防火墙：`sudo ufw status`
4. DNS 解析：`ping 你的域名`
