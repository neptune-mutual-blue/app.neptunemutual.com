import {
  useEffect,
  useState
} from 'react'

import { getNetworkId } from '@/src/config/environment'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const getQuery = (coverKey) => {
  return `
  {
    incidentReports(where: {
      coverKey: "${coverKey}"
      finalized: false
    }) {
      id
      status
      productKey
      incidentDate
    }
  }
  `
}

// @todo: Instead we could expose `isCoverNormalInternal` from smart contracts
/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @returns
 */
export const useCoverActiveReportings = ({ coverKey }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchCoverActiveReportings = useSubgraphFetch(
    'useCoverActiveReportings'
  )

  useEffect(() => {
    if (!coverKey || !getNetworkId()) {
      return
    }

    setLoading(true)
    fetchCoverActiveReportings(getNetworkId(), getQuery(coverKey))
      .then((result) => {
        if (!result) {
          return
        }

        return setData(result.incidentReports)
      })
      .catch((e) => { return console.error(e) })
      .finally(() => { return setLoading(false) })
  }, [coverKey, fetchCoverActiveReportings])

  return {
    data,
    loading
  }
}
