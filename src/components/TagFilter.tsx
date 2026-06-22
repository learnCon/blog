"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { BlogPost } from "@/types/post";

interface TagFilterProps {
  posts: BlogPost[];
  tags: string[];
}

export default function TagFilter({ posts, tags }: TagFilterProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") || undefined;

  const filteredPosts = activeTag
    ? posts.filter((post) => post.tags.includes(activeTag))
    : posts;

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">标签筛选</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Link
                key={t}
                href={`/blog${activeTag === t ? "" : `?tag=${t}`}`}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  activeTag === t
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900"
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 py-16">
          {activeTag
            ? `没有找到标签为 "${activeTag}" 的文章`
            : "暂无文章，请在 content/posts 目录下添加 .mdx 文件"}
        </p>
      )}
    </div>
  );
}
