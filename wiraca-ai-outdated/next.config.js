/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Force webpack to ensure stability on Windows
    webpack: (config) => {
        return config;
    },
};

const withSerwist = require("@serwist/next").default({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

module.exports = withSerwist(nextConfig);
