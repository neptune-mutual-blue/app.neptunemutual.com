module.exports = [
  {
    source: '/pools',
    destination: '/pools/bond',
    permanent: false
  },
  {
    source: '/reports',
    destination: '/reports/active',
    permanent: false
  },
  {
    source: '/reports/:coverId/incidents/:timestamp',
    destination: '/reports/:coverId/incidents/:timestamp/details',
    permanent: false
  },
  {
    source: '/reports/:coverId/products/:productId/incidents/:timestamp',
    destination:
      '/reports/:coverId/products/:productId/incidents/:timestamp/details',
    permanent: false
  },
  {
    source: '/my-policies',
    destination: '/my-policies/active',
    permanent: false
  }
]
