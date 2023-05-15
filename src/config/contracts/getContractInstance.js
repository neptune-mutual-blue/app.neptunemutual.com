import { Contract } from '@ethersproject/contracts'

import VoteEscrowAbi from './abis/IVoteEscrowToken.json'

export const AvailableContracts = {
  VoteEscrowToken: 'VoteEscrowToken'
}

const getContractAbi = (abiName) => {
  switch (abiName) {
    case AvailableContracts.VoteEscrowToken:
      return VoteEscrowAbi
    default:
      return []
  }
}

export const getContractInstance = (address, abiName, provider) => {
  return new Contract(address, getContractAbi(abiName), provider)
}
