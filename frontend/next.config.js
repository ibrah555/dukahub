/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost', port: '5000' },
            { protocol: 'https', hostname: '**' },
        ],
        unoptimized: true,
    },
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const uploadUrl = apiUrl.replace('/api', '/uploads');
        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/:path*`,
            },
            {
                source: '/uploads/:path*',
                destination: `${uploadUrl}/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
