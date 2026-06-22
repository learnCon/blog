# 博客部署到 Cloudflare Pages 操作指南

## ✅ 已完成的配置

| 文件 | 说明 |
|------|------|
| `.github/workflows/deploy-pages.yml` | GitHub Actions 自动部署工作流 |
| `wrangler.toml` | Cloudflare Pages 项目配置 |
| `next.config.mjs` | `output: "export"` 静态导出（已有） |

推送 main 分支时自动触发：构建 → 部署到 Cloudflare Pages。

---

## 🚀 Cloudflare 后台配置步骤

### 第 1 步：创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → **Workers & Pages** → **Create application** → **Pages**
3. 选择 **Connect to Git** → 授权 GitHub → 选择 `learnCon/blog` 仓库
4. 配置构建设置：

| 设置项 | 值 |
|--------|-----|
| 项目名称 | `my-tech-blog` |
| 生产分支 | `main` |
| 构建命令 | `npm run build` |
| 构建输出目录 | `out` |
| Node.js 版本 | `20` |

5. 点击 **Save and Deploy** → 等待首次部署完成

> 首次部署成功后，后续推送代码将自动通过 GitHub Actions 完成部署。

---

### 第 2 步：获取 API Token 和 Account ID

**获取 Account ID：**
1. Cloudflare Dashboard 右上角点击头像 → **My Profile**（或主页右侧栏）
2. 复制 **Account ID**（32 位字符串）

**创建 API Token：**
1. Dashboard → **My Profile** → **API Tokens** → **Create Token**
2. 选择 **Edit Cloudflare Workers** 模板（或自定义）
3. 权限设置：
   - `Account` → `Cloudflare Pages` → **Edit**
   - `Account` → `Workers Scripts` → **Read**（可选）
4. 限制账户范围（推荐）→ **Continue to summary** → **Create Token**
5. **立即复制 Token**（只显示一次！）

---

### 第 3 步：配置 GitHub Secrets

进入 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

添加以下两个 Secret：

| Secret 名称 | 值 |
|-------------|-----|
| `CLOUDFLARE_API_TOKEN` | 上一步创建的 API Token |
| `CLOUDFLARE_ACCOUNT_ID` | 你的 Cloudflare Account ID |

---

### 第 4 步：触发自动部署

配置完 Secrets 后，推送任意代码到 main 分支即可触发自动部署：

```bash
# 如果本地有改动，执行：
git push origin main
```

也可以在 GitHub Actions 页面手动触发：
**仓库** → **Actions** → **Deploy to Cloudflare Pages** → **Run workflow**

---

## 🌐 部署完成后

部署成功后，你的博客将有两个访问地址：

| 类型 | 地址 |
|------|------|
| **Cloudflare 默认域名** | `https://my-tech-blog.pages.dev` |
| **自定义域名**（可选） | 配置后生效 |

### 绑定自定义域名（可选）

1. Cloudflare Dashboard → **Workers & Pages** → 点击你的项目
2. **Custom domains** → **Set up a custom domain**
3. 输入你的域名（如 `blog.yourdomain.com`）
4. 如果域名在 Cloudflare 管理，DNS 记录会自动添加；否则手动添加 CNAME

---

## 📊 自动化流程说明

```
代码推送到 main
      ↓
GitHub Actions 触发
      ↓
npm ci（安装依赖）
      ↓
npm run build（Next.js 静态导出 → out/ 目录）
      ↓
cloudflare/pages-action 上传 out/ 到 Cloudflare Pages
      ↓
✅ 博客更新上线（约 2-3 分钟完成）
```

**PR 预览**：提交 Pull Request 时，GitHub Actions 会自动部署一个预览版本，预览链接会出现在 PR 评论中。

---

## ❓ 常见问题

**Q：构建失败，提示 `out` 目录不存在？**  
A：确认 `next.config.mjs` 中有 `output: "export"`。

**Q：图片不显示？**  
A：确认 `next.config.mjs` 中有 `images: { unoptimized: true }`（已配置）。

**Q：页面 404？**  
A：确认 `next.config.mjs` 中有 `trailingSlash: true`（已配置）。

**Q：部署成功但样式丢失？**  
A：检查 Tailwind CSS 是否正常构建，查看 Actions 日志确认无报错。
