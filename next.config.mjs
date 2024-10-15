/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Solo si usas la carpeta /app en tu proyecto
  },
  "process.env": process.env,
};

export default nextConfig;
