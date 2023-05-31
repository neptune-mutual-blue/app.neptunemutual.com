import { NPM_SNAPSHOT_SPACE, SNAPSHOT_TESTNET_QUERY_URL } from '@/src/config/constants'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

const getQuery = (skip = 0) => `
query Proposals {
  proposals(
    first: 30,
    skip: ${skip},
    where: {
      space_in: ["${NPM_SNAPSHOT_SPACE}"],
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
}
`

const parseProposalsData = (data, locale) => {
  if (!data || !Array.isArray(data?.proposals)) return []

  const getTagFromTitle = (text) => {
    const [, , tag] = Array.from(text.match(/^(\[([a-zA-Z0-9]*)(-.*)?\])?/))
    return tag ? tag.toLowerCase() : ''
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
      tag: getTagFromTitle(proposal.title)
    }
  })

  return proposals
}

export const useSnapshotProposals = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { locale } = useRouter()

  const fetchProposals = useCallback(async () => {
    try {
      const res = await fetch(SNAPSHOT_TESTNET_QUERY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: getQuery()
        })
      })

      if (res.ok) {
        const data = await res.json()
        if (data.data) setData(parseProposalsData(data.data, locale))
      }
    } catch (error) {
      console.error(`Error in getting snapshot proposals: ${error}`)
    }
    setLoading(false)
  }, [locale])

  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])

  return {
    data,
    loading
  }
}
