/** @type {import('next').NextConfig} */
const serverUrl = process.env.SERVER_URL

const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: `${serverUrl}/:path*`,
      },
    ];
  }
};

export default nextConfig;
