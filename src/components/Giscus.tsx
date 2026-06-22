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

    // 使用本地 CSS（不经过境外 CDN）
    if (!document.querySelector('link[href*="waline"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/waline/waline.css";
      document.head.appendChild(link);
    }

    // 使用本地 JS
    const script = document.createElement("script");
    script.src = "/waline/waline.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if ((window as any).Waline) {
        try {
          // @ts-ignore
          (window as any).Waline({
            el: ref.current,
            // 使用 Waline 官方体验后端（国内可访问 vercel.app）
            // 如需自有后端，请参考：https://waline.js.org/guide/get-started.html
            serverURL: "https://waline-test-goer.vercel.app",
            path: `/blog/${slug}`,
            lang: "zh-CN",
            locale: "zh-CN",
            reaction: true,
            meta: ["nick", "mail", "link"],
            requiredMeta: ["nick", "mail"],
            dark: "auto",
            comment: true,
            pageview: true,
          });
          setLoading(false);
        } catch (e: any) {
          setError("评论初始化失败：" + e.message);
          setLoading(false);
        }
      }
    };

    script.onerror = () => {
      setError("评论脚本加载失败，请检查网络连接");
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // 清理：防止组件卸载后脚本还在
      try { document.body.removeChild(script); } catch {}
    };
  }, [slug]);

  // 处理 URL hash 定位（如 /blog/xxx#comments）
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.slice(1);
    if (hash === "comments") {
      const timer = setTimeout(() => {
        const el = document.getElementById("comments");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 1200);
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

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        评论需要填写昵称和邮箱。评论内容将公开显示。
      </p>

      {loading && (
        <p className="text-sm text-gray-400 dark:text-gray-500">
          评论区加载中...
        </p>
      )}

      {error && (
        <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <p className="font-medium mb-2">评论区暂时无法加载</p>
          <p>{error}</p>
          <p className="mt-2 text-xs text-gray-400">
            提示：如因网络问题无法加载评论，请尝试开启代理后刷新页面。
          </p>
        </div>
      )}

      <div ref={ref} />
    </section>
  );
}
