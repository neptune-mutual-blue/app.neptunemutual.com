import { useState, useEffect } from 'react'
import { useNetwork } from '@/src/context/Network'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const isValidTimestamp = (_unix) => { return !!_unix && _unix !== '0' }

const getQuery = (start, end, coverKey, productKey) => {
  return `
  {
    incidentReports(
      where: {
        incidentDate_gt: "${start}",
        incidentDate_lt: "${end}",
        coverKey: "${coverKey}"
        productKey: "${productKey}"
      },
      orderBy: incidentDate,
      orderDirection: desc
    ) {
      incidentDate
      resolutionDeadline
      status
      claimBeginsFrom
      claimExpiresAt
    }
  }
  `
}

export const useValidReport = ({ start, end, coverKey, productKey }) => {
  const [data, setData] = useState({
    incidentReports: []
  })
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()
  const fetchValidReport = useSubgraphFetch('useValidReport')

  useEffect(() => {
    if (!isValidTimestamp(start) || !isValidTimestamp(end)) {
      return
    }

    setLoading(true)

    fetchValidReport(networkId, getQuery(start, end, coverKey, productKey))
      .then((_data) => {
        if (!_data) { return }
        setData(_data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [coverKey, end, fetchValidReport, networkId, productKey, start])

  return {
    data: {
      report: data?.incidentReports[0]
    },
    loading
  }
}
