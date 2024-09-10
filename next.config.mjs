/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // React Strict Mode 비활성화
  // output: 'export',
  // images: {
  //   remotePatterns: ["traveltales.s3.ap-northeast-2.amazonaws.com"], // 이곳에 에러에서 hostname 다음 따옴표에 오는 링크를 적으면 된다.
  //   formats: ["image/avif", "image/webp"],
  // },
  images: {
    remotePatterns: [
      {
        hostname: "traveltales.s3.ap-northeast-2.amazonaws.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
