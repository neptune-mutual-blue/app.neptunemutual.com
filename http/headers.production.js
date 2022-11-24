const connectSources = [
  process.env.NEXT_PUBLIC_ETHEREUM_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_MUMBAI_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_FUJI_SUBGRAPH_URL,
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_AMPLITUDE_SERVER_URL,
  'https://api.thegraph.com/ipfs/',
  'https://*.clarity.ms'
].map((x) => (x || '').trim())
  .filter((x) => !!x)
  .join(' ')

const scriptSources = [
  'https://www.clarity.ms',
  "'sha256-zthm0kQjQC5KNYhnvew0wTIJUipygNCviMTobzxBOWI='",
  "'sha256-9tYg3h6otKKt4HOOPkt0t20+cGoG+94EljCiDDUItLY='"
]
  .map((x) => (x || '').trim())
  .filter((x) => !!x)
  .join(' ')

module.exports = [
  {
    key: 'Content-Security-Policy',
    values: [
      `script-src 'self' ${scriptSources}`,
      `connect-src 'self' ${connectSources}`,
      // "style-src 'self' 'unsafe-inline'",
      "style-src 'self'",
      'upgrade-insecure-requests',
      "frame-ancestors 'none'",
      "default-src 'none'",
      "prefetch-src 'self'",
      "manifest-src 'self'",
      "base-uri 'none'",
      "form-action 'none'",
      "object-src 'none'",
      "img-src 'self' data: https://*.clarity.ms https://*.bing.com",
      "font-src 'self'"
    ]
  },
  {
    key: 'X-DNS-Prefetch-Control',
    values: ['on']
  },
  {
    key: 'X-XSS-Protection',
    values: ['1', 'mode=block']
  },
  {
    key: 'X-Frame-Options',
    values: ['DENY']
  },
  {
    key: 'Referrer-Policy',
    values: ['strict-origin']
  },
  {
    key: 'X-Content-Type-Options',
    values: ['nosniff']
  },
  {
    key: 'Strict-Transport-Security',
    values: ['max-age=31536000', 'includeSubDomains']
  },
  {
    key: 'Expect-CT',
    values: ['enforce, max-age=31536000']
  },
  {
    key: 'Feature-Policy',
    values: [
      "microphone 'none'",
      "camera 'none'",
      "fullscreen 'none'",
      "geolocation 'none'"
    ]
  },
  {
    key: 'Permissions-Policy',
    values: ['fullscreen=(), geolocation=()']
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    values: ['none']
  },
  {
    key: 'Access-Control-Allow-Credentials',
    values: ['false']
  },
  {
    key: 'Access-Control-Allow-Headers',
    values: ['*']
  },
  {
    key: 'Access-Control-Allow-Methods',
    values: ['GET']
  },
  {
    key: 'Access-Control-Max-Age',
    values: ['600']
  }
]
