import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLdWebSite } from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = "https://blog.liangzaide.cn";

export const metadata: Metadata = {
  title: {
    default: "技术博客 - 分享技术 · 记录成长",
    template: "%s | 技术博客",
  },
  description: "记录编程心得、技术实践与代码分享。用文字沉淀思考，用代码表达想法。涵盖前端、后端、架构设计等技术话题。",
  keywords: ["技术博客", "编程博客", "前端开发", "Next.js", "React", "MDX", "TypeScript", "架构设计", "代码分享"],
  authors: [{ name: "开发者", url: baseUrl }],
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
    types: {
      "application/atom+xml": `${baseUrl}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: baseUrl,
    siteName: "技术博客",
    title: "技术博客 - 分享技术 · 记录成长",
    description: "记录编程心得、技术实践与代码分享。用文字沉淀思考，用代码表达想法。",
  },
  twitter: {
    card: "summary_large_image",
    title: "技术博客 - 分享技术 · 记录成长",
    description: "记录编程心得、技术实践与代码分享。用文字沉淀思考，用代码表达想法。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <JsonLdWebSite
          baseUrl={baseUrl}
          name="技术博客"
          description="记录编程心得、技术实践与代码分享。用文字沉淀思考，用代码表达想法。"
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
