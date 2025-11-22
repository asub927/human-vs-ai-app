/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
    },
    // Enable experimental features for App Router
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    // Environment variables available to the client
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
}

export default nextConfig
