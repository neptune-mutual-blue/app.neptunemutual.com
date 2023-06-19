import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { SNAPSHOT_SPACE_ID } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { formatCurrency } from '@/utils/formatter/currency'
import {
  getCategoryFromTitle,
  getSnapshotApiURL,
  getTagFromTitle
} from '@/utils/snapshot'
import { DEFAULT_ROWS_PER_PAGE } from '@/modules/governance/proposals-table/ProposalsTable'

const getProposalsQuery = (page, rowsPerPage, titleFilter = '') => {
  const skip = (page - 1) * rowsPerPage

  return `
  proposals(
    first: ${rowsPerPage},
    skip: ${skip},
    where: {
      space_in: ["${SNAPSHOT_SPACE_ID}"],
      title_contains: "${titleFilter}"
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

const getProposalsCountQuery = () => {
  return `
space(
  id: "${SNAPSHOT_SPACE_ID}"
) {
  activeProposals
  proposalsCount
}
`
}

const parseProposalsData = (data, locale) => {
  if (!data || !Array.isArray(data?.proposals)) { return [] }

  const proposals = data.proposals.map(proposal => {
    const scoresSum = proposal.scores.reduce((acc, curr) => { return acc + curr }, 0)
    const scores = proposal.scores.map((score, i) => {
      return {
        name: proposal.choices[i],
        value: formatCurrency(score, locale, proposal.symbol, true).short,
        percent: ((score / scoresSum) * 100)
      }
    })

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
  const [lastFetchedLength, setLastFetchedLength] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const { locale } = useRouter()

  const { networkId } = useNetwork()

  const fetchProposals = useCallback(async ({ page = 1, rowsPerPage = DEFAULT_ROWS_PER_PAGE, titleFilter = '', fetchCount = true }) => {
    setLoading(true)

    const url = getSnapshotApiURL(networkId)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: `
            query ProposalsWithCount { 
              ${getProposalsQuery(page, rowsPerPage, titleFilter)} 
              ${fetchCount ? getProposalsCountQuery() : ''} 
            }
          `
        })
      })

      if (res.ok) {
        const jsonData = await res.json()
        if (jsonData.data) {
          const latestData = parseProposalsData(jsonData.data, locale)
          setData(prev => { return page > 1 ? [...prev, ...latestData] : latestData })
          setLastFetchedLength(latestData.length)
          if (jsonData.data.space) { setTotal(jsonData.data.space.proposalsCount) }
        }
      }
    } catch (error) {
      console.error(`Error in getting snapshot proposals: ${error}`)
    }
    setLoading(false)
  }, [networkId, locale])

  useEffect(() => {
    fetchProposals({})
  }, [fetchProposals])

  return {
    data,
    total,
    lastFetchedLength,
    fetchProposals,
    loading
  }
}
