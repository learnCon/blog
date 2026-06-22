import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
