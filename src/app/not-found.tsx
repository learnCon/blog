import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-32">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        页面未找到
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        返回首页
      </Link>
    </div>
  );
}
