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
    if (!ref.current || ref.current.hasChildNodes()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    // 注入 Waline CSS（public/waline.css）
    if (!document.querySelector('link[href*="waline.css"]')) {
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "/waline.css";
      document.head.appendChild(cssLink);
    }

    // 动态 import @waline/client/full
    // 包导出为命名导出，init 是初始化函数
    import("@waline/client/full")
      .then((mod: any) => {
        if (!ref.current) return;

        try {
          mod.init({
            el: ref.current!,
            serverURL: "https://cloud1-4gupto6316a428c8-1422718709.ap-shanghai.app.tcloudbase.com/waline",
            path: `/blog/${slug}`,
            lang: "zh-CN",
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
      })
      .catch((e: any) => {
        setError("评论模块加载失败，请检查网络连接");
        setLoading(false);
      });
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
        </div>
      )}

      <div ref={ref} />
    </section>
  );
}
