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
        source: "/reporting",
        destination: "/reporting/active",
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
        source: "/my-policies",
        destination: "/my-policies/active",
        permanent: false,
      },
    ];
  },
};
