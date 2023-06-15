import {
  convertToUnits,
  sumOf,
  toBN
} from '@/utils/bn'

const coverAndProductData2 = {
  chainId: '84531',
  coverKey: '0x6465666900000000000000000000000000000000000000000000000000000000',
  coverKeyString: 'defi',
  coverInfo: 'QmcGnscy5Mfdu6sc8sLWdHTMgjEuXS5rMZbc3MzWEV3yJq',
  coverInfoDetails: {
    coverKey: '0x6465666900000000000000000000000000000000000000000000000000000000',
    coverName: 'Popular DeFi Apps',
    projectName: null,
    tokenName: 'Yield Bearing USDC',
    tokenSymbol: 'iUSDC-POP',
    requiresWhitelist: false,
    supportsProducts: true,
    leverageFactor: '10',
    tags: [
      'nft',
      'exchange',
      'dex',
      'swap',
      'fork',
      'stablecoin',
      'lending',
      'flashloan',
      'borrowing',
      'interest',
      'loan',
      'staking',
      'yield',
      'insurance',
      'payment'
    ],
    about: '',
    blockchains: [
      {
        chainId: 1,
        name: 'Main Ethereum Network'
      }
    ],
    floor: '200',
    ceiling: '1200',
    reportingPeriod: 300,
    cooldownPeriod: 300,
    claimPeriod: 300,
    minStakeToReport: '2000000000000000000000',
    stakeWithFee: '25000000000000000000000',
    initialReassuranceAmount: '50000000000',
    reassuranceRate: '2500'
  },
  productKey: '0x31696e63682d7632000000000000000000000000000000000000000000000000',
  productKeyString: '1inch-v2',
  productInfo: 'QmTwXYSsMjEZFCCcsJx7JS89Rs4gezQvgqEhf7rb7tm3z1',
  productInfoDetails: {
    coverKey: '0x6465666900000000000000000000000000000000000000000000000000000000',
    productKey: '0x31696e63682d7632000000000000000000000000000000000000000000000000',
    productName: '1inch v2',
    requiresWhitelist: false,
    efficiency: '9000',
    tags: [
      'exchange',
      'dex',
      'swap',
      'aggregation'
    ],
    about: 'The 1inch Network unites decentralized protocols whose synergy enables the most lucrative, fastest, and protected operations in the DeFi space by offering access to hundreds of liquidity sources across multiple chains. The 1inch Network was launched at the ETHGlobal New York hackathon in May 2019 with the release of its Aggregation Protocol v1. Since then, 1inch Network has developed additional DeFi tools such as the Liquidity Protocol, Limit Order Protocol, P2P transactions, and 1inch Mobile Wallet.',
    blockchains: [
      {
        chainId: 1,
        name: 'Main Ethereum Network'
      }
    ],
    parameters: [
      {
        parameter: 'Cover Policy Conditions',
        type: 'condition',
        text: 'This cover is not a contract of insurance. Cover is provided on a parametric basis and the decision as to whether or not an incident is validated is determined by Neptune Mutual’s incident reporting and resolution process whereby the result is based on the number of NPM tokens or vouchers staked by the community in the resolution process; this incident reporting and validation process is community driven, but in exceptional circumstances can be overridden by the Neptune Mutual Association in order to protect against certain types of on-chain consensus attacks.',
        list: {
          type: 'unordered',
          items: [
            'This policy relates exclusively to the 1inch V2 deployed on the Ethereum blockchain.',
            'To be eligible for a claim, policyholder must hold at least 10 NPM tokens in the wallet used for the policy transaction for the full duration of the cover policy.'
          ]
        }
      },
      {
        parameter: 'Cover Parameters',
        type: 'parameter',
        text: 'All of the following parameters must be applicable for the policy to be validated:',
        list: {
          type: 'ordered',
          items: [
            'Minimum total loss of user funds from the reported incident should exceed $5 million.',
            'The designated protocol suffers a hack of user funds in which the user funds are permanently and irrecoverably stolen from the protocol.',
            'The loss arises from a smart contract vulnerability.',
            'The loss must arise from one of the following blockchains: Ethereum.'
          ]
        }
      },
      {
        parameter: 'Cover Exclusions',
        type: 'exclusion',
        list: {
          type: 'ordered',
          items: [
            'Incident on any blockchain that is not supported by this cover.',
            'Frontend, hosting, server or network infrastructure, database, DNS server, CI/CD, and/or supply-chain attacks.',
            'All exclusions present in the standard terms and conditions.'
          ]
        }
      }
    ],
    links: {
      website: 'https://1inch.io/',
      twitter: 'https://twitter.com/1inch',
      blog: 'https://blog.1inch.io/',
      documentation: 'https://docs.1inch.io/',
      reddit: 'https://www.reddit.com/r/1inch/',
      discord: 'https://discord.com/invite/1inch',
      youtube: 'https://www.youtube.com/channel/UCk0nvK4bHpteQXZKv7lkq5w',
      telegram: 'https://t.me/OneInchNetwork',
      github: 'https://github.com/1inch'
    },
    resolutionSources: [
      {
        text: '1inch Blog',
        uri: 'https://blog.1inch.io/'
      },
      {
        text: '1inch Twitter',
        uri: 'https://twitter.com/1inch'
      },
      {
        text: 'Neptune Mutual Twitter',
        uri: 'https://twitter.com/neptunemutual'
      }
    ]
  },
  productStatusEnum: 'IncidentHappened',
  productStatus: 2,
  floor: '200',
  ceiling: '1200',
  leverage: '10',
  capitalEfficiency: '9000',
  capacity: '4231683304505',
  commitment: '0',
  availableForUnderwriting: '4231683304505',
  utilizationRatio: '0.00000000000000000000000000000000',
  reassurance: '4465100000000',
  tvl: '4231683304505',
  coverageLag: '60',
  supportsProducts: false,
  requiresWhitelist: false,
  minReportingStake: '2000000000000000000000',
  activeIncidentDate: 1683190378,
  reporterCommission: 1000,
  reportingPeriod: 300,
  claimPlatformFee: 650,
  isUserWhitelisted: false,
  coverInfoUrl: '/ipfs/QmcGnscy5Mfdu6sc8sLWdHTMgjEuXS5rMZbc3MzWEV3yJq',
  productInfoUrl: '/ipfs/QmTwXYSsMjEZFCCcsJx7JS89Rs4gezQvgqEhf7rb7tm3z1'
}

const activePolicies = [
  {
    id: '0xac43b98fe7352897cbc1551cdfde231a1180cd9e-0x7e2aaac680811f8a8f0bff71c5778f7cd2b4f3cc-1664582399',
    coverKey:
      '0x68756f62692d77616e0000000000000000000000000000000000000000000000',
    productKey:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    cxToken: {
      id: '0x7e2aaac680811f8a8f0bff71c5778f7cd2b4f3cc',
      creationDate: '1659576476',
      expiryDate: '1664582399'
    },
    totalAmountToCover: '32000000',
    expiresOn: '1664582399',
    cover: {
      id: '0x68756f62692d77616e0000000000000000000000000000000000000000000000'
    },
    product: null
  },
  {
    id: '0xac43b98fe7352897cbc1551cdfde231a1180cd9e-0xb6ee2ea681a009a7f8fa5310cb499e96d4829cf2-1664582399',
    coverKey:
      '0x6262382d65786368616e67650000000000000000000000000000000000000000',
    productKey:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    cxToken: {
      id: '0xb6ee2ea681a009a7f8fa5310cb499e96d4829cf2',
      creationDate: '1658819063',
      expiryDate: '1664582399'
    },
    totalAmountToCover: '1000000000',
    expiresOn: '1664582399',
    cover: {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000000'
    },
    product: null
  }
]

