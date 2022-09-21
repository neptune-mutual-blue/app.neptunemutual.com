module.exports = [
  {
    source: "/pools",
    destination: "/pools/bond",
    permanent: false,
  },
  {
    source: "/reports",
    destination: "/reports/active",
    permanent: false,
  },
  {
    source: "/reports/:cover_id/incidents/:timestamp",
    destination: "/reports/:cover_id/incidents/:timestamp/details",
    permanent: false,
  },
  {
    source: "/reports/:cover_id/products/:product_id/incidents/:timestamp",
    destination:
      "/reports/:cover_id/products/:product_id/incidents/:timestamp/details",
    permanent: false,
  },
  {
    source: "/my-policies",
    destination: "/my-policies/active",
    permanent: false,
  },
];
