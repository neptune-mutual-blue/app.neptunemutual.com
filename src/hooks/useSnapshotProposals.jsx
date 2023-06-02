import { SNAPSHOT_SPACE_ID, SNAPSHOT_API_URL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { formatCurrency } from '@/utils/formatter/currency'
import { getNetworkInfo } from '@/utils/network'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

const getProposalsQuery = (page, rowsPerPage) => {
  const skip = (page - 1) * rowsPerPage
  return `
  proposals(
    first: ${rowsPerPage},
    skip: ${skip},
    where: {
      space_in: ["${SNAPSHOT_SPACE_ID}"],
    },
    orderBy: "created",
    orderDirection: desc
  ) {
    id
    title
    choices
    start
    symbol
    end
    state
    scores
    space {
      id
      name
    }
  }
  `
}

const getProposalsCountQuery = () => `
space(
  id: "${SNAPSHOT_SPACE_ID}"
) {
  activeProposals
  proposalsCount
}
`

const parseProposalsData = (data, locale) => {
  if (!data || !Array.isArray(data?.proposals)) return []

  const getTagFromTitle = (text) => {
    const [, , tag] = Array.from(text.match(/^(\[([a-zA-Z0-9]*)(-.*)?\])?/))
    return tag ? tag.toLowerCase() : ''
  }

  const getCategoryFromTitle = (text) => {
    let category = null

    if (text.toLowerCase().includes('gce')) category = { value: 'GC Emission', type: 'success' }
    else if (text.toLowerCase().includes('block emission')) category = { value: 'Emission', type: 'danger' }
    else if (text.toLowerCase().includes('gcl')) category = { value: 'New Pool', type: 'info' }

    return category
  }

  const proposals = data.proposals.map(proposal => {
    const scoresSum = proposal.scores.reduce((acc, curr) => acc + curr, 0)
    const scores = proposal.scores.map((score, i) => ({
      name: proposal.choices[i],
      value: formatCurrency(score, locale, proposal.symbol, true).short,
      percent: ((score / scoresSum) * 100)
    }))

    return {
      ...proposal,
      scores,
      state: proposal.state === 'active' ? 'Live' : 'Closed',
      tag: getTagFromTitle(proposal.title),
      category: getCategoryFromTitle(proposal.title)
    }
  })

  return proposals
}

export const useSnapshotProposals = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const { locale } = useRouter()

  const { networkId } = useNetwork()
  const { isTestNet } = getNetworkInfo(networkId)

  const fetchProposals = useCallback(async ({ page = 1, rowsPerPage = 10, fetchCount = true }) => {
    setLoading(true)
    try {
      const url = isTestNet ? SNAPSHOT_API_URL.testnet : SNAPSHOT_API_URL.mainnet
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: `
            query ProposalsWithCount { 
              ${getProposalsQuery(page, rowsPerPage)} 
              ${fetchCount ? getProposalsCountQuery() : ''} 
            }
          `
        })
      })

      if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.data) {
          setData(parseProposalsData(jsonData.data, locale))
          if (jsonData.data.space) setTotal(jsonData.data.space.proposalsCount)
        }
      }
    } catch (error) {
      console.error(`Error in getting snapshot proposals: ${error}`)
    }
    setLoading(false)
  }, [locale, isTestNet])

  useEffect(() => {
    fetchProposals({})
  }, [fetchProposals])

  return {
    data,
    total,
    fetchProposals,
    loading
  }
}
