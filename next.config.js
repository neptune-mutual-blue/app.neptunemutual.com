module.exports = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/pools",
        destination: "/pools/bond",
        permanent: false,
      },
      {
        source: "/cover/:path/purchase",
        destination: "/cover/:path/purchase/details",
        permanent: false,
      },
      {
        source: "/cover/:path",
        destination: "/cover/:path/options",
        permanent: false,
      },
      {
        source: "/cover/:path/report",
        destination: "/cover/:path/report/details",
        permanent: false,
      },
      {
        source: "/cover/:path/add-liquidity",
        destination: "/cover/:path/add-liquidity/details",
        permanent: false,
      },
      {
        source: "/cover/:path/claim",
        destination: "/cover/:path/claim/details",
        permanent: false,
      },
    ];
  },
};
