# 🚀 CI/CD 自动化部署方案

> 基于 GitHub Actions + Docker + 蓝绿部署的完整自动化部署解决方案

## 📋 目录

- [方案概述](#方案概述)
- [架构设计](#架构设计)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [使用指南](#使用指南)
- [监控告警](#监控告警)
- [故障排查](#故障排查)
- [最佳实践](#最佳实践)

---

## 🎯 方案概述

### 核心特性

✅ **全自动化流程** - 从代码提交到生产部署，无需人工干预  
✅ **蓝绿部署** - 零停机时间，秒级回滚  
✅ **安全扫描** - 代码质量、依赖漏洞、镜像安全三层防护  
✅ **多环境管理** - 开发、测试、生产环境自动化管理  
✅ **全方位监控** - 应用性能、基础设施、业务指标全流程监控  
✅ **告警通知** - 多渠道告警（Slack/邮件/钉钉）

### 技术栈

| 组件 | 技术 | 用途 |
|------|------|------|
| CI/CD 平台 | GitHub Actions | 自动化流水线 |
| 容器化 | Docker + Docker Compose | 应用容器化 |
| 部署策略 | 蓝绿部署 (Blue-Green) | 零停机发布 |
| 负载均衡 | Nginx | 流量切换 |
| 监控 | Prometheus + Grafana | 指标采集与展示 |
| 日志 | Loki | 日志聚合 |
| 告警 | AlertManager | 告警管理 |

---

## 🏗️ 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Git 仓库                             │
│  (main 分支 / develop 分支 / PR)                           │
└────────────────┬────────────────────────────────────────────┘
                 │ git push
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   GitHub Actions                            │
│  ┌──────────┬──────────┬──────────┬──────────┐            │
│  │ 代码检查  │  单元测试  │  Docker  │  部署    │            │
│  │ 和安全扫描 │          │  构建    │          │            │
│  └──────────┴──────────┴──────────┴──────────┘            │
└────────────────┬────────────────────────────────────────────┘
                 │ 推送镜像
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   镜像仓库 (阿里云 ACR)                      │
│  your-app:main-abc123                                     │
│  your-app:develop-xyz789                                  │
└────────────────┬────────────────────────────────────────────┘
                 │ 拉取镜像
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              生产服务器 (蓝绿部署)                          │
│  ┌─────────────┐         ┌─────────────┐                  │
│  │  蓝环境      │         │  绿环境      │                  │
│  │  (当前生产)  │ ◄────► │  (新版本)    │                  │
│  │  :3000      │  流量切换 │  :3001      │                  │
│  └─────────────┘         └─────────────┘                  │
│         │                       │                           │
│         └───────────┬───────────┘                           │
│                     ▼                                       │
│              ┌─────────────┐                                │
│              │   Nginx     │                                │
│              │  反向代理    │                                │
│              └──────┬──────┘                                │
│                     │                                        │
│                     ▼                                        │
│              ┌─────────────┐                                │
│              │   用户流量   │                                │
│              └─────────────┘                                │
└─────────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                  监控告警系统                                │
│  ┌──────────┬──────────┬──────────┬──────────┐            │
│  │Prometheus│ Grafana  │  Loki    │AlertManager│          │
│  │(指标采集) │ (可视化) │  (日志)  │  (告警)   │            │
│  └──────────┴──────────┴──────────┴──────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### 流水线阶段

```
阶段 1: 代码质量检查
  ├── Lint 检查 (ESLint)
  ├── 安全漏洞扫描 (npm audit)
  └── 依赖许可检查

阶段 2: 自动化测试
  ├── 单元测试 (Jest)
  ├── 集成测试
  └── 测试覆盖率报告

阶段 3: 构建与推送
  ├── Docker 多阶段构建
  ├── 镜像安全扫描 (Trivy)
  └── 推送到镜像仓库

阶段 4: 自动部署
  ├── 开发环境 (自动)
  ├── 测试环境 (自动/手动)
  └── 生产环境 (手动审批 + 蓝绿部署)

阶段 5: 健康检查
  ├── 服务健康检测
  ├── 自动化冒烟测试
  └── 失败时自动回滚
```

---

## 🚀 快速开始

### 1. 前置准备

#### 1.1 创建镜像仓库

**阿里云容器镜像服务 (ACR)**：

1. 登录 [阿里云容器镜像服务控制台](https://cr.console.aliyun.com/)
2. 创建命名空间和镜像仓库
3. 获取登录凭证（用户名和密码）

**或使用腾讯云容器镜像服务 (TCR)**：

1. 登录 [腾讯云容器镜像服务控制台](https://console.cloud.tencent.com/tcr)
2. 创建命名空间和镜像仓库
3. 获取登录凭证

#### 1.2 配置 GitHub Secrets

在 GitHub 仓库的 `Settings → Secrets and variables → Actions` 中添加以下 Secrets：

```bash
# 镜像仓库凭证
DOCKER_REGISTRY=registry.cn-hangzhou.aliyuncs.com  # 或 tcr.tencentcloudcr.com
DOCKER_USERNAME=your-username
DOCKER_PASSWORD=your-password

# 开发服务器
DEV_SERVER_HOST=dev.example.com
DEV_SERVER_USER=ubuntu
DEV_SERVER_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

# 生产服务器
PROD_SERVER_HOST=prod.example.com
PROD_SERVER_USER=ubuntu
PROD_SERVER_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

# 通知配置（可选）
SLACK_WEBHOOK=https://hooks.slack.com/services/xxx/xxx/xxx
```

#### 1.3 配置环境保护（生产环境）

1. 进入 GitHub 仓库 `Settings → Environments`
2. 创建 `production` 环境
3. 启用 `Required reviewers`（需要审批）
4. 添加环境 Secrets（如需要特定环境的变量）

### 2. 项目配置

#### 2.1 修改 `.github/workflows/ci-cd.yml`

```yaml
env:
  DOCKER_REGISTRY: registry.cn-hangzhou.aliyuncs.com  # 修改为你的镜像仓库
  IMAGE_NAME: your-project-name  # 修改为你的项目名
```

#### 2.2 修改 `docker-compose.yml`

```yaml
services:
  app-blue:
    image: ${DOCKER_REGISTRY:-registry.cn-hangzhou.aliyuncs.com}/${IMAGE_NAME:-your-app}:${BLUE_TAG:-stable}
    # ... 其他配置
```

#### 2.3 确保应用有健康检查端点

在你的应用中添加健康检查路由（例如 Express.js）：

```javascript
// health check endpoint
app.get('/health', (req, res) => {
  // 检查数据库连接、缓存等
  const isHealthy = checkHealth();
  
  if (isHealthy) {
    res.status(200).send('OK');
  } else {
    res.status(503).send('Unhealthy');
  }
});
```

### 3. 服务器初始化

#### 3.1 安装 Docker 和 Docker Compose

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### 3.2 配置服务器目录结构

```bash
# 创建项目目录
sudo mkdir -p /opt/your-app/{deploy,logs,data}
cd /opt/your-app

# 创建部署用户（可选，推荐）
sudo useradd -m -s /bin/bash deployer
sudo usermod -aG docker deployer

# 设置目录权限
sudo chown -R deployer:deployer /opt/your-app
```

#### 3.3 首次部署（手动）

```bash
# 登录服务器
ssh user@your-server.com

# 克隆代码
git clone https://github.com/your-org/your-repo.git /opt/your-app

# 进入项目目录
cd /opt/your-app

# 创建 .env 文件
cat > .env <<EOF
DOCKER_REGISTRY=registry.cn-hangzhou.aliyuncs.com
IMAGE_NAME=your-project/your-app
BLUE_TAG=stable
GREEN_TAG=latest
GRAFANA_PASSWORD=your-secure-password
EOF

# 登录镜像仓库
docker login registry.cn-hangzhou.aliyuncs.com \
  -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

# 拉取并启动服务
docker-compose up -d

# 检查状态
docker-compose ps
curl http://localhost/health
```

---

## ⚙️ 配置说明

### GitHub Actions 流水线配置

#### 触发器配置

```yaml
on:
  push:
    branches: [ main, develop ]  # 推送到这些分支时触发
  pull_request:
    branches: [ main ]  # PR 到 main 时触发
```

#### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DOCKER_REGISTRY` | 镜像仓库地址 | `registry.cn-hangzhou.aliyuncs.com` |
| `IMAGE_NAME` | 镜像名称 | `your-project-name` |

#### Jobs 说明

1. **security-and-quality** - 代码质量检查
   - Lint 检查
   - 安全漏洞扫描
   - 依赖许可检查

2. **test** - 自动化测试
   - 单元测试
   - 上传测试覆盖率

3. **build** - 构建镜像
   - Docker 多阶段构建
   - 推送镜像到仓库
   - 镜像安全扫描

4. **deploy-dev** - 部署到开发环境
   - 仅在 `develop` 分支
   - 自动部署

5. **deploy-prod** - 部署到生产环境
   - 仅在 `main` 分支
   - 需要手动审批
   - 蓝绿部署
   - 自动回滚

### Docker 配置

#### Dockerfile 多阶段构建

```dockerfile
# 阶段1: 构建
FROM node:18-alpine AS builder
# ... 安装依赖、构建

# 阶段2: 生产镜像
FROM node:18-alpine
# ... 只复制必要文件，减小镜像体积
USER nodejs  # 使用非 root 用户，提高安全性
```

**优势**：
- 减小镜像体积（从 1GB+ 到 100MB-）
- 提高安全性（非 root 用户运行）
- 加快构建速度（利用缓存）

#### docker-compose.yml 配置

**服务说明**：

| 服务名 | 镜像 | 用途 |
|--------|------|------|
| `app-blue` | 你的应用 | 蓝环境（当前生产版本） |
| `app-green` | 你的应用 | 绿环境（新版本） |
| `nginx` | nginx:alpine | 反向代理和流量切换 |
| `prometheus` | prom/prometheus | 指标采集 |
| `grafana` | grafana/grafana | 指标可视化 |
| `loki` | grafana/loki | 日志聚合 |

**资源限制**：

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

### Nginx 蓝绿部署配置

#### 配置结构

```
docker/nginx/
├── nginx.conf          # 主配置文件
└── conf.d/
    ├── active.conf    # 当前活跃配置（符号链接）
    ├── blue.conf      # 蓝环境配置
    └── green.conf     # 绿环境配置
```

#### 流量切换原理

1. **默认状态**：`active.conf` → `blue.conf`（流量到蓝环境）
2. **部署新版本**：
   - 启动绿环境容器
   - 健康检查通过后
   - 将 `active.conf` 指向 `green.conf`
   - 执行 `nginx -s reload`（无缝切换）
3. **回滚**：
   - 将 `active.conf` 指回 `blue.conf`
   - 执行 `nginx -s reload`

---

## 📖 使用指南

### 日常开发流程

#### 1. 功能开发

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 开发...
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature

# 创建 Pull Request
# GitHub Actions 自动运行：代码检查 → 测试 → 构建镜像
```

#### 2. 合并到开发分支

```bash
# PR 合并到 develop 分支后
# GitHub Actions 自动部署到开发环境

# 查看部署状态
git log --oneline -5
# 应该看到类似输出：
# abc1234 (HEAD -> develop) Merge pull request #123 from feature/new-feature
```

#### 3. 发布到生产环境

```bash
# 合并到 main 分支
git checkout main
git merge develop
git push origin main

# GitHub Actions 自动运行：
# 1. 代码检查 + 测试 + 构建
# 2. 等待审批（如果配置了环境保护）
# 3. 审批通过后，自动部署到生产环境（蓝绿部署）
# 4. 健康检查
# 5. 切换流量
```

### 手动部署（紧急情况）

#### 使用部署脚本

```bash
# 登录生产服务器
ssh user@prod-server.com

# 查看部署状态
cd /opt/your-app
./deploy/deploy.sh status

# 部署到绿环境并切换
./deploy/deploy.sh green

# 如果出问题，立即回滚
./deploy/deploy.sh rollback

# 或直接部署到蓝环境（不推荐，会停机）
./deploy/deploy.sh blue
```

#### 使用 Docker Compose 手动操作

```bash
# 拉取新版本镜像
docker-compose pull

# 启动新版本（绿环境）
docker-compose --profile green up -d

# 检查健康状态
curl http://localhost:3001/health

# 切换流量（修改 Nginx 配置）
sudo cp docker/nginx/conf.d/green.conf docker/nginx/conf.d/active.conf
docker-compose exec nginx nginx -s reload

# 验证生产流量
curl http://localhost/health

# 如果正常，停止旧版本
docker-compose stop app-blue
docker rename your-app-blue your-app-blue-old
docker rename your-app-green your-app-blue
```

### 回滚操作

#### 自动回滚（推荐）

如果健康检查失败，GitHub Actions 会自动回滚。

#### 手动回滚

```bash
# 方法1: 使用部署脚本
./deploy/deploy.sh rollback

# 方法2: 手动操作
# 切换 Nginx 配置回蓝环境
sudo cp docker/nginx/conf.d/blue.conf docker/nginx/conf.d/active.conf
docker-compose exec nginx nginx -s reload

# 停止绿环境
docker-compose --profile green stop

# 验证
curl http://localhost/health
```

#### 镜像回滚

```bash
# 查看历史镜像版本
docker images | grep your-app

# 回滚到特定版本
export BLUE_TAG=main-abc123  # 旧版本 tag
docker-compose up -d app-blue

# 切换流量
sudo cp docker/nginx/conf.d/blue.conf docker/nginx/conf.d/active.conf
docker-compose exec nginx nginx -s reload
```

---

## 📊 监控告警

### 访问监控面板

部署完成后，可以访问以下监控面板：

| 服务 | 地址 | 说明 |
|------|------|------|
| 应用 | http://your-domain.com | 生产环境 |
| Grafana | http://your-domain.com:3002 | 监控仪表盘 |
| Prometheus | http://your-domain.com:9090 | 指标查询 |
| 健康检查 | http://your-domain.com/health | 应用健康状态 |

**默认登录凭证**（请立即修改）：

- Grafana: `admin / admin`

### 关键指标

#### 应用层指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| `http_requests_total` | HTTP 请求总数 | - |
| `http_request_duration_seconds` | 请求响应时间 | P95 > 500ms |
| `http_requests_total{status=~"5.."}` | 5xx 错误数 | > 5 req/s |
| `process_memory_usage_bytes` | 内存使用 | > 80% |

#### 系统层指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| `node_cpu_seconds_total` | CPU 使用率 | > 80% |
| `node_memory_MemAvailable_bytes` | 内存可用量 | < 15% |
| `node_filesystem_avail_bytes` | 磁盘可用空间 | < 15% |
| `node_network_receive_bytes_total` | 网络流量 | - |

#### 业务层指标（自定义）

在你的应用中暴露业务指标：

```javascript
const promClient = require('prom-client');

// 创建自定义指标
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// 记录请求耗时
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path, status_code: res.statusCode });
  });
  next();
});

// 暴露指标端点
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

### 告警配置

告警规则定义在 `docker/prometheus/alert_rules.yml`，包含：

- **应用告警**：错误率、响应时间、实例下线
- **基础设施告警**：CPU、内存、磁盘使用率
- **业务告警**：订单处理延迟、支付成功率

**告警级别**：

- `critical` - 立即处理（电话 + 短信）
- `warning` - 尽快处理（邮件 + Slack）
- `info` - 记录备查

---

## 🔧 故障排查

### 常见问题

#### 1. GitHub Actions 部署失败

**症状**：流水线中 `deploy-prod` job 失败

**排查步骤**：

```bash
# 查看 GitHub Actions 日志
# 1. 进入仓库 → Actions → 选择失败的 workflow run
# 2. 展开失败的 job，查看错误日志

# 常见问题：
# - SSH 连接失败：检查 secrets 中的 SSH key 是否正确
# - 镜像拉取失败：检查 DOCKER_PASSWORD 是否过期
# - 健康检查失败：检查应用启动是否正常
```

#### 2. 蓝绿部署失败

**症状**：流量切换后，应用无法访问

**排查步骤**：

```bash
# 1. 检查容器状态
docker-compose ps

# 2. 查看应用日志
docker-compose logs app-green

# 3. 检查健康检查端点
curl http://localhost:3001/health

# 4. 检查 Nginx 配置
docker-compose exec nginx nginx -t

# 5. 查看 Nginx 日志
docker-compose logs nginx

# 6. 回滚到蓝环境
./deploy/deploy.sh rollback
```

#### 3. 应用启动失败

**症状**：容器不断重启

**排查步骤**：

```bash
# 查看容器日志
docker logs your-app-green

# 常见问题：
# - 端口冲突：检查端口是否被占用
# - 环境变量缺失：检查 .env 文件
# - 数据库连接失败：检查数据库网络连通性

# 进入容器调试
docker run -it --entrypoint sh your-app:tag
```

#### 4. 监控数据缺失

**症状**：Grafana 仪表盘显示 "No data"

**排查步骤**：

```bash
# 1. 检查 Prometheus 是否采集到指标
curl http://localhost:9090/api/v1/targets

# 2. 检查应用 /metrics 端点
curl http://localhost:3000/metrics

# 3. 检查 Prometheus 配置
docker-compose exec prometheus cat /etc/prometheus/prometheus.yml

# 4. 重启 Prometheus
docker-compose restart prometheus
```

### 日志查看

#### 应用日志

```bash
# 查看实时日志
docker-compose logs -f app-blue

# 查看最近 100 行
docker-compose logs --tail=100 app-blue

# 查看特定时间段的日志
docker-compose logs --since="2024-01-01T00:00:00" --until="2024-01-02T00:00:00" app-blue
```

#### Nginx 日志

```bash
# 访问日志
tail -f logs/nginx/access.log

# 错误日志
tail -f logs/nginx/error.log
```

#### Docker 守护进程日志

```bash
# systemd 系统
sudo journalctl -u docker -f

# 查看 Docker 事件
docker events
```

---

## 💡 最佳实践

### 1. 分支管理策略

```
main (生产)     ●───●───●───●
                    ↑
develop (开发)   ●───●───●───●
                        ↑
feature/A       ●───●
                        ↑
feature/B             ●───●
```

- `main` 分支：生产环境，只接受来自 `develop` 的合并
- `develop` 分支：开发环境，功能开发完成后合并到这里
- `feature/*` 分支：功能开发，从 `develop` 分支创建

### 2. 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```bash
feat: 添加用户登录功能          # 新功能
fix: 修复订单提交错误            # Bug 修复
docs: 更新 API 文档             # 文档更新
style: 格式化代码                # 代码格式（不影响功能）
refactor: 重构支付模块           # 重构（不是新功能也不是 Bug 修复）
test: 添加用户服务单元测试        # 测试相关
chore: 更新依赖版本              # 构建过程或辅助工具的变动
```

### 3. 镜像标签策略

| 标签类型 | 格式 | 说明 | 示例 |
|---------|------|------|------|
| 分支标签 | `branch-sha` | 每次提交自动生成 | `main-abc1234` |
| 语义化版本 | `v1.2.3` | 正式发布版本 | `v1.2.3` |
| 环境标签 | `stable` / `latest` | 环境当前版本 | `stable` |
| 日期标签 | `YYYYMMDD` | 按日期标记 | `20240115` |

**推荐**：生产环境使用具体的 commit SHA 或语义化版本标签，避免使用 `latest`。

### 4.  secrets 管理

**不要将敏感信息提交到代码仓库！**

✅ **推荐做法**：

```bash
# 使用环境变量
export DATABASE_PASSWORD=secret

# 使用 .env 文件（添加到 .gitignore）
echo ".env" >> .gitignore

# 使用 GitHub Secrets（已加密存储）
# 在 GitHub 仓库 Settings → Secrets and variables 中配置

# 使用密钥管理服务（推荐用于生产）
# - AWS Secrets Manager
# - Azure Key Vault
# - 阿里云 KMS
```

❌ **错误做法**：

```javascript
// ❌ 不要硬编码密码
const dbPassword = "my-secret-password";

// ❌ 不要提交 .env 文件到 Git
git add .env
git commit -m "add env file"  // 危险！
```

### 5. 监控和告警

**关键指标告警设置建议**：

```yaml
# 应用层
- 错误率 > 1% 持续 5 分钟 → warning
- 错误率 > 5% 持续 3 分钟 → critical
- P95 响应时间 > 500ms 持续 5 分钟 → warning
- P95 响应时间 > 1s 持续 3 分钟 → critical

# 系统层
- CPU 使用率 > 80% 持续 10 分钟 → warning
- CPU 使用率 > 90% 持续 5 分钟 → critical
- 内存使用率 > 85% → warning
- 内存使用率 > 95% → critical
- 磁盘使用率 > 85% → warning
- 磁盘使用率 > 95% → critical
```

### 6. 性能优化

#### Docker 镜像优化

```dockerfile
# ❌ 不推荐：单层构建，镜像体积大
FROM node:18
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/server.js"]

# ✅ 推荐：多阶段构建，减小镜像体积
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
USER nodejs
CMD ["node", "dist/server.js"]
```

**优化效果**：

- 镜像体积：从 1.2GB → 150MB（减少 87%）
- 构建时间：利用缓存，第二次构建快 60%
- 安全性：非 root 用户运行，减小攻击面

#### Docker Compose 优化

```yaml
# 使用 BuildKit 加速构建
# 在构建前执行：
export DOCKER_BUILDKIT=1

# 使用镜像拉取策略
services:
  app:
    image: your-app:latest
    pull_policy: always  # 每次都拉取最新镜像

# 配置日志轮转
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 📚 参考资料

### 官方文档

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Docker 官方文档](https://docs.docker.com/)
- [Prometheus 文档](https://prometheus.io/docs/)
- [Nginx 文档](https://nginx.org/en/docs/)

### 推荐阅读

- [蓝绿部署详解](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- [Docker 最佳实践](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Site Reliability Engineering (SRE) 书籍](https://sre.google/books/)

---

## 🆘 获取帮助

如果你在使用的过程中遇到问题：

1. **查看日志**：先查看 GitHub Actions 日志、应用日志、Nginx 日志
2. **查看文档**：阅读本文档的相关章节
3. **搜索问题**：在 GitHub Issues 中搜索类似问题
4. **提问**：如果以上方法都无法解决，提一个新的 Issue

---

**祝你的部署之旅顺利！** 🎉

如有问题或建议，欢迎提 Issue 或 Pull Request。
