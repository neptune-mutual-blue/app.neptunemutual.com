import { getMonthlyProtectionDataURL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { sumOf, toBN } from '@/utils/bn'
import { useState, useRef } from 'react'

const getAggregatedDataWithLabels = (data = []) => {
  const aggregatedData = {}
  const labels = []

  data.forEach(item => {
    const chain = item.chainId
    if (!aggregatedData[chain]) aggregatedData[chain] = []

    aggregatedData[chain].push({
      label: item.expiry,
      protection: item.protection,
      income: item.income,
      expired: item.expired,
      expiresOn: item.expiresOn,
      networkName: item.networkName
    })

    const label = item.expiry
    if (!labels.includes(label)) labels.push(label)
  })

  Object.keys(aggregatedData).forEach(chain => {
    const networkName = aggregatedData[chain][0].networkName
    labels.forEach((label, idx) => {
      let data = aggregatedData[chain].find(item => item.label === label)

      if (!data) {
        data = {
          label,
          protection: '0',
          income: '0',
          expired: true,
          expiresOn: new Date().toISOString(),
          networkName
        }
        aggregatedData[chain].splice(idx, 0, data)
      }
    })
  })

  const sums = {}
  labels.forEach(label => {
    sums[label] = Object.keys(aggregatedData).reduce((acc, curr) => {
      const item = aggregatedData[curr].find(i => i.label === label)
      return sumOf(acc, item?.income || '').toString()
    }, '0')
  })

  Object.keys(aggregatedData).forEach(chain => {
    aggregatedData[chain].forEach((data, idx) => {
      const label = data.label
      const sum = sums[label]
      const income = data.income
      const incomePercent = toBN(toBN(income).dividedBy(sum)).multipliedBy(100).toFixed(2).toString()

      aggregatedData[chain][idx] = {
        ...aggregatedData[chain][idx],
        incomePercent
      }
    })
  })

  return {
    data: aggregatedData,
    labels
  }
}

const useProtectionChartData = () => {
  const fetched = useRef(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [labels, setLabels] = useState([])

  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

  const fetchMonthlyProtectionData = async () => {
    if (fetched.current) return

    setLoading(true)

    try {
      const response = await fetch(
        getMonthlyProtectionDataURL(isMainNet ? 1 : 43113),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (!response.ok) {
        return
      }

      fetched.current = true

      const res = await response.json()

      const { labels, data } = getAggregatedDataWithLabels(res.data)

      setData(data)
      setLabels(labels)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return {
    fetchMonthlyProtectionData,
    loading,
    data,
    labels
  }
}

export { useProtectionChartData }
