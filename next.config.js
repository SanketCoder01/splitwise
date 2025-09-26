/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'localhost',
            'api.resuchain.gov.in',
            'images.unsplash.com',
            'upload.wikimedia.org',
            'cdn-icons-png.flaticon.com',
            'cdn.jsdelivr.net'
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ['pdf-parse', 'mammoth']
    }
}

module.exports = nextConfig