export const coverList = [];

export const getCoverInfo = () => {
  const info = {
    key: "0x70726f746f3a636f6e7472616374733a636f7665723a6366633a303100000000",
    coverName: "Compound Finance Cover",
    projectName: "Compound Finance",
    about:
      "Compound is an algorithmic, autonomous interest rate protocol built for developers, to unlock a universe of open financial applications.",
    tags: ["Smart Contract", "DeFi", "Lending"],
    blockchain: {
      chainId: 1,
      name: "Main Ethereum Network",
    },
    smartContracts: ["0xc00e94cb662c3520282e6f5717214004a7f26888"],
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
    reportingPeriod: 7,
    selfCoveragePeriod: 30,
    resolutionSources: [
      "https://twitter.com/compoundfinance",
      "https://medium.com/compound-finance",
      "https://twitter.com/neptunemutual",
    ],
    assuranceToken: {
      at: "0x0e7c8a8545352663ee070f1c9a0174f4a50532dc",
      name: "Compound",
      symbol: "COMP",
      initialAmount: "5000000000000000000000",
    },
    stakeWithFees: "5000000000000000000000",
    initialLiquidity: "5000000000000000000000",
  };

  return info;
};
