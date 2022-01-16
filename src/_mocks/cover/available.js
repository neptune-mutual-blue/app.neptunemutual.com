import { convertToUnits } from "@/utils/bn";

const DAYS = 86400;

const ether = (x) => convertToUnits(x).toString();

const defaultInfo = {
  coverFees: {
    min: 5,
    max: 7,
  },
  apr: 12.03,
  utilizationRatio: 25,
  protection: 800000,
  liquidity: 11010000,
};

export const getAvailableCovers = () => {
  return [
    {
      coverName: "Clearpool Cover",
      projectName: "Clearpool",
      key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000001",
      reportingPeriod: 7 * DAYS,
      resolutionSources: [
        "https://twitter.com/ClearpoolFin",
        "https://clearpool.medium.com/",
        "https://twitter.com/neptunemutual",
      ],
      reassuranceToken: {
        at: "0xe8BAb5ca5eA0Fc93b2a4E1aD22376726ED209ed5",
        name: "DAI Stablecoin",
        symbol: "DAI",
        initialAmount: ether(50_000),
      },
      stakeWithFees: ether(50_000),
      initialLiquidity: ether(50_000),
      minReportingStake: ether(500),
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
      coverName: "Coinbase Cover",
      projectName: "Coinbase",
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
        initialAmount: ether(50_000),
      },
      stakeWithFees: ether(50_000),
      initialLiquidity: ether(50_000),
      minReportingStake: ether(500),
      about:
        "Coinbase is a secure online platform for buying, selling, transferring, and storing cryptocurrency.",
      tags: ["Smart Contract", "DeFi", "Exchange"],
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
      coverName: "Hex Trust Cover",
      projectName: "Hex Trust",
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
        initialAmount: ether(50_000),
      },
      stakeWithFees: ether(50_000),
      initialLiquidity: ether(50_000),
      minReportingStake: ether(500),
      about:
        "Hex Trust is fully licenced, insured, and the leading provider of bank-grade custody for digital assets. ",
      tags: ["Smart Contract", "DeFi", "Custody"],
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
      coverName: "OKEx Cover",
      projectName: "OKEx",
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
        initialAmount: ether(50_000),
      },
      stakeWithFees: ether(50_000),
      initialLiquidity: ether(50_000),
      minReportingStake: ether(500),
      about:
        "OKEx is a Seychelles-based cryptocurrency exchange that provides a platform for trading various cryptocurrencies.",
      tags: ["Smart Contract", "DeFi", "Exchange"],
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
      coverName: "Huobi Cover",
      projectName: "Huobi",
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
        initialAmount: ether(50_000),
      },
      stakeWithFees: ether(50_000),
      initialLiquidity: ether(50_000),
      minReportingStake: ether(500),
      about: "Huobi is a Seychelles-based cryptocurrency exchange.",
      tags: ["Exchange", "DeFi", "Exchange"],
      rules: `1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.
      2. During your coverage period, the protocol faced an attack, hack, exploitation, or vulnerability which resulted in the user assets being stolen or lost and the protocol was also unable to cover the loss themselves. This does not have to be your own loss.
      3. The protocol never communicated anything about their plans to cover the lost fund and de-risk their users within 7 days of the incident.
      4. The protocol promised but later were unable to cover, write off, or bear at least 75% of the sufferred loss on behalf of their users within 30 days of the incident`,
      links: {
        website: "https://www.huobi.com/en-us/",
        documentation:
          "https://docs.huobigroup.com/docs/option/v1/en/#introduction",
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
      coverName: "Axie",
      projectName: "Axie",
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
        initialAmount: ether(50_000),
      },
      stakeWithFees: ether(50_000),
      initialLiquidity: ether(50_000),
      minReportingStake: ether(500),
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
  ].map((x) => ({ ...x, ...defaultInfo,imgSrc:`/images/covers/${x.key}.png` }));
};
