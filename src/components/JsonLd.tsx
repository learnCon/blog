interface JsonLdWebSiteProps {
  baseUrl: string;
  name: string;
  description: string;
}

export function JsonLdWebSite({ baseUrl, name, description }: JsonLdWebSiteProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    name,
    description,
    inLanguage: "zh-CN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/blog?tag={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface JsonLdArticleProps {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
  tags: string[];
  baseUrl: string;
}

export function JsonLdArticle({
  title,
  description,
  date,
  author,
  slug,
  tags,
  baseUrl,
}: JsonLdArticleProps) {
  const url = `${baseUrl}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "技术博客",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: tags.join(", "),
    inLanguage: "zh-CN",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface JsonLdBreadcrumbProps {
  items: { name: string; url: string }[];
}

export function JsonLdBreadcrumb({ items }: JsonLdBreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
