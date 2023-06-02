import {
  SNAPSHOT_INTERFACE_URL,
  SNAPSHOT_SPACE_ID
} from '@/src/config/constants'

export const getSubmitYourVoteUrl = (isMainNet, proposalId) => {
  const url = isMainNet ? SNAPSHOT_INTERFACE_URL.mainnet : SNAPSHOT_INTERFACE_URL.testnet

  return `${url}/#/${SNAPSHOT_SPACE_ID}/proposal/${proposalId}`
}
