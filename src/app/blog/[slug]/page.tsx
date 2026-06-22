import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import { JsonLdArticle, JsonLdBreadcrumb } from "@/components/JsonLd";
import Giscus from "@/components/Giscus";
import type { Metadata } from "next";

const baseUrl = "https://blog.liangzaide.cn";

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const url = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      siteName: "技术博客",
      locale: "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const htmlContent = await markdownToHtml(post.content);

  return (
    <div>
      <ReadingProgress />

      <JsonLdArticle
        title={post.title}
        description={post.description}
        date={post.date}
        author={post.author}
        slug={post.slug}
        tags={post.tags}
        baseUrl={baseUrl}
      />
      <JsonLdBreadcrumb
        items={[
          { name: "首页", url: baseUrl },
          { name: "文章", url: `${baseUrl}/blog` },
          { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="面包屑导航" className="mb-8 text-sm text-gray-400">
          <ol className="flex items-center gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" itemProp="item" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span itemProp="name">首页</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <span className="mx-1" aria-hidden="true">/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/blog" itemProp="item" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span itemProp="name">文章</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <span className="mx-1" aria-hidden="true">/</span>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" aria-current="page">
              <span itemProp="name" className="text-gray-600 dark:text-gray-400">{post.title}</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight tracking-tight text-gray-900 dark:text-white">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {post.author}
            </span>
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <time dateTime={post.date} className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(post.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.readingTime && (
              <>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.readingTime}
                </span>
              </>
            )}
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <a
              href="#comments"
              className="flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              评论
            </a>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Article Body */}
        <div className="flex gap-12">
          <section
            className="prose dark:prose-invert flex-1 min-w-0 pb-16"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          <TableOfContents />
        </div>

        {/* Footer nav */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回文章列表
          </Link>
        </div>

        {/* Comments */}
        <Giscus slug={post.slug} />
      </article>
    </div>
  );
}
