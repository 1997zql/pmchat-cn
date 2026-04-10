#!/bin/bash
# 兼容旧入口，统一转发到标准部署脚本

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "${SCRIPT_DIR}/pmchat-deploy.sh" "$@"
