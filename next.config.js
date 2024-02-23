/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    modularizeImports: {
        "@mui/icons-material": {
            transform: "@mui/icons-material/{{member}}",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "source.unsplash.com",
                port: "",
                pathname: "/random",
            },
            {
                protocol: "https",
                hostname: "domgeot-website-images.s3.eu-north-1.amazonaws.com",
                port: "",
                pathname: "/*",
            },
        ],
    },
    optimizeFonts: false,
}

module.exports = nextConfig
