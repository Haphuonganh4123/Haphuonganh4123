/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  output: "export",
  basePath: isGithubPages ? "/Haphuonganh4123" : undefined,
  assetPrefix: isGithubPages ? "/Haphuonganh4123/" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
