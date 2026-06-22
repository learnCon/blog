"use client";

import { useEffect, useRef, useState } from "react";

interface CommentsProps {
  slug: string;
}

export default function Giscus({ slug }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    setLoading(true);
    setError("");

    // 动态加载 Waline CSS
    if (!document.querySelector('link[href*="waline"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/@waline/client@v3/dist/waline.css";
      document.head.appendChild(link);
    }

    // 动态加载 Waline JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@waline/client@v3/dist/waline.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if ((window as any).Waline) {
        // @ts-ignore
        (window as any).Waline({
          el: ref.current,
          serverURL: "https://waline-test-goer.vercel.app", // Waline 官方测试服务，可替换为自有后端
          path: `/blog/${slug}`,
          lang: "zh-CN",
          locale: "zh-CN",
          reaction: true,
          meta: ["nick", "mail", "link"],
          requiredMeta: ["nick", "mail"],
          dark: "auto",
        });
        setLoading(false);
      }
    };

    script.onerror = () => {
      setError("评论脚本加载失败，请检查网络连接");
      setLoading(false);
    };

    document.body.appendChild(script);
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
      <h2
        id="comments"
        className="text-lg font-semibold text-gray-900 dark:text-white mb-6 scroll-mt-24"
      >
        评论
      </h2>

      {loading && (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          评论区加载中...
        </p>
      )}

      {error && (
        <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="font-medium mb-2">评论区加载失败</p>
          <p>{error}</p>
        </div>
      )}

      <div ref={ref} />
    </section>
  );
}