export const testData = {
  covers: [
    {
      id: '0x616e696d617465642d6272616e64730000000000000000000000000000000001',
      coverKey:
        '0x616e696d617465642d6272616e64730000000000000000000000000000000001',
      coverName: 'Animated Brands',
      projectName: 'Animated Brands',
      tags: ['Smart Contract', 'NFT', 'Gaming']
    },
    {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000002',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000002',
      coverName: 'Bb8 Exchange Cover',
      projectName: 'Bb8 Exchange',
      tags: ['Smart Contract', 'DeFi', 'Exchange']
    },
    {
      id: '0x616e696d617465642d6272616e64730000000000000000000000000000000003',
      coverKey:
        '0x616e696d617465642d6272616e64730000000000000000000000000000000003',
      coverName: 'Animated Brands',
      projectName: 'Animated Brands',
      tags: ['Smart Contract', 'NFT', 'Gaming']
    },
    {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000004',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000004',
      coverName: 'Bb8 Exchange Cover',
      projectName: 'Bb8 Exchange',
      tags: ['Smart Contract', 'DeFi', 'Exchange']
    },
    {
      id: '0x616e696d617465642d6272616e64730000000000000000000000000000000005',
      coverKey:
        '0x616e696d617465642d6272616e64730000000000000000000000000000000005',
      coverName: 'Animated Brands',
      projectName: 'Animated Brands',
      tags: ['Smart Contract', 'NFT', 'Gaming']
    },
    {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000006',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000006',
      coverName: 'Bb8 Exchange Cover',
      projectName: 'Bb8 Exchange',
      tags: ['Smart Contract', 'DeFi', 'Exchange']
    },
    {
      id: '0x616e696d617465642d6272616e64730000000000000000000000000000000007',
      coverKey:
        '0x616e696d617465642d6272616e64730000000000000000000000000000000007',
      coverName: 'Animated Brands',
      projectName: 'Animated Brands',
      tags: ['Smart Contract', 'NFT', 'Gaming']
    },
    {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000008',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000008',
      coverName: 'Bb8 Exchange Cover',
      projectName: 'Bb8 Exchange',
      tags: ['Smart Contract', 'DeFi', 'Exchange']
    },
    {
      id: '0x616e696d617465642d6272616e64730000000000000000000000000000000009',
      coverKey:
        '0x616e696d617465642d6272616e64730000000000000000000000000000000009',
      coverName: 'Animated Brands',
      projectName: 'Animated Brands',
      tags: ['Smart Contract', 'NFT', 'Gaming']
    },
    {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000010',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000010',
      coverName: 'Bb8 Exchange Cover',
      projectName: 'Bb8 Exchange',
      tags: ['Smart Contract', 'DeFi', 'Exchange']
    },
    {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000011',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000011',
      coverName: 'Bb8 Exchange Cover',
      projectName: 'Bb8 Exchange',
      tags: ['Smart Contract', 'DeFi', 'Exchange']
    },
    {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000012',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000012',
      coverName: 'Bb8 Exchange Cover',
      projectName: 'Bb8 Exchange',
      tags: ['Smart Contract', 'DeFi', 'Exchange']
    },
    {
      id: '0x6262382d65786368616e67650000000000000000000000000000000000000013',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000013',
      coverName: 'Bb8 Exchange Cover',
      projectName: 'Bb8 Exchange',
      tags: ['Smart Contract', 'DeFi', 'Exchange']
    }
  ],
  coverInfo: {
    id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
    coverKey:
      '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
    supportsProducts: false,
    ipfsHash: 'QmTK8RzfNuzLrqzRepKKWQxPi1hEc6JTdzJ9bFhyW6xmAR',
    ipfsData:
      '{\n  "key": "0x616e696d617465642d6272616e64730000000000000000000000000000000000",\n  "coverName": "Animated Brands",\n  "projectName": "Animated Brands",\n  "vault": {\n    "name": "Animated Brands POD",\n    "symbol": "AB-nDAI"\n  },\n  "requiresWhitelist": false,\n  "supportsProducts": false,\n  "leverage": "1",\n  "tags": [\n    "Smart Contract",\n    "NFT",\n    "Gaming"\n  ],\n  "about": "Animated Brands is a Thailand based gaming company, and a venture capitalist firm founded in 2017 by Jack D\'Souza. It was listed on Singapore Exchange (SGX) from 23rd May, 2019.",\n  "rules": "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.",\n  "exclusions": "",\n  "links": {\n    "website": "https://www.animatedbrands.com",\n    "twitter": "https://twitter.com/animatedbrands",\n    "blog": "https://animatedbrands.medium.com",\n    "linkedin": "https://www.linkedin.com/company/animated-brands"\n  },\n  "pricingFloor": "700",\n  "pricingCeiling": "2400",\n  "reportingPeriod": 1800,\n  "cooldownPeriod": 300,\n  "claimPeriod": 1800,\n  "minReportingStake": "3400000000000000000000",\n  "resolutionSources": [\n    "https://twitter.com/animatedbrands",\n    "https://twitter.com/neptunemutual"\n  ],\n  "stakeWithFees": "50000000000000000000000",\n  "reassurance": "10000000000",\n  "reassuranceRate": "2500"\n}',
    infoObj: {
      coverName: 'Animated Brands',
      projectName: 'Animated Brands',
      leverage: '1',
      tags: ['Smart Contract', 'NFT', 'Gaming'],
      about:
        "Animated Brands is a Thailand based gaming company, and a venture capitalist firm founded in 2017 by Jack D'Souza. It was listed on Singapore Exchange (SGX) from 23rd May, 2019.",
      rules:
        '1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.',
      exclusions: '',
      links: {
        website: 'https://www.animatedbrands.com',
        twitter: 'https://twitter.com/animatedbrands',
        blog: 'https://animatedbrands.medium.com',
        linkedin: 'https://www.linkedin.com/company/animated-brands'
      },
      pricingFloor: '700',
      pricingCeiling: '2400',
      resolutionSources: [
        'https://twitter.com/animatedbrands',
        'https://twitter.com/neptunemutual'
      ]
    },
    products: []
  },
  productInfo: {
    id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000',
    coverKey:
      '0x6465666900000000000000000000000000000000000000000000000000000000',
    productKey:
      '0x31696e6368000000000000000000000000000000000000000000000000000000',
    ipfsHash: 'QmXPLJmCGNzGkBtvs5cx8xRUiXmZU4vmviWv79iuDM2mGc',
    ipfsData:
      '{\n  "coverKey": "0x6465666900000000000000000000000000000000000000000000000000000000",\n  "productKey": "0x31696e6368000000000000000000000000000000000000000000000000000000",\n  "productName": "1inch ",\n  "requiresWhitelist": false,\n  "capitalEfficiency": "9000",\n  "tags": [\n    "Smart Contract"\n  ],\n  "about": "The 1inch Network unites decentralized protocols whose synergy enables the most lucrative, fastest, and protected operations in the DeFi space by offering access to hundreds of liquidity sources across multiple chains. The 1inch Network was launched at the ETHGlobal New York hackathon in May 2019 with the release of its Aggregation Protocol v1. Since then, 1inch Network has developed additional DeFi tools such as the Liquidity Protocol, Limit Order Protocol, P2P transactions, and 1inch Mobile Wallet.",\n  "rules": "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.",\n  "exclusions": "",\n  "links": {\n    "website": "https://1inch.io/",\n    "twitter": "https://twitter.com/1inch",\n    "blog": "https://blog.1inch.io/",\n    "documentation": "https://docs.1inch.io/",\n    "reddit": "https://www.reddit.com/r/1inch/",\n    "discord": "https://discord.com/invite/1inch",\n    "youtube": "https://www.youtube.com/channel/UCk0nvK4bHpteQXZKv7lkq5w",\n    "telegram": "https://t.me/OneInchNetwork",\n    "github": "https://github.com/1inch"\n  },\n  "resolutionSources": [\n    "https://twitter.com/1inch",\n    "https://blog.1inch.io/",\n    "https://twitter.com/neptunemutual"\n  ]\n}',
    infoObj: {
      productName: '1inch ',
      capitalEfficiency: '9000',
      tags: ['Smart Contract'],
      about:
        'The 1inch Network unites decentralized protocols whose synergy enables the most lucrative, fastest, and protected operations in the DeFi space by offering access to hundreds of liquidity sources across multiple chains. The 1inch Network was launched at the ETHGlobal New York hackathon in May 2019 with the release of its Aggregation Protocol v1. Since then, 1inch Network has developed additional DeFi tools such as the Liquidity Protocol, Limit Order Protocol, P2P transactions, and 1inch Mobile Wallet.',
      rules:
        '1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.',
      exclusions: '',
      links: {
        website: 'https://1inch.io/',
        twitter: 'https://twitter.com/1inch',
        blog: 'https://blog.1inch.io/',
        documentation: 'https://docs.1inch.io/',
        reddit: 'https://www.reddit.com/r/1inch/',
        discord: 'https://discord.com/invite/1inch',
        youtube: 'https://www.youtube.com/channel/UCk0nvK4bHpteQXZKv7lkq5w',
        telegram: 'https://t.me/OneInchNetwork',
        github: 'https://github.com/1inch'
      },
      resolutionSources: [
        'https://twitter.com/1inch',
        'https://blog.1inch.io/',
        'https://twitter.com/neptunemutual'
      ]
    },
    cover: {
      id: '0x6465666900000000000000000000000000000000000000000000000000000000',
      supportsProducts: true,
      coverKey:
        '0x6465666900000000000000000000000000000000000000000000000000000000',
      ipfsHash: 'QmdNTc1SK3jESXUtmgqKWso3Cv4sV6qo9rjHN1cvprihQ3',
      ipfsData:
        '{\n  "key": "0x6465666900000000000000000000000000000000000000000000000000000000",\n  "coverName": "Popular DeFi Apps",\n  "projectName": null,\n  "vault": {\n    "name": "DAI Locked in DeFi Pool",\n    "symbol": "DAI-D"\n  },\n  "requiresWhitelist": false,\n  "supportsProducts": true,\n  "leverage": "10",\n  "tags": [\n    "Smart Contract",\n    "DEX",\n    "Liquidity"\n  ],\n  "about": "Decentralized Exchanges",\n  "blockchains": [\n    {\n      "chainId": 1,\n      "name": "Main Ethereum Network"\n    }\n  ],\n  "rules": "1. Rule 1\\n            2. Rule 2\\n            3. Rule 3",\n  "exclusions": "1. Exclusion 1\\n                 2. Exclusion 1\\n                 3. Exclusion 3",\n  "pricingFloor": "1000",\n  "pricingCeiling": "3200",\n  "reportingPeriod": 300,\n  "cooldownPeriod": 300,\n  "claimPeriod": 300,\n  "minReportingStake": "2000000000000000000000",\n  "stakeWithFees": "50000000000000000000000",\n  "reassurance": "50000000000",\n  "reassuranceRate": "2500"\n}',
      infoObj: {
        coverName: 'Popular DeFi Apps',
        projectName: null,
        leverage: '10',
        tags: ['Smart Contract', 'DEX', 'Liquidity'],
        about: 'Decentralized Exchanges',
        blockchains: [
          {
            chainId: 1,
            name: 'Main Ethereum Network'
          }
        ],
        rules: '1. Rule 1\n            2. Rule 2\n            3. Rule 3',
        exclusions:
          '1. Exclusion 1\n                 2. Exclusion 1\n                 3. Exclusion 3',
        pricingFloor: '1000',
        pricingCeiling: '3200'
      }
    }
  },
  coverInfoWithProducts: {
    id: '0x7072696d65000000000000000000000000000000000000000000000000000000',
    coverKey:
      '0x7072696d65000000000000000000000000000000000000000000000000000000',
    supportsProducts: true,
    ipfsHash: 'QmVFtqx2J5VgFXsJ1K23XzyMAGy9NNWP6LTiWhavPz5KFD',
    ipfsData:
      '{\n  "key": "0x616e696d617465642d6272616e64730000000000000000000000000000000000",\n  "coverName": "Animated Brands",\n  "projectName": "Animated Brands",\n  "vault": {\n    "name": "Animated Brands POD",\n    "symbol": "AB-nDAI"\n  },\n  "requiresWhitelist": false,\n  "supportsProducts": false,\n  "leverage": "1",\n  "tags": [\n    "Smart Contract",\n    "NFT",\n    "Gaming"\n  ],\n  "about": "Animated Brands is a Thailand based gaming company, and a venture capitalist firm founded in 2017 by Jack D\'Souza. It was listed on Singapore Exchange (SGX) from 23rd May, 2019.",\n  "rules": "1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.",\n  "exclusions": "",\n  "links": {\n    "website": "https://www.animatedbrands.com",\n    "twitter": "https://twitter.com/animatedbrands",\n    "blog": "https://animatedbrands.medium.com",\n    "linkedin": "https://www.linkedin.com/company/animated-brands"\n  },\n  "pricingFloor": "700",\n  "pricingCeiling": "2400",\n  "reportingPeriod": 1800,\n  "cooldownPeriod": 300,\n  "claimPeriod": 1800,\n  "minReportingStake": "3400000000000000000000",\n  "resolutionSources": [\n    "https://twitter.com/animatedbrands",\n    "https://twitter.com/neptunemutual"\n  ],\n  "stakeWithFees": "50000000000000000000000",\n  "reassurance": "10000000000",\n  "reassuranceRate": "2500"\n}',
    infoObj: {
      coverName: 'Prime DApps',
      projectName: null,
      leverage: '10',
      tags: ['Smart Contract', 'DEX', 'Liquidity', 'Lending', 'Borrowing'],
      about: 'Decentralized Exchanges',
      rules: '1. Rule 1\n            2. Rule 2\n            3. Rule 3',
      exclusions:
        '1. Exclusion 1\n                 2. Exclusion 1\n                 3. Exclusion 3',
      links: undefined,
      pricingFloor: '600',
      pricingCeiling: '2400',
      resolutionSources: undefined
    },
    products: [
      {
        coverKey:
          '0x7072696d65000000000000000000000000000000000000000000000000000000',
        id: '0x7072696d65000000000000000000000000000000000000000000000000000000-0x6161766500000000000000000000000000000000000000000000000000000000',
        infoObj: {
          about:
            'Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.',
          capitalEfficiency: '9000',
          exclusions: '',
          links: {
            blog: 'https://medium.com/aave',
            discord: 'https://discord.com/invite/CvKUrqM',
            documentation: 'https://docs.aave.com/',
            github: 'https://github.com/aave',
            linkedin: '',
            telegram: 'https://t.me/Aavesome',
            twitter: 'https://twitter.com/aaveaave',
            website: 'https://aave.com/'
          },
          productName: 'Aave Protocol',
          resolutionSources: [
            'https://twitter.com/aaveaave',
            'https://medium.com/aave',
            'https://twitter.com/neptunemutual'
          ],
          rules:
            '1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.',
          tags: [
            'Ehereum',
            'DApp',
            'Prime',
            'Smart Contract',
            'Lending',
            'Flash Loan',
            'Interest Bearing Tokens',
            'aToken'
          ]
        },
        ipfsData:
          '{"coverKey":"0x7072696d65000000000000000000000000000000000000000000000000000000","productKey":"0x6161766500000000000000000000000000000000000000000000000000000000","productName":"Aave Protocol","requiresWhitelist":false,"capitalEfficiency":"9000","tags":["Ehereum","DApp","Prime","Smart Contract","Lending","Flash Loan","Interest Bearing Tokens","aToken"],"about":"Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income, while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion.","rules":"1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.","exclusions":"","links":{"website":"https://aave.com/","documentation":"https://docs.aave.com/","twitter":"https://twitter.com/aaveaave","github":"https://github.com/aave","discord":"https://discord.com/invite/CvKUrqM","telegram":"https://t.me/Aavesome","blog":"https://medium.com/aave","linkedin":""},"resolutionSources":["https://twitter.com/aaveaave","https://medium.com/aave","https://twitter.com/neptunemutual"]}',
        ipfsHash: 'QmTz7b9upviKHtATQtxobsAru22WkAGCgrPkyM7tLg8UhR',
        productKey:
          '0x6161766500000000000000000000000000000000000000000000000000000000'
      },
      {
        coverKey:
          '0x7072696d65000000000000000000000000000000000000000000000000000000',
        id: '0x7072696d65000000000000000000000000000000000000000000000000000000-0x62616c616e636572000000000000000000000000000000000000000000000000',
        infoObj: {
          about:
            'Balancer is a community-driven protocol, automated portfolio manager, liquidity provider, and price sensor that empowers decentralized exchange and the automated portfolio management of tokens on the Ethereum blockchain and other EVM compatible systems.',
          capitalEfficiency: '8000',
          exclusions: '',
          links: {
            blog: 'https://medium.com/balancer-protocol',
            discord: 'https://discord.balancer.fi/',
            github: 'https://github.com/balancer-labs/',
            linkedin: 'https://www.linkedin.com/company/balancer-labs/',
            twitter: 'https://twitter.com/BalancerLabs',
            website: 'https://balancer.fi/',
            youtube: 'https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow'
          },
          productName: 'Balancer',
          resolutionSources: [
            'https://twitter.com/BalancerLabs',
            'https://medium.com/balancer-protocol',
            'https://twitter.com/neptunemutual'
          ],
          rules:
            '1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.',
          tags: [
            'Ethereum',
            'Smart Contract',
            'Portfolio Management',
            'Fundraising',
            'Liquidity'
          ]
        },
        ipfsData:
          '{"coverKey":"0x7072696d65000000000000000000000000000000000000000000000000000000","productKey":"0x62616c616e636572000000000000000000000000000000000000000000000000","productName":"Balancer","requiresWhitelist":false,"capitalEfficiency":"8000","tags":["Ethereum","Smart Contract","Portfolio Management","Fundraising","Liquidity"],"about":"Balancer is a community-driven protocol, automated portfolio manager, liquidity provider, and price sensor that empowers decentralized exchange and the automated portfolio management of tokens on the Ethereum blockchain and other EVM compatible systems.","rules":"1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.","exclusions":"","links":{"website":"https://balancer.fi/","twitter":"https://twitter.com/BalancerLabs","discord":"https://discord.balancer.fi/","blog":"https://medium.com/balancer-protocol","linkedin":"https://www.linkedin.com/company/balancer-labs/","youtube":"https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow","github":"https://github.com/balancer-labs/"},"resolutionSources":["https://twitter.com/BalancerLabs","https://medium.com/balancer-protocol","https://twitter.com/neptunemutual"]}',
        ipfsHash: 'QmaS9SsfVurGEnTs7afgRfuJC9emPCom48NFNMJoruhtGY',
        productKey:
          '0x62616c616e636572000000000000000000000000000000000000000000000000'
      },
      {
        coverKey:
          '0x7072696d65000000000000000000000000000000000000000000000000000000',
        id: '0x7072696d65000000000000000000000000000000000000000000000000000000-0x62616c616e636573000000000000000000000000000000000000000000000000',
        infoObj: {
          about:
            'Balancer is a community-driven protocol, automated portfolio manager, liquidity provider, and price sensor that empowers decentralized exchange and the automated portfolio management of tokens on the Ethereum blockchain and other EVM compatible systems.',
          capitalEfficiency: '8000',
          exclusions: '',
          links: {
            blog: 'https://medium.com/balancer-protocol',
            discord: 'https://discord.balancer.fi/',
            github: 'https://github.com/balancer-labs/',
            linkedin: 'https://www.linkedin.com/company/balancer-labs/',
            twitter: 'https://twitter.com/BalancerLabs',
            website: 'https://balancer.fi/',
            youtube: 'https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow'
          },
          productName: 'Balancer',
          resolutionSources: [
            'https://twitter.com/BalancerLabs',
            'https://medium.com/balancer-protocol',
            'https://twitter.com/neptunemutual'
          ],
          rules:
            '1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.',
          tags: [
            'Ethereum',
            'Smart Contract',
            'Portfolio Management',
            'Fundraising',
            'Liquidity'
          ]
        },
        ipfsData:
          '{"coverKey":"0x7072696d65000000000000000000000000000000000000000000000000000000","productKey":"0x62616c616e636573000000000000000000000000000000000000000000000000","productName":"Balancer","requiresWhitelist":false,"capitalEfficiency":"8000","tags":["Ethereum","Smart Contract","Portfolio Management","Fundraising","Liquidity"],"about":"Balancer is a community-driven protocol, automated portfolio manager, liquidity provider, and price sensor that empowers decentralized exchange and the automated portfolio management of tokens on the Ethereum blockchain and other EVM compatible systems.","rules":"1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.","exclusions":"","links":{"website":"https://balancer.fi/","twitter":"https://twitter.com/BalancerLabs","discord":"https://discord.balancer.fi/","blog":"https://medium.com/balancer-protocol","linkedin":"https://www.linkedin.com/company/balancer-labs/","youtube":"https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow","github":"https://github.com/balancer-labs/"},"resolutionSources":["https://twitter.com/BalancerLabs","https://medium.com/balancer-protocol","https://twitter.com/neptunemutual"]}',
        ipfsHash: 'QmaS9SsfVurGEnTs7afgRfuJC9emPCom48NFNMJoruhtGY',
        productKey:
          '0x62616c616e636573000000000000000000000000000000000000000000000000'
      },
      {
        coverKey:
          '0x7072696d65000000000000000000000000000000000000000000000000000000',
        id: '0x7072696d65000000000000000000000000000000000000000000000000000000-0x62616c616e636576000000000000000000000000000000000000000000000000',
        infoObj: {
          about:
            'Balancer is a community-driven protocol, automated portfolio manager, liquidity provider, and price sensor that empowers decentralized exchange and the automated portfolio management of tokens on the Ethereum blockchain and other EVM compatible systems.',
          capitalEfficiency: '8000',
          exclusions: '',
          links: {
            blog: 'https://medium.com/balancer-protocol',
            discord: 'https://discord.balancer.fi/',
            github: 'https://github.com/balancer-labs/',
            linkedin: 'https://www.linkedin.com/company/balancer-labs/',
            twitter: 'https://twitter.com/BalancerLabs',
            website: 'https://balancer.fi/',
            youtube: 'https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow'
          },
          productName: 'Balancer',
          resolutionSources: [
            'https://twitter.com/BalancerLabs',
            'https://medium.com/balancer-protocol',
            'https://twitter.com/neptunemutual'
          ],
          rules:
            '1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\n    3. This does not have to be your own loss.',
          tags: [
            'Ethereum',
            'Smart Contract',
            'Portfolio Management',
            'Fundraising',
            'Liquidity'
          ]
        },
        ipfsData:
          '{"coverKey":"0x7072696d65000000000000000000000000000000000000000000000000000000","productKey":"0x62616c616e636576000000000000000000000000000000000000000000000000","productName":"Balancer","requiresWhitelist":false,"capitalEfficiency":"8000","tags":["Ethereum","Smart Contract","Portfolio Management","Fundraising","Liquidity"],"about":"Balancer is a community-driven protocol, automated portfolio manager, liquidity provider, and price sensor that empowers decentralized exchange and the automated portfolio management of tokens on the Ethereum blockchain and other EVM compatible systems.","rules":"1. You must have maintained at least 1 NPM tokens in your wallet during your coverage period.\\n    2. During your coverage period, the project faced a vulnerability that resulted in user assets being stolen and the project was also unable to cover the loss themselves.\\n    3. This does not have to be your own loss.","exclusions":"","links":{"website":"https://balancer.fi/","twitter":"https://twitter.com/BalancerLabs","discord":"https://discord.balancer.fi/","blog":"https://medium.com/balancer-protocol","linkedin":"https://www.linkedin.com/company/balancer-labs/","youtube":"https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow","github":"https://github.com/balancer-labs/"},"resolutionSources":["https://twitter.com/BalancerLabs","https://medium.com/balancer-protocol","https://twitter.com/neptunemutual"]}',
        ipfsHash: 'QmaS9SsfVurGEnTs7afgRfuJC9emPCom48NFNMJoruhtGY',
        productKey:
          '0x62616c616e636576000000000000000000000000000000000000000000000000'
      }
    ]
  },
  coverStats: {
    info: {
      activeIncidentDate: '0',
      claimPlatformFee: '650',
      activeCommitment: '900000000',
      isUserWhitelisted: '',
      reporterCommission: '1000',
      reportingPeriod: '1800',
      requiresWhitelist: '',
      productStatus: 'Normal',
      totalPoolAmount: '7762051028549',
      availableLiquidity: '7761151028549',
      minReportingStake: '3400000000000000000000'
    }
  },
  reporting: {
    activeReporting: [
      {
        id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1658984960',
        reporterInfo:
          '0x43485480c5ecfa145e485d4a1e698fe5f35c054e2bf9b2847c9b215bb67a9c92',
        coverKey:
          '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
        productKey:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        incidentDate: '1658984960'
      },
      {
        id: '0x7072696d65000000000000000000000000000000000000000000000000000000-0x6161766500000000000000000000000000000000000000000000000000000000-1658984960',
        reporterInfo:
          '0x43485480c5ecfa145e485d4a1e698fe5f35c054e2bf9b2847c9b215bb67a9c92',
        coverKey:
          '0x6465666900000000000000000000000000000000000000000000000000000000',
        productKey:
          '0x31696e6368000000000000000000000000000000000000000000000000000000',
        incidentDate: '1658984960'
      }
    ],
    validReport: {
      data: {
        report: {
          incidentDate: '1654263563',
          resolutionDeadline: '1654265793',
          status: 'Normal',
          claimBeginsFrom: '1654265794',
          claimExpiresAt: '1654267594'
        }
      }
    }
  },
  policies: {
    data: {
      blockNumber: 26582383,
      transactions: [
        {
          type: 'CoverPurchased',
          key: '0x6262382d65786368616e67650000000000000000000000000000000000000000',
          account: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9',
          cxTokenAmount: '1000000000000000000000',
          stablecoinAmount: '1000000000000000000000',
          cxToken: {
            id: '0x4a1801c51b1acb083cc198fc3022d08eac0b583d',
            tokenSymbol: 'cxUSD',
            tokenName: 'bb8-exchange-cxtoken'
          },
          cover: {
            id: '0x6262382d65786368616e67650000000000000000000000000000000000000000'
          },
          transaction: {
            id: '0x90d468cb0bdd9bd02e5167a7017688072c56e58f5e68de649aec13f3c3d92654',
            timestamp: '1654238241'
          }
        },
        {
          type: 'Claimed',
          key: '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
          account: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9',
          cxTokenAmount: '100000000000000000000',
          stablecoinAmount: '100000000000000000000',
          cxToken: {
            id: '0x1e26d3104132c01ffb4bd219c2865a6436dc6ee1',
            tokenSymbol: 'cxUSD',
            tokenName: 'animated-brands-cxtoken'
          },
          cover: {
            id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000'
          },
          transaction: {
            id: '0x67cf26b73121410b9019fba892a2a70a5ab48bc8defc562b1044377c48bcd46b',
            timestamp: '1654167774'
          }
        },
        {
          type: 'CoverPurchased',
          key: '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
          account: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9',
          cxTokenAmount: '100000000000000000000',
          stablecoinAmount: '100000000000000000000',
          cxToken: {
            id: '0x1e26d3104132c01ffb4bd219c2865a6436dc6ee1',
            tokenSymbol: 'cxUSD',
            tokenName: 'animated-brands-cxtoken'
          },
          cover: {
            id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000'
          },
          transaction: {
            id: '0xc9bb4fe739341103c8939ef61dc853b9ff04aa59ae7bec468b21c3648d8d19ce',
            timestamp: '1654167673'
          }
        }
      ],
      totalCount: 3
    },
    loading: false,
    hasMore: false
  },
  network: { networkId: 80001 },
  account: {
    account: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9',
    library: null,
    active: true
  },
  heroStats: {
    availableCovers: 0,
    reportingCovers: 0,
    totalCoverage: '0',
    tvlPool: '0',
    covered: '0',
    coverFee: '0'
  },
  liquidityTxs: {
    data: {
      blockNumber: 12154268,
      transactions: [
        {
          type: 'PodsIssued',
          key: '0x68696369662d62616e6b00000000000000000000000000000000000000000000',
          account: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9',
          liquidityAmount: '500000000',
          podAmount: '500000000000000000000',
          vault: {
            id: '0x98e7786fff366aeff1a55131c92c4aa7edd68ad1',
            tokenSymbol: 'HCF-nDAI',
            tokenDecimals: 18
          },
          cover: {
            id: '0x68696369662d62616e6b00000000000000000000000000000000000000000000'
          },
          transaction: {
            id: '0x3639c211b26d20c598fe4bde46295912f3edcc3d6ca6ae03aac7eebeac450f31',
            timestamp: '1659078165'
          }
        },
        {
          type: 'PodsIssued',
          key: '0x68696369662d62616e6b00000000000000000000000000000000000000000000',
          account: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9',
          liquidityAmount: '500000000',
          podAmount: '500000000000000000000',
          vault: {
            id: '0x98e7786fff366aeff1a55131c92c4aa7edd68ad1',
            tokenSymbol: 'HCF-nDAI',
            tokenDecimals: 18
          },
          cover: {
            id: '0x68696369662d62616e6b00000000000000000000000000000000000000000000'
          },
          transaction: {
            id: '0x3639c211b26d20c598fe4bde46295912f3edcc3d6ca6ae03aac7eebeac450f31',
            timestamp: '1659078165'
          }
        }
      ],
      totalCount: 2
    },
    hasMore: false,
    loading: false
  },
  appConstants: {
    liquidityTokenDecimals: 6,
    NPMTokenAddress: '0xF7c352D9d6967Bd916025030E38eA58cF48029f8',
    NPMTokenDecimals: 18,
    NPMTokenSymbol: 'NPM',
    liquidityTokenAddress: '0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468',
    liquidityTokenSymbol: 'DAI',
    poolsTvl: '0',
    getTVLById: (_id) => '0',
    getPriceByAddress: (_address) => '0',
    roles: {
      isGovernanceAgent: false,
      isGovernanceAdmin: true,
      isLiquidityManager: false,
      isCoverManager: false
    }
  },
  pagination: {
    page: 1,
    limit: 50,
    setPage: jest.fn(),
    setLimit: jest.fn()
  },
  liquidityFormsContext: {
    accrueInterest: async () => {},
    isWithdrawalWindowOpen: false,
    info: {
      withdrawalOpen: '1659081765',
      withdrawalClose: '1659085365',
      totalReassurance: '4489008000000',
      vault: '0x98e7786ffF366AEff1A55131C92C4Aa7EDd68aD1',
      stablecoin: '0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468',
      podTotalSupply: '4698126000000000000000000',
      myPodBalance: '500000000000000000000',
      vaultStablecoinBalance: '4698126000000',
      amountLentInStrategies: '0',
      myShare: '500000000',
      myUnrealizedShare: '500000000',
      totalLiquidity: '4698126000000',
      myStablecoinBalance: '180224579590',
      stablecoinTokenSymbol: 'DAI',
      vaultTokenDecimals: '18',
      vaultTokenSymbol: 'HCF-nDAI',
      minStakeToAddLiquidity: '250000000000000000000',
      myStake: '500000000000000000000',
      isAccrualComplete: true
    },
    stakingTokenBalance: '1000000000000000000000',
    stakingTokenBalanceLoading: false,
    updateStakingTokenBalance: jest.fn(),
    refetchInfo: jest.fn()
  },
  router: {
    pathname: '/my-liquidity/[coverId]',
    route: '/my-liquidity/[coverId]',
    query: {
      coverId: 'animated-brands'
    },
    asPath: '/my-liquidity/animated-brands',
    components: {
      '/my-liquidity/[coverId]': {
        initial: true,
        props: {
          pageProps: {
            disabled: false
          },
          __N_SSP: true
        },
        __N_SSP: true,
        __N_RSC: false
      },
      '/_app': {
        styleSheets: []
      }
    },
    isFallback: false,
    basePath: '',
    locale: 'en',
    locales: ['en', 'es', 'fr', 'ja', 'zh'],
    defaultLocale: 'en',
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
    replace: jest.fn(),
    back: jest.fn(),
    push: jest.fn()
  },
  coverActiveReportings: {
    data: [],
    loading: false
  },
  claimPolicyInfo: {
    canClaim: true,
    claiming: false,
    handleClaim: jest.fn(),
    approving: false,
    handleApprove: jest.fn(),
    receiveAmount: '123124343',
    error: null,
    loadingAllowance: false,
    loadingFees: false,
    claimPlatformFee: '100000000000000000'
  },
  cxTokenRowContext: {
    tokenAddress: '',
    tokenSymbol: '',
    tokenDecimals: 0,
    loadingBalance: false,
    balance: '0',
    refetchBalance: jest.fn()
  },
  claimTableContext: {
    report: {
      claimExpiresAt: '1659311999'
    }
  },
  podStakingPools: {
    data: {
      pools: [
        {
          id: '0x6262382d65786368616e67650000000000000000000000000000000000000000',
          key: '0x6262382d65786368616e67650000000000000000000000000000000000000000',
          name: 'Earn BEC'
        },
        {
          id: '0x6372706f6f6c0000000000000000000000000000000000000000000000000000',
          key: '0x6372706f6f6c0000000000000000000000000000000000000000000000000000',
          name: 'Earn CRPOOL'
        },
        {
          id: '0x68756f62692d77616e0000000000000000000000000000000000000000000000',
          key: '0x68756f62692d77616e0000000000000000000000000000000000000000000000',
          name: 'Earn HWT'
        },
        {
          id: '0x6f626b0000000000000000000000000000000000000000000000000000000000',
          key: '0x6f626b0000000000000000000000000000000000000000000000000000000000',
          name: 'Earn OBK'
        },
        {
          id: '0x73616272652d6f7261636c657300000000000000000000000000000000000000',
          key: '0x73616272652d6f7261636c657300000000000000000000000000000000000000',
          name: 'Earn SABRE'
        },
        {
          id: '0x7832643200000000000000000000000000000000000000000000000000000000',
          key: '0x7832643200000000000000000000000000000000000000000000000000000000',
          name: 'Earn XD'
        }
      ]
    },
    loading: false,
    hasMore: false,
    handleShowMore: jest.fn()
  },
  poolInfo: {
    info: {
      stakingPoolsContractAddress: '0x0ff47939639D6213D27b5217f317665008aCdE3E',
      name: 'Earn XD',
      stakingToken: '0x90BB63b9C01b1cf1EF4Fd834Ddd25d6AE3BB3e56',
      stakingTokenStablecoinPair: '0x0000000000000000000000000000000000000000',
      rewardToken: '0xfE580ca5A2876e85489AbA1FdfCe172186302a9e',
      rewardTokenStablecoinPair: '0x9123f59C472f8186CBa11833975c08494FAB450E',
      totalStaked: '61100000000000000000000',
      target: '800000000000000000000000',
      maximumStake: '20000000000000000000000',
      stakeBalance: '21100000000000000000000',
      cumulativeDeposits: '61100000000000000000000',
      rewardPerBlock: '6400000000',
      platformFee: '25',
      lockupPeriodInBlocks: '1200',
      rewardTokenBalance: '34999983560448000000000000',
      lastRewardHeight: '0',
      lastDepositHeight: '0',
      myStake: '0',
      totalBlockSinceLastReward: '0',
      rewards: '0',
      canWithdrawFromBlockHeight: '1200',
      stakingTokenPrice: '1000000000000000000',
      rewardTokenPrice: '1930279026536796441',
      apr: '0.12996182629866943'
    },
    refetch: jest.fn()
  },
  sortableStats: {
    setStatsByKey: jest.fn(),
    getStatsByKey: jest.fn()
  },
  activePolicies: {
    data: {
      activePolicies,
      totalActiveProtection: sumOf(...activePolicies.map(policy => policy.amount)).toString()
    },
    loading: false
  },
  useExpiredPolicies: {
    data: [
      {
        id: '0xac43b98fe7352897cbc1551cdfde231a1180cd9e-0x2a405d704a54a1d4da200cb25a5a097c34629519-1661990399',
        coverKey:
            '0x68756f62692d77616e0000000000000000000000000000000000000000000000',
        productKey:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
        cxToken: {
          id: '0x2a405d704a54a1d4da200cb25a5a097c34629519',
          creationDate: '1659576567',
          expiryDate: '1661990399'
        },
        totalAmountToCover: '43000000',
        expiresOn: '1661990399',
        cover: {
          id: '0x68756f62692d77616e0000000000000000000000000000000000000000000000'
        }
      }
    ],
    loading: false
  },
  doughnutChart: {
    data: {
      datasets: [
        {
          label: '# of Votes',
          data: [0, 1],
          backgroundColor: ['#FA5C2F', '#DEEAF6'],
          borderColor: ['#FA5C2F', '#DEEAF6'],
          borderWidth: 1
        }
      ]
    }
  },
  percentXStackedChart: {
    data: {
      labels: ['votes'],
      datasets: [
        {
          data: [1],
          barThickness: 32,
          backgroundColor: '#0FB88F',
          hoverBackgroundColor: '#0FB88F'
        },
        {
          data: [0],
          barThickness: 32,
          backgroundColor: '#FA5C2F',
          hoverBackgroundColor: '#FA5C2F'
        }
      ]
    }
  },
  searchAndSortProps: {
    searchValue: '',
    onSearchChange: jest.fn(),
    sortClass: 'w-full md:w-48 lg:w-64 rounded-lg',
    containerClass: 'flex-col md:flex-row min-w-full md:min-w-sm',
    searchClass: 'w-full md:w-48 lg:w-64 rounded-lg',
    sortType: {
      name: 'A-Z'
    },
    setSortType: jest.fn()
  },
  selectProps: {
    prefix: 'Sort by: ',
    options: [
      {
        name: 'A-Z'
      },
      {
        name: 'Utilization ratio'
      },
      {
        name: 'Liquidity'
      }
    ],
    selected: {
      name: 'A-Z'
    },
    setSelected: jest.fn(),
    className: 'w-full md:w-48 lg:w-64 rounded-lg'
  },
  tokenAmountSpanProps: {
    amountInUnits: '250000000000000000000',
    symbol: 'NPM',
    className: null,
    decimals: 18
  },
  tokenAmountWithPrefixProps: {
    amountInUnits: '250000000000000000000',
    symbol: 'NPM',
    prefix: 'Minimum Stake: ',
    decimals: 18
  },
  tokenBalanceProps: {
    tokenAddress: '0x98e7786ffF366AEff1A55131C92C4Aa7EDd68aD1',
    tokenDecimals: 18,
    balance: '500000000000000000000',
    unit: 'HCF-nDAI'
  },
  toast: {
    push: jest.fn(),
    pushCustom: jest.fn(),
    pushError: jest.fn(),
    pushInfo: jest.fn(),
    pushLoading: jest.fn(),
    pushSuccess: jest.fn(),
    pushWarning: jest.fn(),
    remove: jest.fn()
  },
  registerToken: {
    register: jest.fn()
  },
  protocolDayData: {
    data: {
      totalCapacity: [
        {
          date: 1658880000,
          value: '61483097602741'
        },
        {
          date: 1658361600,
          value: '61442554000000'
        },
        {
          date: 1658361600,
          value: '61447554000000'
        },
        {
          date: 1658275200,
          value: '61434054000000'
        },
        {
          date: 1658188800,
          value: '61432804000000'
        },
        {
          date: 1658534400,
          value: '61447554000000'
        },
        {
          date: 1668102401,
          value: '61447554000000'
        },
        {
          date: 1658793600,
          value: '61469047602741'
        },

        {
          date: 1658880000,
          value: '61449554000000'
        },

        {
          date: 1658966400,
          value: '61483097602741'
        },
        {
          date: 1659052800,
          value: '61483597602741'
        },
        {
          date: 1659139200,
          value: '61483597602741'
        },
        {
          date: 1659225600,
          value: '61483697602741'
        },
        {
          date: 1659312000,
          value: '61483697602741'
        },
        {
          date: 1659398400,
          value: '61483697602741'
        },
        {
          date: 1659484800,
          value: '61483697602741'
        },
        {
          date: 1659571200,
          value: '61488419602741'
        },
        {
          date: 1659657600,
          value: '61489419602741'
        },
        {
          date: 1659744000,
          value: '61489419602741'
        },
        {
          date: 1659830400,
          value: '61489419602741'
        },
        {
          date: 1659916800,
          value: '61489519602741'
        },
        {
          date: 1660003200,
          value: '61489519602741'
        }
      ]
    },
    loading: false
  },
  resolvedReportings: {
    data: {
      incidentReports: [
        {
          id: '0x6372706f6f6c0000000000000000000000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1659524216',
          coverKey:
            '0x6372706f6f6c0000000000000000000000000000000000000000000000000000',
          productKey:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          incidentDate: '1659524216',
          resolutionDeadline: '1659597364',
          resolved: true,
          emergencyResolved: false,
          emergencyResolveTransaction: null,
          resolveTransaction: {
            timestamp: '1659597064'
          },
          finalized: true,
          status: 'Claimable',
          resolutionTimestamp: '1659524516',
          totalAttestedStake: '2000000000000000000000',
          totalRefutedStake: '0'
        },
        {
          id: '0x616e696d617465642d6272616e64730000000000000000000000000000000000-0x0000000000000000000000000000000000000000000000000000000000000000-1658995751',
          coverKey:
            '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
          productKey:
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          incidentDate: '1658995751',
          resolutionDeadline: '1659004881',
          resolved: true,
          emergencyResolved: false,
          emergencyResolveTransaction: null,
          resolveTransaction: {
            timestamp: '1659004581'
          },
          finalized: true,
          status: 'Claimable',
          resolutionTimestamp: '1658997551',
          totalAttestedStake: '4634000000000000000000',
          totalRefutedStake: '3400000000000000000000'
        },
        {
          id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1661053596',
          coverKey:
            '0x6465666900000000000000000000000000000000000000000000000000000000',
          productKey:
            '0x31696e6368000000000000000000000000000000000000000000000000000000',
          incidentDate: '1661053596',
          resolutionDeadline: '1661056130',
          resolved: true,
          emergencyResolved: false,
          emergencyResolveTransaction: null,
          resolveTransaction: {
            timestamp: '1661055830'
          },
          finalized: true,
          status: 'Claimable',
          resolutionTimestamp: '1661053896',
          totalAttestedStake: '2000000000000000000000',
          totalRefutedStake: '0'
        }
      ]
    },
    loading: false,
    hasMore: true,
    handleShowMore: jest.fn()
  },
  searchResults: {
    searchValue: '',
    filtered: [],
    setSearchValue: jest.fn()
  },
  calculateLiquidity: {
    loading: false,
    receiveAmount: '1000000000000000000'
  },
  removeLiquidity: {
    allowance: '0',
    approving: false,
    handleApprove: jest.fn(),
    handleWithdraw: jest.fn(),
    loadingAllowance: true,
    withdrawing: false
  },
  purchasePolicy: {
    balance: '47902471811',
    allowance: '594740',
    approving: true,
    updatingAllowance: true,
    purchasing: true,
    canPurchase: '',
    error: '',
    updatingBalance: true
  },
  policyFees: {
    loading: false,
    data: {
      fee: '0',
      utilizationRatio: '0',
      totalAvailableLiquidity: '0',
      floor: '0',
      ceiling: '0',
      rate: '0',
      expiryDate: '0'
    }
  },
  coverPurchased: {
    data: {
      amountToCover: '5000000000',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000000',
      createdAtTimestamp: 1660628210,
      cxToken: '0xEE73661225597c17A39316E871d722B4304d8E63',
      expiresOn: '1667260799',
      fee: '52054794',
      id: '0x3e19c6f2398efdf5f6183a168bb694421ebd5aab367eed39872a293b26a71a7c',
      onBehalfOf: '0x88fFAcb1bbB771aF326E6DFd9E0E8eA3E4E0E306',
      platformFee: '3383561',
      policyId: '49',
      productKey:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      referralCode:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      transaction: { from: '0x88fFAcb1bbB771aF326E6DFd9E0E8eA3E4E0E306' }
    }
  },
  firstReportingStake: {
    minStake: '20000000000000000000',
    fetchingMinStake: false
  },
  reportIncident: {
    tokenAddress: '',
    tokenSymbol: 'NPM',
    balance: '100000000000000000000',
    loadingBalance: false,
    approving: false,
    loadingAllowance: false,
    reporting: false,
    canReport: false,
    isError: false,
    handleApprove: jest.fn,
    handleReport: jest.fn
  },
  tokenDecimals: 18,
  disputeIncident: {
    tokenAddress: '',
    tokenSymbol: 'NPM',
    balance: '100000000000000000000',
    approving: false,
    disputing: false,
    canDispute: false,
    error: [],
    handleApprove: jest.fn,
    handleDispute: jest.fn
  },
  incidentReports: {
    data: {
      incidentReport: {
        id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1660556048',
        coverKey:
          '0x6465666900000000000000000000000000000000000000000000000000000000',
        productKey:
          '0x31696e6368000000000000000000000000000000000000000000000000000000',
        incidentDate: '1660556048',
        resolutionDeadline: '1660556956',
        resolved: true,
        resolveTransaction: {
          timestamp: '1660556656'
        },
        emergencyResolved: false,
        emergencyResolveTransaction: null,
        finalized: true,
        status: 'FalseReporting',
        decision: false,
        resolutionTimestamp: '1660556348',
        claimBeginsFrom: '0',
        claimExpiresAt: '0',
        reporter: '0x65e06b1bcf7b91974a15e5178f8aa74dee29b7c9',
        reporterInfo:
          '0x5619b6a34143138de536007cabd84e2ce16dbb3f90c7158e730437751d2c6db6',
        reporterStake: '3000000000000000000000',
        disputer: '0xae55a2fa7621093fa5e89abf410955764ac1d92b',
        disputerInfo:
          '0x8d34a6b705d4ba718992d283ac92552df62188c231f461763b71523fb2ef4307',
        disputerStake: '2000000000000000000000',
        totalAttestedStake: '3000000000000000000000',
        totalAttestedCount: '1',
        totalRefutedStake: '4000000000000000000000',
        totalRefutedCount: '2',
        reportTransaction: {
          id: '0x4c17ce606308ec7ddf286271f5901f8ba91f7347982b22425d265e537dfdd8e9',
          timestamp: '1660556048'
        },
        disputeTransaction: {
          id: '0x4bf4943eb9425bcb69a1dedfbdad41a83fee045a0421252e05986fe64d822310',
          timestamp: '1660556209'
        },
        reportIpfsData:
          '{\n  "title": "This is a test report",\n  "observed": "2022-08-14T08:46:00.000Z",\n  "proofOfIncident": [\n    "https://www.example.com/report",\n    "https://www.example.com/report_3",\n    "https://www.example.com/report_2"\n  ],\n  "description": "asdsadsadsadas",\n  "stake": "3000000000000000000000",\n  "createdBy": "0x65E06B1bCF7B91974a15e5178F8aA74Dee29b7C9",\n  "permalink": "https://app.neptunemutual.com/covers/view/0x6465666900000000000000000000000000000000000000000000000000000000/reporting/1660466760000"\n}',
        disputeIpfsData:
          '{\n  "title": "this is dispute",\n  "proofOfIncident": "[\\"https://www.example.com/dispute\\"]",\n  "description": "this is test dispuite",\n  "stake": "2000000000000000000000",\n  "createdBy": "0xAE55A2fA7621093fa5e89aBf410955764AC1d92b"\n}'
      }
    },
    loading: false,
    refetch: jest.fn()
  },
  consensusInfo: {
    info: {
      allocatedReward: '0',
      burnRate: '3000',
      claimPayouts: '0',
      decision: '3',
      latestIncidentDate: '1660795546',
      myNo: '0',
      myReward: '0',
      myStakeInWinningCamp: '0',
      myYes: '0',
      no: '4000000000000000000000',
      reporterCommission: '1000',
      rewardsUnstaken: '0',
      toBurn: '0',
      toReporter: '0',
      totalStakeInLosingCamp: '3000000000000000000000',
      totalStakeInWinningCamp: '4000000000000000000000',
      unstaken: '0',
      willReceive: '0',
      yes: '3000000000000000000000'
    },
    reportingInfo: {
      yes: '0',
      no: '0',
      myYes: '0',
      myNo: '0',
      totalStakeInWinningCamp: '0',
      totalStakeInLosingCamp: '0',
      myStakeInWinningCamp: '0',
      unstaken: '0',
      latestIncidentDate: '0',
      burnRate: '0',
      reporterCommission: '0',
      allocatedReward: '0',
      toBurn: '0',
      toReporter: '0',
      myReward: '0',
      willReceive: '0'
    }
  },
  recentVotes: {
    data: {
      votes: [
        {
          id: '0x5ee7f5d2ab3900f121caacc2283ee3a81437386084a3f890415899f0e115541b',
          createdAtTimestamp: '1660556267',
          voteType: 'Refuted',
          witness: '0xae55a2fa7621093fa5e89abf410955764ac1d92b',
          stake: '2000000000000000000000',
          transaction: {
            id: '0x5ee7f5d2ab3900f121caacc2283ee3a81437386084a3f890415899f0e115541b',
            timestamp: '1660556267'
          }
        },
        {
          id: '0x4bf4943eb9425bcb69a1dedfbdad41a83fee045a0421252e05986fe64d822310',
          createdAtTimestamp: '1660556209',
          voteType: 'Refuted',
          witness: '0xae55a2fa7621093fa5e89abf410955764ac1d92b',
          stake: '2000000000000000000000',
          transaction: {
            id: '0x4bf4943eb9425bcb69a1dedfbdad41a83fee045a0421252e05986fe64d822310',
            timestamp: '1660556209'
          }
        },
        {
          id: '0x4c17ce606308ec7ddf286271f5901f8ba91f7347982b22425d265e537dfdd8e9',
          createdAtTimestamp: '1660556048',
          voteType: 'Attested',
          witness: '0x65e06b1bcf7b91974a15e5178f8aa74dee29b7c9',
          stake: '3000000000000000000000',
          transaction: {
            id: '0x4c17ce606308ec7ddf286271f5901f8ba91f7347982b22425d265e537dfdd8e9',
            timestamp: '1660556048'
          }
        }
      ],
      _meta: {
        block: {
          number: 12678129
        }
      }
    }
  },
  unstakeReporting: {
    unstake: jest.fn(),
    unstakeWithClaim: jest.fn(),
    unstaking: false
  },
  retryUntilPassed: {
    passed: true
  },
  fetch: {
    body: null,
    bodyUsed: false,
    headers: {},
    ok: true,
    redirected: false,
    status: 200,
    statusText: '',
    type: 'cors',
    url: 'https://api.thegraph.com/subgraphs/name/test-orgs'
  },
  bondPoolAddress: '0x342108A1E04E8214B5D2f798b7217cd2268f33f5',
  txToast: {
    push: jest.fn((...args) => {
      args[2]?.onTxSuccess?.()
      args[2]?.onTxFailure?.()
      return Promise.resolve({})
    }),
    pushError: jest.fn(),
    pushSuccess: jest.fn()
  },
  txPoster: {
    contractRead: jest.fn((...args) => {
      args[0]?.onError?.()
      return Promise.resolve(toBN('100'))
    }),
    contractReadBondInfo: jest.fn((...args) => {
      args[0]?.onError?.()
      return Promise.resolve([
        ['0x97cCd316db0298498fcfD626b215955b9DF44b71'],
        [
          ['0'],
          ['75'],
          ['600'],
          ['100'],
          ['200'],
          ['1400'],
          ['0'],
          ['0'],
          ['0'],
          ['0']
        ]
      ])
    }),
    writeContract: jest.fn((arg) => {
      arg?.onTransactionResult?.({
        hash: '0x51b27a8bd577559bc1896cb841b78a878c181ab11835e7cd659d87748fa13a77',
        nonce: null,
        gasLimit: null,
        gasPrice: null,
        data: null,
        value: null,
        chainId: null,
        confirmations: 0,
        from: null,
        wait: jest.fn(() => Promise.resolve())
      })
      arg?.onRetryCancel?.()
      arg?.onError?.()
    })
  },
  errorNotifier: { notifyError: jest.fn() },
  erc20Allowance: {
    allowance: convertToUnits(90),
    loading: false,
    refetch: jest.fn(),
    approve: jest.fn((...args) => {
      args[2]?.onTransactionResult?.({
        hash: '0x51b27a8bd577559bc1896cb841b78a878c181ab11835e7cd659d87748fa13a77',
        nonce: null,
        gasLimit: null,
        gasPrice: null,
        data: null,
        value: null,
        chainId: null,
        confirmations: 0,
        from: null
      })
      args[2]?.onRetryCancel?.()
      args[2]?.onError?.('Mock Error')
    })
  },
  erc20Balance: {
    balance: convertToUnits(1000),
    loading: false,
    refetch: jest.fn()
  },
  useCreateBondArgs: {
    info: {
      lpTokenAddress: '0x97cCd316db0298498fcfD626b215955b9DF44b71',
      discountRate: '75',
      vestingTerm: '600',
      maxBond: '10000000000000000000000',
      totalNpmAllocated: '2000000000000000000000000',
      totalNpmDistributed: '1424900465944819115',
      bondContribution: '0',
      claimable: '0',
      unlockDate: '0'
    },
    refetchBondInfo: jest.fn(),
    value: '100'
  },
  writeToIpfs: 'QmYzXNoNd3b3iHogfX1xY3Rg1CGpjfBNqQUhCqG6i9Lo2U',
  readFromIpfs: 'dummy text',
  providerOrSigner: {
    provider: {
      getTransactionReceipt: jest.fn(() => Promise.resolve({}))
    },
    _address: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9',
    _index: null,
    _isSigner: true
  },
  providerOrSignerGetBlockNumber: {
    provider: {
      getBlockNumber: jest.fn(() => Promise.resolve(100))
    }
  },
  governanceAddress: '0xc16be3c0e3028c1C42Ac0dCC3C696a7F237F8060',
  unlimitedApproval: {
    unlimitedApproval: false,
    setUnlimitedApproval: jest.fn(),
    getApprovalAmount: jest.fn((_value) => _value)
  },
  authValidation: {
    requiresAuth: jest.fn()
  },
  coverPurchasedEvent: {
    transactionHash:
      '0x6b1bbdd7844aa52d1f2267770a8a3ee910d85524ec60477f45f3a550eafddf8d',
    args: {
      args: {
        coverKey:
        '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
        productKey:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        onBehalfOf: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9',
        amountToCover: toBN('100'),
        referralCode:
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      },
      cxToken: '0x0FDc3e2aFd39a4370f5d493D5D2576B8aB3c5258',
      fee: toBN('100'),
      platformFee: toBN('100'),
      expiresOn: toBN('100'),
      policyId: toBN('100'),
      from: '0x2d2caD7Eed8EDD9B11E30C01C45483fA40E819d9'
    }
  },
  myLiquidities: {
    data: { liquidityList: [], myLiquidities: {} },
    loading: false
  },
  calculateTotalLiquidity: 10,
  fetchReport: {
    data: { incidentReport: true },
    loading: false
  },
  castYourVote: {
    tokenAddress: '0xF7c352D9d6967Bd916025030E38eA58cF48029f8',
    tokenSymbol: 'NPM',
    balance: '181130000000000000000',
    approving: false,
    voting: false,
    loadingAllowance: false,
    loadingBalance: false,
    canVote: true,
    isError: false,
    handleApprove: jest.fn(),
    handleAttest: jest.fn(),
    handleRefute: jest.fn()
  },
  myLiquidityInfo: {
    stablecoin: '0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468',
    vault: '0x134A1620eCf1BA0a42Fb2664Fc63D6BD50eBD424',
    podTotalSupply: '9497947944564640430198548',
    myPodBalance: '499995217441559127270',
    vaultStablecoinBalance: '9594152807067',
    vaultTokenSymbol: 'CRPOOL-nDAI',
    vaultTokenDecimals: '18',
    myStablecoinBalance: '98550339092',
    stablecoinTokenSymbol: 'DAI',
    withdrawalStarts: '1661425749',
    withdrawalEnds: '1661429349',
    totalReassurance: '3323996000000',
    myStake: '1000000000000000000000',
    isAccrualComplete: '',
    amountLentInStrategies: '0',
    minStakeToAddLiquidity: '250000000000000000000',
    myShare: '505059676',
    myUnrealizedShare: '505059676',
    totalLiquidity: '9594152807067'
  },
  bondInfo: {
    data: {
      lpToken: '0x97cCd316db0298498fcfD626b215955b9DF44b71',
      discountRate: '75',
      vestingTerm: '600',
      maxBond: '100',
      totalNpmAllocated: '200',
      totalNpmDistributed: '1400',
      bondContribution: '0',
      claimable: '0',
      unlockDate: '0'
    },
    info: {
      bondContribution: '0',
      claimable: '0',
      discountRate: '75',
      lpTokenAddress: '0x97cCd316db0298498fcfD626b215955b9DF44b71',
      maxBond: '10000000000000000000000',
      totalNpmAllocated: '2000000000000000000000000',
      totalNpmDistributed: '1424900465944819115',
      unlockDate: '0',
      vestingTerm: '600'
    },
    details: [
      {
        title: 'Bond Price',
        value: '$1.99',
        tooltip: '1.985000000000',
        valueClasses: 'text-display-xs text-4E7DD9 mt-1'
      },
      {
        title: 'Market Price',
        value: '$2.00',
        tooltip: '2',
        valueClasses: 'text-display-xs text-9B9B9B mt-1'
      },
      {
        title: 'Maximum Bond',
        value: '10,000 NPM',
        tooltip: '10,000 NPM',
        valueClasses: 'text-sm text-9B9B9B mt-1',
        titleClasses: 'mt-7'
      },
      {
        title: 'Your Bond',
        value: '',
        tooltip: 'Not available',
        titleClasses: 'mt-7',
        valueClasses: 'text-sm text-9B9B9B mt-1'
      }
    ],
    roi: '394.2'
  },
  bondTxs: {
    hasMore: false,
    data: {
      blockNumber: '27851152',
      transactions: [
        {
          type: 'BondClaimed',
          account: '0x88ffacb1bbb771af326e6dfd9e0e8ea3e4e0e306',
          npmToVestAmount: '0',
          claimAmount: '7124503337281278227',
          lpTokenAmount: '0',
          bondPool: {
            token1: '0xf7c352d9d6967bd916025030e38ea58cf48029f8',
            token1Symbol: 'NPM',
            token1Decimals: 18,
            lpTokenSymbol: 'UNI-V2',
            lpTokenDecimals: 18
          },
          transaction: {
            id: '0xfac762d44027f90a127a667a59d52b593a9d9a4708422a7f3cf1a0178a8638d1',
            timestamp: '1661914340'
          }
        },
        {
          type: 'BondCreated',
          account: '0x88ffacb1bbb771af326e6dfd9e0e8ea3e4e0e306',
          npmToVestAmount: '7124503337281278227',
          claimAmount: '0',
          lpTokenAmount: '5000000000000',
          bondPool: {
            token1: '0xf7c352d9d6967bd916025030e38ea58cf48029f8',
            token1Symbol: 'NPM',
            token1Decimals: 18,
            lpTokenSymbol: 'UNI-V2',
            lpTokenDecimals: 18
          },
          transaction: {
            id: '0x16fe92fa49da6ba8766529cdd3625f9a86fcb753785717b36955f772a0a4df3e',
            timestamp: '1661913718'
          }
        },
        {
          type: 'BondClaimed',
          account: '0x88ffacb1bbb771af326e6dfd9e0e8ea3e4e0e306',
          npmToVestAmount: '0',
          claimAmount: '1524643085462511567',
          lpTokenAmount: '0',
          bondPool: {
            token1: '0xf7c352d9d6967bd916025030e38ea58cf48029f8',
            token1Symbol: 'NPM',
            token1Decimals: 18,
            lpTokenSymbol: 'UNI-V2',
            lpTokenDecimals: 18
          },
          transaction: {
            id: '0x41383c2cd102efef6d839b17d6c5a911b71730cf46ea3bda4156847097fdbbac',
            timestamp: '1661913633'
          }
        },
        {
          type: 'BondCreated',
          account: '0x88ffacb1bbb771af326e6dfd9e0e8ea3e4e0e306',
          npmToVestAmount: '1424900465944819115',
          claimAmount: '0',
          lpTokenAmount: '1000000000000',
          bondPool: {
            token1: '0xf7c352d9d6967bd916025030e38ea58cf48029f8',
            token1Symbol: 'NPM',
            token1Decimals: 18,
            lpTokenSymbol: 'UNI-V2',
            lpTokenDecimals: 18
          },
          transaction: {
            id: '0x36aa5b0a083bc45bf791bb250dc9720e515a3c501321bdd7d7dcf7b943b4d35e',
            timestamp: '1661912551'
          }
        },
        {
          type: 'BondCreated',
          account: '0x88ffacb1bbb771af326e6dfd9e0e8ea3e4e0e306',
          npmToVestAmount: '99742619517692452',
          claimAmount: '0',
          lpTokenAmount: '70000000000',
          bondPool: {
            token1: '0xf7c352d9d6967bd916025030e38ea58cf48029f8',
            token1Symbol: 'NPM',
            token1Decimals: 18,
            lpTokenSymbol: 'UNI-V2',
            lpTokenDecimals: 18
          },
          transaction: {
            id: '0x0621ae6c1a5b489d48ae76fd90c09a647fb3de5a4006c42f24ad813b148ec456',
            timestamp: '1661912435'
          }
        }
      ],
      totalCount: 5
    },
    loading: false
  },
  governanceReportResult: {
    result: {
      tx: {
        hash: '0x51b27a8bd577559bc1896cb841b78a878c181ab11835e7cd659d87748fa13a77',
        nonce: null,
        gasLimit: null,
        gasPrice: null,
        data: null,
        value: null,
        chainId: null,
        confirmations: 0,
        from: null
      }
    }
  },
  defaultSubgraphData: {
    cover: {
      id: '0x7832643200000000000000000000000000000000000000000000000000000000',
      coverKey:
        '0x7832643200000000000000000000000000000000000000000000000000000000',
      supportsProducts: false,
      ipfsHash: 'Qmc8ei9ixDJd34dPLUu3bF9dcKU7XP2b7rb4DPJcnJb9Sj',
      ipfsData:
        '{\n  "key": "0x7832643200000000000000000000000000000000000000000000000000000000", "coverName": "X2D2 Exchange Cover"\n}',
      products: []
    }
  },
  multicallProvider: {
    getCoverFeeInfoResult: {
      ceiling: '10000500',
      fee: '10000500',
      floor: '10000500',
      rate: '10000500',
      totalAvailableLiquidity: '10000500',
      utilizationRatio: '10000500'
    },
    getExpiryDateResult: '10039'
  },
  activePoliciesByCover: {
    activePolicies: [
      {
        id: '0xc90a988f06eacff696302240bd243f0fe6e842e5-0xb6ee2ea681a009a7f8fa5310cb499e96d4829cf2-1664582399',
        coverKey:
          '0x6262382d65786368616e67650000000000000000000000000000000000000000',
        productKey:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        cxToken: {
          id: '0xb6ee2ea681a009a7f8fa5310cb499e96d4829cf2',
          creationDate: '1658819063',
          expiryDate: '1664582399',
          tokenSymbol: 'cxUSD',
          tokenDecimals: 18
        },
        totalAmountToCover: '2000000000',
        expiresOn: '1664582399',
        cover: {
          id: '0x6262382d65786368616e67650000000000000000000000000000000000000000'
        }
      },
      {
        id: '0xc90a988f06eacff696302240bd243f0fe6e842e5-0xb6ee2ea681a009a7f8fa5310cb499e96d4829cf2-1664582399',
        coverKey:
          '0x6262382d65786368616e67650000000000000000000000000000000000000000',
        productKey:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        cxToken: {
          id: '0xb6ee2ea681a009a7f8fa5310cb499e96d4829cf2',
          creationDate: '1658819063',
          expiryDate: '1664582399',
          tokenSymbol: 'cxUSD',
          tokenDecimals: 18
        },
        totalAmountToCover: '2000000000',
        expiresOn: '1664582399',
        cover: {
          id: '0x6262382d65786368616e67650000000000000000000000000000000000000000'
        }
      }
    ],
    totalActiveProtection: '8000000000'
  },
  reports: [
    {
      id: '0x6465666900000000000000000000000000000000000000000000000000000000-0x31696e6368000000000000000000000000000000000000000000000000000000-1662551282',
      claimExpiresAt: '1662689743'
    }
  ],
  stakingPoolsAddress: '0xa85fd0D71c5780Cc4ac5c64F58abdb18D7E47d18',
  policyContractAddress: '0x762FB9cD95b7499EE57FaEF271df998c8049dCE8',
  claimsProcessorAddress: '0x762FB9cD95b7499EE57FaEF271df998c8049dCE8',
  vaultAddress: '0xf7c352d9d6967bd916025030e38ea58cf48029f8',
  protocolAddress: '0xa85fd0D71c5780Cc4ac5c64F58abdb18D7E47d18',
  referralCodeHook: {
    isValid: true,
    errorMessage: 'Invalid referral code',
    isPending: false
  },
  calculatePods: {
    receiveAmount: '100',
    loading: false
  },
  provideLiquidity: {
    npmApproving: false,
    npmBalance: '10000000000000000',
    npmBalanceLoading: false,
    hasNPMTokenAllowance: true,
    npmAllowanceLoading: false,

    hasLqTokenAllowance: true,
    lqApproving: false,
    myStablecoinBalance: 1000,
    lqAllowanceLoading: true,

    canProvideLiquidity: true,
    isError: false,
    providing: false,
    podSymbol: 'AB-nDAI',
    podAddress: '0xa85fd0D71c5780Cc4ac5c64F58abdb18D7E47d18',
    podDecimals: '16',

    handleLqTokenApprove: jest.fn(),
    handleNPMTokenApprove: jest.fn(),
    handleProvide: jest.fn()
  },
  resolveIncidentHookValues: {
    resolve: jest.fn(),
    emergencyResolve: jest.fn(),
    resolving: false,
    emergencyResolving: false
  },
  coversAndProducts2: {
    loading: false,
    data: coverAndProductData2,
    getCoverByCoverKey: () => coverAndProductData2,
    getProductsByCoverKey: () => [coverAndProductData2],
    getCoverOrProduct: jest.fn(),
    getProduct: () => coverAndProductData2,
    getAllProducts: () => [coverAndProductData2],
    getDedicatedCovers: jest.fn(),
    getDiversifiedCovers: jest.fn(),
    updateData: {}
  },
  coverDropdown: {
    loading: false,
    covers: [],
    selected: coverAndProductData2,
    setSelected: jest.fn()
  },
  getActivePolicies: activePolicies
}
