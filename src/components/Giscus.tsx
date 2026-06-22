"use client";

import { useEffect, useRef } from "react";

interface CommentsProps {
  slug: string;
}

export default function Giscus({ slug }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // Utterances 配置：基于 GitHub Issues，无需任何 ID
    script.setAttribute("repo", "learnCon/blog");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", "💬 评论");
    script.setAttribute("theme", "github-light");

    ref.current.appendChild(script);
  }, [slug]);

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        评论
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        评论需要登录 GitHub 账号。评论内容将存储在{" "}
        <a
          href="https://github.com/learnCon/blog/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          GitHub Issues
        </a>{" "}
        中。
      </p>
      <div ref={ref} />
    </section>
  );
}
