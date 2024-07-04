
/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  output: 'standalone',
  trailingSlash: true,
  reactStrictMode: true,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
    }

    return config
  }
}