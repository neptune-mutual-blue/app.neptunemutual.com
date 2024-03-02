/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'export',
  experimental: {
    swcPlugins: [
      ['@lingui/swc-plugin', {}]
    ]
  },
  eslint: {
    dirs: ['http', 'lib', 'src']
  }
}
