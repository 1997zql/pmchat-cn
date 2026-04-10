#!/bin/bash
# 仓库根目录快捷入口

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "${SCRIPT_DIR}/pm-community/deploy/pmchat-deploy.sh" "$@"
