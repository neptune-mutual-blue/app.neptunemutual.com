import {
  SNAPSHOT_INTERFACE_URL,
  SNAPSHOT_SPACE_ID
} from '@/src/config/constants'
import { getNetworkInfo } from '@/utils/network'

export const getCategoryFromTitle = (text) => {
  let category = null

  if (text.toLowerCase().includes('gce')) category = { value: 'GC Emission', type: 'success' }
  else if (text.toLowerCase().includes('block emission')) category = { value: 'Emission', type: 'danger' }
  else if (text.toLowerCase().includes('gcl')) category = { value: 'New Pool', type: 'info' }

  return category
}

export const getTagFromTitle = (text) => {
  const [, , tag] = Array.from(text.match(/^(\[([a-zA-Z0-9]*)(-.*)?\])?/))
  return tag ? tag.toLowerCase() : ''
}

export const getSubmitYourVoteUrl = (networkId, proposalId) => {
  const { isMainNet } = getNetworkInfo(networkId)
  const url = isMainNet ? SNAPSHOT_INTERFACE_URL.mainnet : SNAPSHOT_INTERFACE_URL.testnet

  return `${url}/#/${SNAPSHOT_SPACE_ID}/proposal/${proposalId}`
}

export const snapshotColors = {
  success: { bg: '#ECFDF3', text: '#027A48' },
  danger: { bg: '#FFF4ED', text: '#B93815' },
  info: { bg: '#F0F9FF', text: '#026AA2' }
}
