import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-8 mt-16" role="contentinfo">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 max-w-4xl">
        <p>&copy; {new Date().getFullYear()} 技术博客. All rights reserved.</p>
        <div className="mt-3 flex items-center justify-center gap-4 text-sm">
          <Link
            href="/feed.xml"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="订阅 RSS Feed"
          >
            RSS 订阅
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link
            href="/sitemap.xml"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Sitemap
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <span>Built with Next.js + MDX</span>
        </div>
      </div>
    </footer>
  );
}
