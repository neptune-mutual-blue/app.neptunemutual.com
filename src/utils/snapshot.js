import DateLib from '@/lib/date/DateLib'
import {
  SNAPSHOT_API_URL,
  SNAPSHOT_INTERFACE_URL,
  SNAPSHOT_SPACE_ID
} from '@/src/config/constants'
import {
  sumOf,
  toBNSafe
} from '@/utils/bn'
import { getColorByIndex } from '@/utils/colorArrays'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { getNetworkInfo } from '@/utils/network'

export const getCategoryFromTitle = (text) => {
  const lowercaseText = text.toLowerCase()

  if (lowercaseText.includes('gce')) { return { value: 'GC Emission', type: 'success' } }
  if (lowercaseText.includes('block emission')) { return { value: 'Emission', type: 'danger' } }
  if (lowercaseText.includes('gcl')) { return { value: 'New Pool', type: 'info' } }

  return null
}

export const getTagFromTitle = (text = '') => {
  // Returns the text between [] in the beginning of the sentence
  const [, , tag] = Array.from(text.match(/^(\[([a-zA-Z0-9]*)(-.*)?\])?/))

  return tag ? tag.toLowerCase() : ''
}

export const getSnapshotApiURL = (networkId) => {
  const { isMainNet } = getNetworkInfo(networkId)
  const url = isMainNet ? SNAPSHOT_API_URL.mainnet : SNAPSHOT_API_URL.testnet

  return url
}

const getSnapshotInterfaceBaseURL = (networkId) => {
  const { isMainNet } = getNetworkInfo(networkId)
  const base = isMainNet ? SNAPSHOT_INTERFACE_URL.mainnet : SNAPSHOT_INTERFACE_URL.testnet

  return base
}

export const getProposalLink = (networkId, proposalId) => {
  const base = getSnapshotInterfaceBaseURL(networkId)

  return `${base}/#/${SNAPSHOT_SPACE_ID}/proposal/${proposalId}`
}

export const getSpaceLink = (networkId) => {
  const base = getSnapshotInterfaceBaseURL(networkId)

  return `${base}/#/${SNAPSHOT_SPACE_ID}`
}

export const snapshotColors = {
  success: { bg: '#ECFDF3', text: '#027A48' },
  danger: { bg: '#FFF4ED', text: '#B93815' },
  info: { bg: '#F0F9FF', text: '#026AA2' }
}

const SnapshotChainParams = {
  eth: 1,
  fuj: 43113,
  arb: 42161,
  bgo: 84531
}

export const getChoiceChainId = (choice) => {
  // fuj and fuji are considered same
  // eth and ethereum are considered same
  const matchedKey = Object.keys(SnapshotChainParams).find(key => { return getTagFromTitle(choice).startsWith(key) })

  return SnapshotChainParams[matchedKey]
}

const getPoolKeyFromChoice = (choice) => {
  const [, key] = choice.split(']')

  return key.trim()
}

export const parseChoice = (choice) => {
  return {
    chainId: getChoiceChainId(choice),
    key: safeFormatBytes32String(getPoolKeyFromChoice(choice))
  }
}

export const getEpochFromTitle = (title = '') => {
  const regex = /epoch\s+#(\d)\s*/gi
  const [, epochStr] = (regex.exec(title))

  if (isNaN(parseInt(epochStr))) {
    return null
  }

  return parseInt(epochStr)
}

export const getChainsFromChoices = (choices) => {
  const chainIds = choices.map(name => { return getChoiceChainId(name) })

  return [...new Set(chainIds)]
}

/**
 *
 * @template {{chainId: number}} T
 * @param {T[]} results
 * @param {number[]} selectedChains
 * @returns {T[]}
 */
export const getResultsByChains = (results = [], selectedChains) => {
  if (selectedChains.length === 0) {
    return results
  }

  return results.filter(option => { return selectedChains.includes(option.chainId) })
}

export const getVotingResults = (choices = [], scores = []) => {
  if (choices.length !== scores.length) {
    throw Error('Invalid scores/choices')
  }

  const totalScore = sumOf(...scores).toString()
  const results = choices.map((choice, i) => {
    const { chainId, key } = parseChoice(choice)
    const score = toBNSafe(scores[i])

    return {
      key,
      chainId,
      name: choice,
      percent: score.isGreaterThan(0) ? score.dividedBy(totalScore).toPrecision(2) : '0',
      color: getColorByIndex(i, choices.length)
    }
  })

  return results
}

export const getAsOfDate = (start, end) => {
  let date = new Date()

  if (date < DateLib.fromUnix(start)) {
    date = DateLib.fromUnix(start)
  }

  if (date > DateLib.fromUnix(end)) {
    date = DateLib.fromUnix(end)
  }

  return date
}

export const parseEmptyScores = (data) => {
  const { choices, scores } = data

  return {
    ...data,
    scores: choices.map((_, i) => { return scores[i] || 0 })
  }
}
