import {
  useCallback,
  useRef,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getProtectionByMonth
} from '@/src/services/api/home/charts/protection-by-month'
import { sortDates } from '@/utils/sorting'

const getAggregatedDataWithLabels = (data = []) => {
  const aggregatedData = {}
  let labels = []

  data.forEach(item => {
    const chain = item.chainId
    if (!aggregatedData[chain]) { aggregatedData[chain] = [] }

    aggregatedData[chain].push({
      label: item.expiry,
      protection: item.protection,
      income: item.income,
      expired: item.expired,
      expiresOn: item.expiresOn,
      networkName: item.networkName,
      incomePercent: item.feeRate
    })

    const label = item.expiry
    if (!labels.includes(label)) { labels.push(label) }
  })

  Object.keys(aggregatedData).forEach(chain => {
    const networkName = aggregatedData[chain][0].networkName
    labels.forEach((label, idx) => {
      let data = aggregatedData[chain].find(item => { return item.label === label })

      if (!data) {
        data = {
          label,
          protection: '0',
          income: '0',
          expired: true,
          expiresOn: new Date().toISOString(),
          networkName,
          incomePercent: '0'
        }
        aggregatedData[chain].splice(idx, 0, data)
      }
    })
  })

  Object.keys(aggregatedData).forEach(chain => {
    const arr = aggregatedData[chain]
    const sortedArr = sortDates(
      arr,
      x => { return x.label }
    )
    aggregatedData[chain] = sortedArr
  })

  const key = Object.keys(aggregatedData)[0]
  labels = aggregatedData[key].map(i => { return i.label })

  return {
    data: aggregatedData,
    labels
  }
}

export const useProtectionChartData = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [labels, setLabels] = useState([])

  const { networkId } = useNetwork()

  const fetchMonthlyProtectionData = useCallback(async () => {
    if (fetched.current) { return }

    setLoading(true)

    try {
      const _data = await getProtectionByMonth(networkId)

      const { labels, data } = getAggregatedDataWithLabels(_data)

      setData(data)
      fetched.current = true
      setLabels(labels)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }, [networkId])

  return {
    fetchMonthlyProtectionData,
    loading,
    data,
    labels
  }
}
