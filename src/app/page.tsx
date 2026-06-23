import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

const baseUrl = "https://blog.liangzaide.cn";

export const metadata: Metadata = {
  title: "技术博客 - 分享技术 · 记录成长",
  description:
    "记录编程心得、技术实践与代码分享。用文字沉淀思考，用代码表达想法。涵盖前端、后端、架构设计等技术话题。",
  keywords: [
    "技术博客",
    "编程博客",
    "前端开发",
    "Next.js",
    "React",
    "MDX",
    "TypeScript",
    "架构设计",
    "代码分享",
  ],
  alternates: { canonical: baseUrl },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: baseUrl,
    siteName: "技术博客",
    title: "技术博客 - 分享技术 · 记录成长",
    description:
      "记录编程心得、技术实践与代码分享。用文字沉淀思考，用代码表达想法。",
  },
  twitter: {
    card: "summary_large_image",
    title: "技术博客 - 分享技术 · 记录成长",
    description:
      "记录编程心得、技术实践与代码分享。用文字沉淀思考，用代码表达想法。",
  },
};

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          分享技术 · 记录成长
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">
          技术博客
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
          记录编程心得、技术实践与代码分享。用文字沉淀思考，用代码表达想法。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/blog"
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            浏览文章
          </Link>
          <a
            href="https://github.com/learnCon"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">最新文章</h2>
          {posts.length > 6 && (
            <Link
              href="/blog"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              查看全部 →
            </Link>
          )}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {posts.slice(0, 6).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">✍️</p>
            <p>暂无文章，在 content/posts 下添加 .mdx 文件开始写作吧</p>
          </div>
        )}
      </section>
    </div>
  );
}
