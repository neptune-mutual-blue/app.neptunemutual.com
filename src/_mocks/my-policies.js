export const getActivePolicies = () => {
  return [
    {
      id: "1",
      name: "Clearpool",      
      status: "Claimable",
      claimBefore: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x636c656172706f6f6c0000000000000000000000000000000000000000000000",
    },
    {
      id: "2",
      name: "coinbase",      
      status: "Reporting",
      claimBefore: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x636f696e62617365000000000000000000000000000000000000000000000000",
    },
    {
      id: "3",
      name: "hex trust",      
      status: "",
      claimBefore: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x6865782d74727573740000000000000000000000000000000000000000000000",
    },
    {
      id: "4",
      name: "okex",      
      status: "Reporting",
      claimBefore: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x6f6b000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "5",
      name: "huobi",      
      status: "",
      claimBefore: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x68756f6269000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "6",
      name: "axie",      
      status: "",
      claimBefore: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x6178696500000000000000000000000000000000000000000000000000000000",
    },
  ];
};

export const getExpiredPolicies = () => {
  return [
    {
      id: "1",
      name: "Clearpool",      
      status: "Claimable",
      expiresOn: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "",
    },
    {
      id: "2",
      name: "coinbase",      
      status: "False Reporting",
      expiresOn: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x636f696e62617365000000000000000000000000000000000000000000000000",
    },
    {
      id: "3",
      name: "hex trust",      
      status: "",
      expiresOn: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x6865782d74727573740000000000000000000000000000000000000000000000",
    },
    {
      id: "4",
      name: "okex",      
      status: "Reporting",
      expiresOn: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x6f6b000000000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "5",
      name: "huobi",      
      status: "",
      expiresOn: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x68756f6269000000000000000000000000000000000000000000000000000000",
    },
    {
      id: "6",
      name: "axie",      
      status: "",
      expiresOn: '1643673599',      
      purchasedPolicy: "$ 50K",
      key: "0x6178696500000000000000000000000000000000000000000000000000000000",
    },
  ];
};
