import { getAllPosts, getAllTags } from "@/lib/posts";
import TagFilter from "@/components/TagFilter";
import { JsonLdBlog } from "@/components/JsonLd";
import { Suspense } from "react";
import type { Metadata } from "next";

const baseUrl = "https://blog.liangzaide.cn";

export const metadata: Metadata = {
  title: "博客文章",
  description: "浏览所有技术文章，涵盖前端开发、架构设计、编程实践等话题。按标签筛选你感兴趣的内容。",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: "博客文章 - 技术博客",
    description: "浏览所有技术文章，涵盖前端开发、架构设计、编程实践等话题。",
    url: `${baseUrl}/blog`,
    type: "website",
    siteName: "技术博客",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "博客文章 - 技术博客",
    description: "浏览所有技术文章，涵盖前端开发、架构设计、编程实践等话题。",
  },
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const tags = getAllTags();

  return (
    <div>
      <JsonLdBlog
        baseUrl={baseUrl}
        name="技术博客"
        description="浏览所有技术文章，涵盖前端开发、架构设计、编程实践等话题。"
        posts={allPosts.map((p) => ({
          title: p.title,
          slug: p.slug,
          description: p.description,
          date: p.date,
          author: p.author,
        }))}
      />

      <h1 className="text-4xl font-bold mb-8">博客文章</h1>
      <Suspense fallback={<div className="text-gray-400">加载中...</div>}>
        <TagFilter posts={allPosts} tags={tags} />
      </Suspense>
    </div>
  );
}
