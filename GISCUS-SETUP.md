# Giscus 评论系统配置

## 前提条件

### 1. 启用仓库 Discussions 功能

进入 `https://github.com/learnCon/blog` → Settings → Features → 勾选 **Discussions**

### 2. 安装 Giscus GitHub App

访问 👉 https://github.com/apps/giscus → Install → 选择 `learnCon/blog` 仓库 → Install

### 3. 获取 Repo ID 和 Category ID

访问 👉 https://giscus.app/zh-CN

填写：
- 仓库：`learnCon/blog`
- Discussion 分类：选择 `Comments`（需要先在 Discussions 页面创建此分类）

页面底部会生成类似这样的代码，从中找到两个值：
```html
data-repo-id="R_kgDO..."         ← 这是 REPO_ID
data-category-id="DIC_kwDO..."   ← 这是 CATEGORY_ID
```

### 4. 配置环境变量

**本地开发** — 创建 `.env.local`：
```
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDO你的值
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDO你的值
```

**Cloudflare Pages** — 进入 Dashboard → Workers & Pages → my-tech-blog → Settings → Environment variables，添加：
```
NEXT_PUBLIC_GISCUS_REPO_ID = R_kgDO你的值
NEXT_PUBLIC_GISCUS_CATEGORY_ID = DIC_kwDO你的值
```

### 5. 重新构建部署

```bash
npm run build
npx wrangler pages deploy out --project-name my-tech-blog
```

---

## 技术说明

- 评论数据存储在 `learnCon/blog` 仓库的 GitHub Discussions 中
- 每篇文章按 `slug` 映射到一个独立的 Discussion
- 读者需要 GitHub 账号才能评论
- 支持 Markdown 格式评论、表情回应（Reactions）
- 支持暗色/亮色主题自动切换
