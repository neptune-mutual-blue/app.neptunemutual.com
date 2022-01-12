import { convertToUnits } from "@/utils/bn";

const DAYS = 86400;

const defaultInfo = {
  about:
    "Compound is an algorithmic, autonomous interest rate protocol built for developers, to unlock a universe of open financial applications.",
  tags: ["Smart Contract", "DeFi", "Lending"],

  rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
  2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
  3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
  4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
  links: {
    website: "https://compound.finance/",
    documentation: "https://docs.compound.finance/",
    telegram: null,
    twitter: "https://twitter.com/compoundfinance",
    github: "https://github.com/compound",
    facebook: "https://facebook.com/compoundfinance",
    blog: "https://blog.medium.com/compoundfinance",
    discord: "https://discord.com/invite/cU7vmVW",
    linkedin: "https://linkedin.com/in/compoundfinance",
    slack: null,
  },
};

export const getAvailableCovers = () => {
  return [
    {
      id: "1",
      name: "Clearpool",
      imgSrc: "/reporting/clearpool.png",
      coverFees: {
        min: 5,
        max: 7,
      },
      apr: 12.03,
      utilizationRatio: 25,
      protection: 800000,
      liquidity: 11010000,
      key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000001",
      reportingPeriod: 7 * DAYS,
      resolutionSources: [
        "https://twitter.com/ClearpoolFin",
        "https://medium.com/compound-finance",
        "https://twitter.com/neptunemutual",
      ],
      reassuranceToken: {
        at: "0xe8BAb5ca5eA0Fc93b2a4E1aD22376726ED209ed5",
        name: "DAI Stablecoin",
        symbol: "DAI",
        initialAmount: convertToUnits(50_000).toString(),
      },
      stakeWithFees: convertToUnits(50_000).toString(),
      initialLiquidity: convertToUnits(50_000).toString(),
      minReportingStake: convertToUnits(500).toString(),
      about:
        "Clearpool introduces single borrower liquidity pools, allowing whitelisted borrowers to compete for uncollateralized liquidity directly from the DeFi ecosystem.",
      tags: ["Smart Contract", "DeFi", "Lending"],

      rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
      2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
      3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
      4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
      links: {
        website: "https://clearpool.finance/",
        documentation: "https://docs.clearpool.finance/resources/documents",
        telegram: "https://t.me/clearpoolofficial",
        twitter: "https://twitter.com/ClearpoolFin",
        github: "https://github.com/clearpool-finance",
        facebook: "https://www.facebook.com/clearpoolfinance/",
        blog: "https://clearpool.medium.com/",
        discord: null,
        linkedin: "https://www.linkedin.com/company/clearpool/",
        slack: null,
      },
    },
    {
      id: "2",
      name: "coinbase",
      imgSrc: "/reporting/coinbase.png",
      coverFees: {
        min: 5,
        max: 7,
      },
      apr: 12.03,
      utilizationRatio: 65,
      protection: 800000,
      liquidity: 11010000,
      key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000002",
      reportingPeriod: 7 * DAYS,
      resolutionSources: [
        "https://twitter.com/coinbase",
        "https://blog.coinbase.com/",
        "https://twitter.com/neptunemutual",
      ],
      reassuranceToken: {
        at: "0xe8BAb5ca5eA0Fc93b2a4E1aD22376726ED209ed5",
        name: "DAI Stablecoin",
        symbol: "DAI",
        initialAmount: convertToUnits(50_000).toString(),
      },
      stakeWithFees: convertToUnits(50_000).toString(),
      initialLiquidity: convertToUnits(50_000).toString(),
      minReportingStake: convertToUnits(500).toString(),
      about:
        "Coinbase is a secure online platform for buying, selling, transferring, and storing cryptocurrency.",
      tags: ["Smart Contract", "DeFi", "Lending"],

      rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
      2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
      3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
      4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
      links: {
        website: "https://www.coinbase.com/",
        documentation: "https://developers.coinbase.com/api/v2",
        telegram: null,
        twitter: "https://twitter.com/coinbase",
        github: "https://github.com/coinbase",
        facebook: "https://www.facebook.com/Coinbase",
        blog: "https://blog.coinbase.com/",
        discord: "https://discord.com/invite/APpF8aZ",
        linkedin: "https://www.linkedin.com/company/coinbase/",
        slack: null,
      },
    },
    {
      id: "3",
      name: "hex trust",
      imgSrc: "/reporting/hextrust.png",
      coverFees: {
        min: 5,
        max: 7,
      },
      apr: 12.03,
      utilizationRatio: 85,
      protection: 800000,
      liquidity: 11010000,
      key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000003",
      reportingPeriod: 7 * DAYS,
      resolutionSources: [
        "https://twitter.com/Hex_Trust",
        "https://medium.com/hex-trust",
        "https://twitter.com/neptunemutual",
      ],
      reassuranceToken: {
        at: "0xe8BAb5ca5eA0Fc93b2a4E1aD22376726ED209ed5",
        name: "DAI Stablecoin",
        symbol: "DAI",
        initialAmount: convertToUnits(50_000).toString(),
      },
      stakeWithFees: convertToUnits(50_000).toString(),
      initialLiquidity: convertToUnits(50_000).toString(),
      minReportingStake: convertToUnits(500).toString(),
      about:
        "Hex Trust is fully licenced, insured, and the leading provider of bank-grade custody for digital assets. ",
      tags: ["Smart Contract", "DeFi", "Lending"],

      rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
      2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
      3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
      4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
      links: {
        website: "https://hextrust.com/",
        documentation: null,
        telegram: null,
        twitter: "https://twitter.com/Hex_Trust",
        github: "https://github.com/hextrust",
        facebook: null,
        blog: "https://medium.com/hex-trust",
        discord: null,
        linkedin: "https://hk.linkedin.com/company/hextrust",
        slack: null,
      },
    },
    {
      id: "4",
      name: "okex",
      imgSrc: "/reporting/okex.png",
      coverFees: {
        min: 5,
        max: 7,
      },
      apr: 12.03,
      utilizationRatio: 15,
      protection: 800000,
      liquidity: 11010000,
      key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000004",
      reportingPeriod: 7 * DAYS,
      resolutionSources: [
        "https://twitter.com/OKEx",
        "https://medium.com/okex-blog",
        "https://twitter.com/neptunemutual",
      ],
      reassuranceToken: {
        at: "0xe8BAb5ca5eA0Fc93b2a4E1aD22376726ED209ed5",
        name: "DAI Stablecoin",
        symbol: "DAI",
        initialAmount: convertToUnits(50_000).toString(),
      },
      stakeWithFees: convertToUnits(50_000).toString(),
      initialLiquidity: convertToUnits(50_000).toString(),
      minReportingStake: convertToUnits(500).toString(),
      about:
        "OKEx is a Seychelles-based cryptocurrency exchange that provides a platform for trading various cryptocurrencies.",
      tags: ["Smart Contract", "DeFi", "Lending"],

      rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
      2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
      3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
      4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
      links: {
        website: "https://www.okex.com/",
        documentation: "https://www.okex.com/docs-v5/en/",
        telegram: "https://t.me/OKExOfficial_English",
        twitter: "https://twitter.com/OKEx",
        github: "https://github.com/okex",
        facebook: "https://www.facebook.com/okexofficial",
        blog: "https://medium.com/okex-blog",
        discord: "https://discord.com/invite/sanS9FuGV4",
        linkedin: "https://www.linkedin.com/company/okex/",
        slack: null,
      },
    },
    {
      id: "5",
      name: "huobi",
      imgSrc: "/reporting/huobi.png",
      coverFees: {
        min: 5,
        max: 7,
      },
      apr: 12.03,
      utilizationRatio: 25,
      protection: 800000,
      liquidity: 11010000,
      key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000005",
      reportingPeriod: 7 * DAYS,
      resolutionSources: [
        "https://twitter.com/HuobiGlobal",
        "https://huobiglobal.medium.com/",
        "https://twitter.com/neptunemutual",
      ],
      reassuranceToken: {
        at: "0xe8BAb5ca5eA0Fc93b2a4E1aD22376726ED209ed5",
        name: "DAI Stablecoin",
        symbol: "DAI",
        initialAmount: convertToUnits(50_000).toString(),
      },
      stakeWithFees: convertToUnits(50_000).toString(),
      initialLiquidity: convertToUnits(50_000).toString(),
      minReportingStake: convertToUnits(500).toString(),
      about:
        "Huobi is a Seychelles-based cryptocurrency exchange.",
      tags: ["Exchange", "DeFi", "Lending"],

      rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
      2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
      3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
      4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
      links: {
        website: "https://www.huobi.com/en-us/",
        documentation: "https://docs.huobigroup.com/docs/option/v1/en/#introduction",
        telegram: "https://t.me/huobiglobalofficial",
        twitter: "https://twitter.com/HuobiGlobal",
        github: "https://github.com/huobiapi",
        facebook: "https://www.facebook.com/huobiglobalofficial",
        blog: "https://huobiglobal.medium.com/",
        discord: "https://discord.com/invite/xrAq7Fv7Xx",
        linkedin: "https://www.linkedin.com/company/huobi/",
        slack: null,
      },
    },
    {
      id: "6",
      name: "axie",
      imgSrc: "/reporting/axie.png",
      coverFees: {
        min: 5,
        max: 7,
      },
      apr: 12.03,
      utilizationRatio: 0,
      protection: 800000,
      liquidity: 11010000,
      key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000006",
      reportingPeriod: 7 * DAYS,
      resolutionSources: [
        "https://twitter.com/axieinfinity",
        "https://axie.substack.com/",
        "https://twitter.com/neptunemutual",
      ],
      reassuranceToken: {
        at: "0xe8BAb5ca5eA0Fc93b2a4E1aD22376726ED209ed5",
        name: "DAI Stablecoin",
        symbol: "DAI",
        initialAmount: convertToUnits(50_000).toString(),
      },
      stakeWithFees: convertToUnits(50_000).toString(),
      initialLiquidity: convertToUnits(50_000).toString(),
      minReportingStake: convertToUnits(500).toString(),
      about:
        "Axie Infinity is an NFT-based online video game developed by Vietnamese studio Sky Mavis, which uses Ethereum-based cryptocurrencies, Axie Infinity Shards and Smooth Love Potion.",
      tags: ["Smart Contract", "NFT", "Gaming"],

      rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
      2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
      3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
      4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
      links: {
        website: "https://axieinfinity.com/",
        documentation: "https://whitepaper.axieinfinity.com/",
        telegram: null,
        twitter: "https://twitter.com/axieinfinity",
        github: "https://github.com/axieinfinity",
        facebook: "https://www.facebook.com/AxieInfinity",
        blog: "https://axie.substack.com/",
        discord: "https://discord.com/invite/axie",
        linkedin: "https://www.linkedin.com/company/axieinfinity/",
        slack: null,
      },
    },
  ];
};
