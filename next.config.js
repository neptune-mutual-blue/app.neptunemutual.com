/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [
      ['@lingui/swc-plugin', {}]
    ]
  },
  eslint: {
    dirs: ['http', 'lib', 'src']
  }
}
