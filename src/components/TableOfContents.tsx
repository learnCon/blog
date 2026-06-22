"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback((id: string) => {
    // 点击时立即锁定，屏蔽 Observer
    isScrollingRef.current = true;
    setActiveId(id);

    // 清除上一次的定时器
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    // 滚动结束后解锁，让 Observer 重新接管
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  }, []);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headingElements = article.querySelectorAll("h1, h2, h3");
    const headingList: Heading[] = [];

    headingElements.forEach((heading) => {
      headingList.push({
        id: heading.id || "",
        text: heading.textContent || "",
        level: parseInt(heading.tagName[1]),
      });
    });

    setHeadings(headingList);

    const observer = new IntersectionObserver(
      (entries) => {
        // 点击滚动期间完全屏蔽 Observer 更新
        if (isScrollingRef.current) return;

        const visibleHeadings = entries.filter((e) => e.isIntersecting);
        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headingElements.forEach((h) => observer.observe(h));
    return () => {
      observer.disconnect();
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block w-64 flex-shrink-0">
      <div className="sticky top-24">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
          目录
        </h3>
        <ul className="space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                onClick={() => handleClick(heading.id)}
                className={`block py-1.5 pr-2 text-sm transition-all duration-200 border-l-2 -ml-px truncate ${
                  activeId === heading.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/20"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
