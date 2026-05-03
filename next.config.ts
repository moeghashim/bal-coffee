export default {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};
