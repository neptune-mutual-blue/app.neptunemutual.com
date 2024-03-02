import { useState, useEffect } from 'react'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useNetwork } from '@/src/context/Network'

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
  const fetchReportsByKeyAndDate = useSubgraphFetch('useFetchReportsByKeyAndDate')
  const { networkId } = useNetwork()

  useEffect(() => {
    if (coverKey && incidentDate) {
      setLoading(true)
      fetchReportsByKeyAndDate(networkId, getQuery(coverKey, incidentDate))
        .then(({ incidentReports }) => {
          setData(incidentReports)
        })
        .catch((e) => { return console.error(e) })
        .finally(() => { return setLoading(false) })
    }
  }, [coverKey, fetchReportsByKeyAndDate, incidentDate, networkId])

  return {
    data,
    loading
  }
}
