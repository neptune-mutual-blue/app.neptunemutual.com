import { getCoverPremiumByPoolURL, getCoverSoldByPoolURL, getExpiringCoversURL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { sort } from '@/utils/bn'
import { useRef, useState } from 'react'

const getAggregatedDataFromResponses = async (response) => {
  let labels = []

  if (!response.ok) {
    return
  }

  const res = await response.json()

  if (!res.data) return

  const data = res.data
  const sorted = sort(data, x => x.totalProtection ?? x.totalPremium, true)

  const labelsSet = sorted.reduce((acc, curr) => {
    const name = curr.productKeyString || curr.coverKeyString
    acc.add(name)
    return acc
  }, new Set())
  labels = Array.from(labelsSet)

  return {
    data: { 1: sorted },
    labels
  }
}

export const useCoverInsightsData = () => {
  const fetched = useRef({})
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [labels, setLabels] = useState(null)

  const { networkId } = useNetwork()

  const fetchCoverSoldOrPremiumData = async (dataType) => {
    if (fetched.current[dataType]) return

    setLoading(true)

    const url = {
      sold: getCoverSoldByPoolURL,
      premium: getCoverPremiumByPoolURL,
      expiring: getExpiringCoversURL
    }

    try {
      const response = await fetch(
        url[dataType](networkId),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      const { data, labels } = await getAggregatedDataFromResponses(response)
      setData(_data => ({ ..._data, [dataType]: data }))
      setLabels(_labels => ({ ..._labels, [dataType]: labels }))

      fetched.current[dataType] = true
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  return {
    fetchCoverSoldOrPremiumData,
    loading,
    data,
    labels
  }
}
