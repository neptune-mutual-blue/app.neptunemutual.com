import {
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { useNetwork } from '@/src/context/Network'
import {
  getProtectionByMonth
} from '@/src/services/api/home/charts/protection-by-month'
import { formatDateByLocale } from '@/lib/dates'

const getAggregatedDataWithLabels = (data = [], locale) => {
  const aggregatedData = {}
  let labels = []

  data.forEach(item => {
    const label = formatDateByLocale(locale, new Date(item.expiresOn || item.endDate), { timeZone: 'UTC' })

    const chain = item.chainId
    if (!aggregatedData[chain]) { aggregatedData[chain] = [] }

    aggregatedData[chain].push({
      label,
      date: item.expiresOn || item.endDate,
      protection: item.protection,
      income: item.income,
      expired: item.expired,
      expiresOn: item.expiresOn,
      networkName: item.networkName,
      incomePercent: item.feeRate
    })

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

    // @ts-ignore
    const sortedArr = arr.sort((a, b) => { return new Date(b.date) - new Date(a.date) })
    aggregatedData[chain] = sortedArr
  })

  const keys = Object.keys(aggregatedData)

  if (keys.length === 0) { return { data: {}, labels: [] } }

  const key = keys[0]

  labels = aggregatedData[key].map(i => { return i.label })

  return {
    data: aggregatedData,
    labels
  }
}

export const useProtectionChartData = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [_data, _setData] = useState(undefined)

  const { locale } = useRouter()

  const { networkId } = useNetwork()

  const fetchMonthlyProtectionData = useCallback(async () => {
    if (fetched.current) { return }

    setLoading(true)

    try {
      const _data = await getProtectionByMonth(networkId)

      _setData(_data)

      fetched.current = true
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }, [networkId])

  const { data, labels } = useMemo(() => {
    return getAggregatedDataWithLabels(_data, locale)
  }, [locale, _data])

  return {
    fetchMonthlyProtectionData,
    loading,
    data,
    labels
  }
}
