import {
  useEffect,
  useState
} from 'react'

import {
  SNAPSHOT_API_URL,
  SNAPSHOT_SPACE_ID
} from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { getColorByIndex } from '@/utils/colorArrays'
import { formatCurrency } from '@/utils/formatter/currency'
import { getNetworkInfo } from '@/utils/network'
import {
  getCategoryFromTitle,
  getTagFromTitle
} from '@/utils/snapshot'

const getQuery = (id) => {
  return `
  query Proposals {
    proposals(
      where: {
        space_in: ["${SNAPSHOT_SPACE_ID}"],
        id: "${id}"
      },
    ) {
      id
      title
      body
      choices
      start
      end
      ipfs
      snapshot
      state
      author
      scores
      symbol
      space {
        id
        name
      }
    }
  }
  `
}

const chainParam = {
  eth: 1,
  fuj: 43113,
  arb: 42161,
  bgo: 84531
}

const parseData = (proposal, locale) => {
  const chainsArray = proposal.choices.map(name => chainParam[getTagFromTitle(name)])
  const chainIdsArray = [...new Set(chainsArray)]

  const scoresSum = proposal.scores.reduce((acc, curr) => acc + curr, 0)
  const scores = proposal.scores.map((score, i) => ({
    name: proposal?.choices[i],
    value: formatCurrency(score, locale, proposal.symbol, true).short,
    percent: ((score / scoresSum) * 100),
    color: getColorByIndex(i),
    chainId: chainParam[getTagFromTitle(proposal?.choices[i])]
  }))

  return {
    ...proposal,
    scores,
    category: getCategoryFromTitle(proposal.title),
    tag: getTagFromTitle(proposal.title),
    chains: chainIdsArray
  }
}

export const useSnapshotProposalsById = (id, locale) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const { networkId } = useNetwork()
  const { isMainNet } = getNetworkInfo(networkId)

  useEffect(() => {
    setLoading(true)

    if (!id) return

    const url = isMainNet ? SNAPSHOT_API_URL.mainnet : SNAPSHOT_API_URL.testnet

    const fetchSnapshotById = async () => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            query: getQuery(id)
          })
        })

        if (res.ok) {
          const data = await res.json()
          const parsedData = parseData(data.data?.proposals[0], locale)
          if (data.data) setData(parsedData)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSnapshotById()
  }, [id, locale, isMainNet])

  return {
    data,
    loading
  }
}
