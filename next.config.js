/** @type {() => import('next').NextConfig} */
const nextConfig = () => {
  return {
    reactStrictMode: true,
    output: 'export',
    eslint: {
      dirs: ['http', 'lib', 'src']
    }
  }
}

module.exports = nextConfig
