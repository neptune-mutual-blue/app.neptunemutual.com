import { ethers } from 'ethers'

function formatEther (weiValue) {
  if (!weiValue) {
    return {
      gwei: '',
      ether: '',
      gweiNumeric: 0,
      gweiLong: ''
    }
  }
  const etherValue = ethers.utils.formatEther(weiValue)
  const gweiValue = +ethers.utils.formatUnits(weiValue, 'gwei')

  return {
    gwei: `${(gweiValue).toFixed(gweiValue < 1 ? 4 : 2)} gwei`,
    gweiNumeric: gweiValue,
    gweiLong: `${gweiValue} gwei`,
    ether: `${etherValue} ETH`
  }
}

export { formatEther }
