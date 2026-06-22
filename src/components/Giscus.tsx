"use client";

import { useEffect, useRef, useState } from "react";

interface CommentsProps {
  slug: string;
}

export default function Giscus({ slug }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    setStatus("loading");

    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      setStatus("loaded");
    };

    script.onerror = () => {
      setStatus("error");
    };

    script.setAttribute("repo", "learnCon/blog");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", "💬 评论");
    script.setAttribute("theme", "github-light");

    ref.current.appendChild(script);
  }, [slug]);

  // 处理 URL hash 定位
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (hash === "comments") {
      const timer = setTimeout(() => {
        const el = document.getElementById("comments");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 id="comments" className="text-lg font-semibold text-gray-900 dark:text-white mb-6 scroll-mt-24">
        评论
      </h2>

      {status === "loading" && (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          评论区加载中...
        </p>
      )}

      {status === "error" && (
        <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="font-medium mb-2">评论区加载失败</p>
          <p className="mb-2">
            可能的原因：网络无法访问 GitHub。你可以：
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              开启代理后{" "}
              <button
                onClick={() => window.location.reload()}
                className="text-blue-500 hover:underline"
              >
                刷新页面
              </button>
            </li>
            <li>
              直接访问{" "}
              <a
                href={`https://github.com/learnCon/blog/issues?q=${encodeURIComponent(`label:"💬 评论" ${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitHub Issues
              </a>{" "}
              查看评论
            </li>
          </ol>
        </div>
      )}

      <div ref={ref} />
    </section>
  );
}
