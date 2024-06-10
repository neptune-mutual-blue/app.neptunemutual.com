import {
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { formatUTCDateByLocale } from '@/lib/dates'
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

  // @todo: Remove this once the backend API is updated
  Object.keys(aggregatedData).forEach(chain => {
    aggregatedData[chain].reverse()
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
  const [, setLabels] = useState([])

  const { locale = 'en' } = useRouter()

  const { networkId } = useNetwork()

  const { updatedData, updatedLabels } = useMemo(() => {
    if (!data) {
      return {
        updatedData: null,
        updatedLabels: []
      }
    }

    const _data = { ...data }
    Object.keys(data).forEach(chain => {
      const arr = data[chain]

      // localize utc dates
      const localizedArr = arr.map(i => {
        return {
          ...i,
          label: formatUTCDateByLocale(locale, i.expiresOn)
        }
      })

      _data[chain] = localizedArr
    })

    const key = Object.keys(_data)[0]
    const _labels = _data[key].map(i => { return i.label })

    return {
      updatedData: _data,
      updatedLabels: _labels
    }
  }, [locale, data])

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
    data: updatedData,
    labels: updatedLabels
  }
}
