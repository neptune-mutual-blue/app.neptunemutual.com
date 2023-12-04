export const TESTNET_TOKENS = {
  84531: {
    address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
    decimal: 18
  },
  43113: {
    address: '0xF7c352D9d6967Bd916025030E38eA58cF48029f8',
    decimal: 18
  }
  // 80001: {
  //   address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
  //   decimal: 18
  // }
}

export const MAINNET_TOKENS = {
  1: {
    address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
    decimal: 18
  },
  42161: {
    address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
    decimal: 18
  },
  56: {
    address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
    decimal: 18
  },
  137: {
    address: '0x57f12FE6A4e5fe819eec699FAdf9Db2D06606bB4',
    decimal: 18
  }
}

export const LayerZeroChainIds = {
  // testnets
  84531: '10160',
  80001: '10109',
  43113: '10106',
  4002: '10112',
  97: '10102',
  // mainnet
  1: '101',
  56: '102',
  42161: '110',
  137: '109'
}

export const BRIDGE_CONTRACTS = { // Proxy
  // testnets
  84531: '0x6579dF8f986e4A982F200DAfa0c1b955A438f620',
  80001: '0x6579dF8f986e4A982F200DAfa0c1b955A438f620',
  43113: '0xFA3E2A6bCeDd965aAB297609ACc4C85bA4901E44',
  // mainnet
  1: '0x3B8f83739f71Ec2D0229ab823E8A38b8244346D5',
  42161: '0xd197D59e64caecce9C7dC43Cf5635A4A86694623',
  56: '0x41A11649c8F04855ADa97B46Af72BD4dd04eE070',
  137: '0x02c7cC334cE41988Eaf82A74Aa5449856B557d57'
}

export const GAS_LIMIT_WITHOUT_APPROVAL = 350_000

export const GAS_LIMIT_WITH_APPROVAL = 300_000

export const ABI = [
  'function estimateSendFee(uint16 _dstChainId, bytes calldata _toAddress, uint _amount, bool _useZro, bytes calldata _adapterParams) external view returns (uint nativeFee, uint zroFee)',
  'function sendFrom(address _from, uint16 _dstChainId, bytes calldata _toAddress, uint _amount, address payable _refundAddress, address _zroPaymentAddress, bytes calldata _adapterParams) external payable'
]
