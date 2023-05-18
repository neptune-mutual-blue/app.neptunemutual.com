import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { getNetworkId } from '@/src/config/environment'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'

const getQuery = (reportId) => {
  return `
  {
    incidentReport(
        id: "${reportId}"
    ) {
      id
      coverKey
      productKey
      incidentDate
      resolutionDeadline
      resolved
      resolveTransaction{
        timestamp
      }
      emergencyResolved
      emergencyResolveTransaction{
        timestamp
      }
      finalized
      status
      decision
      resolutionTimestamp
      claimBeginsFrom
      claimExpiresAt
      reporter
      reporterInfo
      reporterStake
      disputer
      disputerInfo
      disputerStake
      totalAttestedStake
      totalAttestedCount
      totalRefutedStake
      totalRefutedCount
      reportTransaction {
        id
        timestamp
      }
      disputeTransaction {
        id
        timestamp
      }
      reportIpfsHash
      disputeIpfsHash
      reportIpfsData
      disputeIpfsData
    }
  }
  `
}

/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @param {string} param.productKey
 * @param {string | string[]} param.incidentDate
 * @returns
 */
export const useFetchReport = ({ coverKey, productKey, incidentDate }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const fetchReport = useSubgraphFetch('useFetchReport')

  const reportId = useMemo(() => {
    if (!coverKey || !productKey || !incidentDate) {
      return null
    }

    return `${coverKey}-${productKey}-${incidentDate}`
  }, [coverKey, incidentDate, productKey])

  const getData = useCallback(async () => {
    if (!reportId) {
      return
    }

    try {
      const data = await fetchReport(getNetworkId(), getQuery(reportId))
      if (data && data.incidentReport) {
        setData(data.incidentReport)
      }
    } catch (e) {
      console.error(e)
    }
  }, [fetchReport, reportId])

  useEffect(() => {
    async function updateData () {
      setLoading(true)
      await getData()
      setLoading(false)
    }

    updateData()
  }, [getData])

  return {
    data,
    loading,
    refetch: getData
  }
}
