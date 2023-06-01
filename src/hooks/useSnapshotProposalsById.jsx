import {
  useEffect,
  useState
} from 'react'

import {
  NPM_SNAPSHOT_SPACE,
  SNAPSHOT_TESTNET_QUERY_URL
} from '@/src/config/constants'
import { colorArrays } from '@/utils/colorArrays'
import { formatCurrency } from '@/utils/formatter/currency'
import { getTagFromTitle } from '@/utils/getTagFromTitle'

const getQuery = (id) => {
  return `
  query Proposals {
    proposals(
      where: {
        space_in: ["${NPM_SNAPSHOT_SPACE}"],
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

const parseData = (proposal, locale) => {
  const getCategoryFromTitle = (text) => {
    let category = null

    if (text.toLowerCase().includes('gce')) category = { value: 'GC Emission', type: 'success' }
    else if (text.toLowerCase().includes('block emission')) category = { value: 'Emission', type: 'danger' }
    else if (text.toLowerCase().includes('gcl')) category = { value: 'New Pool', type: 'info' }

    return category
  }

  const chainParam = {
    eth: 1,
    fuj: 43113,
    arb: 42161,
    bgo: 84531
  }

  const chainsArray = proposal.choices.map(name => chainParam[getTagFromTitle(name)])
  const chainIdsArray = [...new Set(chainsArray)]

  const scoresSum = proposal.scores.reduce((acc, curr) => acc + curr, 0)
  const scores = proposal.scores.map((score, i) => ({
    name: proposal?.choices[i],
    value: formatCurrency(score, locale, proposal.symbol, true).short,
    percent: ((score / scoresSum) * 100),
    color: colorArrays[i % colorArrays.length],
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

  useEffect(() => {
    setLoading(true)

    if (!id) return

    const fetchSnapshotById = async () => {
      try {
        const res = await fetch(SNAPSHOT_TESTNET_QUERY_URL, {
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
  }, [id, locale])

  return {
    data,
    loading
  }
}
