import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getCoverExpiringThisMonth
} from '@/src/services/api/home/charts/cover-expiring-this-month'
import {
  getCoverPremiumByPool
} from '@/src/services/api/home/charts/cover-premium-by-pool'
import {
  getCoverSoldByPool
} from '@/src/services/api/home/charts/cover-sold-by-pool'
import { sort } from '@/utils/bn'

const getLabels = (data) => {
  const labels = new Set()

  data.forEach((curr) => {
    const name = curr.productKeyString || curr.coverKeyString
    labels.add(name)
  })

  return Array.from(labels)
}

const sortData = (data) => {
  const sorted = sort(data, x => { return x.totalProtection ?? x.totalPremium }, true)

  return sorted
}

export const useCoverInsightsData = () => {
  const fetched = useRef({})
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [labels, setLabels] = useState(null)

  const { networkId } = useNetwork()

  const fetchCoverSoldOrPremiumData = useCallback(async (dataType) => {
    if (fetched.current[dataType]) { return }

    setLoading(true)

    const functions = {
      sold: getCoverSoldByPool,
      premium: getCoverPremiumByPool,
      expiring: getCoverExpiringThisMonth
    }

    try {
      const dataArray = await functions[dataType](networkId)

      const data = sortData(dataArray)
      const labels = getLabels(data)

      setData(_data => {
        return {
          ..._data,
          [dataType]: {
            [networkId]: data
          }
        }
      })
      setLabels(_labels => {
        return {
          ..._labels,
          [dataType]: labels
        }
      })

      fetched.current[dataType] = true
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }, [networkId])

  return {
    fetchCoverSoldOrPremiumData,
    loading,
    data,
    labels
  }
}
