/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Phase 1: non-auth API routes are proxied via app/api/[...path]/route.js
  // which forwards the httpOnly cookie as Authorization. Auth login/logout/verify
  // use dedicated route handlers under app/api/auth/**.
};

export default nextConfig;
