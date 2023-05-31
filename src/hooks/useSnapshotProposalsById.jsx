import {
  useEffect,
  useState
} from 'react'

import { SNAPSHOT_TESTNET_QUERY_URL } from '@/src/config/constants'
import { formatCurrency } from '@/utils/formatter/currency'

const getQuery = (id) => {
  return `
  query Proposals {
    proposals(
      where: {
        space_in: ["neptunemutual.eth"],
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
  const chartColors = ['#E31B54', '#BA24D5', '#6938EF', '#099250', '#293056', '#CA8504', '#FF692E']

  const getTagFromTitle = (text) => {
    const [, , tag] = Array.from(text.match(/^(\[([a-zA-Z0-9]*)(-.*)?\])?/))
    return tag ? tag.toLowerCase() : ''
  }

  const scoresSum = proposal.scores.reduce((acc, curr) => acc + curr, 0)
  const scores = proposal.scores.map((score, i) => ({
    name: proposal?.choices[i],
    value: formatCurrency(score, locale, proposal.symbol, true).short,
    percent: ((score / scoresSum) * 100),
    color: chartColors[i % chartColors.length]
  }))

  return {
    ...proposal,
    scores,
    tag: getTagFromTitle(proposal.title)
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
