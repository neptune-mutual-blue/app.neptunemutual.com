import { useState, useEffect } from 'react'
import { useSubgraphFetch } from '@/src/hooks/useSubgraphFetch'
import { useNetwork } from '@/src/context/Network'

const getQuery = (coverKey, productKey) => {
  return `
  {
    incidentReports(where: {
      coverKey: "${coverKey}"
      productKey: "${productKey}"
      finalized: false
    }) {
      id
      reporterInfo
      coverKey
      productKey
      incidentDate
    }
  }
  `
}

/**
 *
 * @param {object} param
 * @param {string} param.coverKey
 * @param {string} param.productKey
 * @returns
 */
export const useFetchCoverProductActiveReportings = ({
  coverKey,
  productKey
}) => {
  const { networkId } = useNetwork()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchCoverProductActiveReportings = useSubgraphFetch(
    'useFetchCoverProductActiveReportings'
  )

  useEffect(() => {
    if (productKey && coverKey) {
      setLoading(true)
      fetchCoverProductActiveReportings(
        networkId,
        getQuery(coverKey, productKey)
      )
        .then(({ incidentReports }) => {
          setData(incidentReports)
        })
        .catch((e) => { return console.error(e) })
        .finally(() => { return setLoading(false) })
    }
  }, [coverKey, fetchCoverProductActiveReportings, networkId, productKey])

  return {
    data,
    loading
  }
}
