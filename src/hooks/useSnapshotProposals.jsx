import {
  useCallback,
  useState
} from 'react'

import {
  DEFAULT_ROWS_PER_PAGE
} from '@/modules/governance/proposals-table/ProposalsTable'
import { useNetwork } from '@/src/context/Network'
import { useLanguageContext } from '@/src/i18n/i18n'
import { formatCurrency } from '@/utils/formatter/currency'
import {
  getCategoryFromTitle,
  getSnapshotApiURL,
  getSnapshotSpaceId,
  getTagFromTitle
} from '@/utils/snapshot'

const getProposalsQuery = (networkId, page, rowsPerPage, titleFilter = '') => {
  const skip = (page - 1) * rowsPerPage

  const spaceId = getSnapshotSpaceId(networkId)

  return `query ProposalsWithCount {
  proposals(
    first: ${rowsPerPage},
    skip: ${skip},
    where: {
      space_in: ["${spaceId}"],
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
  space(
    id: "${spaceId}"
  ) {
    activeProposals
    proposalsCount
  }
}`
}

const parseProposalsData = (data, locale) => {
  if (!data || !Array.isArray(data?.proposals)) { return [] }

  const proposals = data.proposals.map((proposal) => {
    const scoresSum = proposal.scores.reduce((acc, curr) => { return acc + curr }, 0)
    const scores = proposal.choices.map((choice, i) => {
      const score = proposal.scores[i] || 0

      return {
        name: choice,
        value: score ? formatCurrency(score, locale, proposal.symbol, true).short : `0 ${proposal.symbol}`,
        percent: ((score / scoresSum) * 100) || 0
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
  const { locale } = useLanguageContext()

  const { networkId } = useNetwork()

  const fetchProposals = useCallback(async ({ page = 1, rowsPerPage = DEFAULT_ROWS_PER_PAGE, titleFilter = '' }) => {
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
          query: getProposalsQuery(networkId, page, rowsPerPage, titleFilter)
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

  return {
    data,
    total,
    lastFetchedLength,
    fetchProposals,
    loading
  }
}
