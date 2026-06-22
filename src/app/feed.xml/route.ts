import { getAllPosts } from "@/lib/posts";

const baseUrl = "https://blog.liangzaide.cn";

export async function GET() {
  const posts = getAllPosts();

  const feedItems = posts
    .map(
      (post) => `
    <entry>
      <title><![CDATA[${post.title}]]></title>
      <link href="${baseUrl}/blog/${post.slug}/" />
      <id>${baseUrl}/blog/${post.slug}/</id>
      <updated>${new Date(post.date).toISOString()}</updated>
      <published>${new Date(post.date).toISOString()}</published>
      <summary><![CDATA[${post.description}]]></summary>
      <author>
        <name>${post.author}</name>
      </author>
      ${post.tags.map((tag) => `<category term="${tag}" />`).join("\n      ")}
    </entry>`
    )
    .join("");

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>技术博客</title>
  <subtitle>分享技术 · 记录成长</subtitle>
  <link href="${baseUrl}" rel="alternate" />
  <link href="${baseUrl}/feed.xml" rel="self" />
  <id>${baseUrl}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>开发者</name>
  </author>
  <rights>Copyright ${new Date().getFullYear()} 技术博客</rights>${feedItems}
</feed>`;

  return new Response(atomFeed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
