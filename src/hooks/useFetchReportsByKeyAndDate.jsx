import { useState, useEffect } from 'react'
import { getNetworkId } from '@/src/config/environment'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const getQuery = (coverKey, incidentDate) => {
  return `
  {
    incidentReports (
      where: {
        coverKey: "${coverKey}"
        incidentDate: "${incidentDate}"
        decision: true
        resolved: true
      }
    ) {
      id
      claimExpiresAt
    }
  }

  `
}

/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @param {string | string[]} param.incidentDate
 * @returns
 */
export const useFetchReportsByKeyAndDate = ({ coverKey, incidentDate }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchReportsByKeyAndDate = useSubgraphFetch(
    'useFetchReportsByKeyAndDate'
  )

  useEffect(() => {
    if (coverKey && incidentDate) {
      setLoading(true)
      fetchReportsByKeyAndDate(getNetworkId(), getQuery(coverKey, incidentDate))
        .then(({ incidentReports }) => {
          setData(incidentReports)
        })
        .catch((e) => { return console.error(e) })
        .finally(() => { return setLoading(false) })
    }
  }, [coverKey, fetchReportsByKeyAndDate, incidentDate])

  return {
    data,
    loading
  }
}
