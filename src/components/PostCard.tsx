import Link from "next/link";
import { BlogPost } from "@/types/post";

export default function PostCard({ post }: { post: BlogPost }) {
  const date = new Date(post.date);
  const formattedDate = date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${post.slug}`} aria-label={`阅读文章：${post.title}`}>
      <article className="group border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 bg-white dark:bg-gray-900 h-full flex flex-col">
        <h3 className="text-lg font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 line-clamp-2 leading-relaxed">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <time dateTime={post.date}>{formattedDate}</time>
          {post.readingTime && <span>{post.readingTime}</span>}
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
