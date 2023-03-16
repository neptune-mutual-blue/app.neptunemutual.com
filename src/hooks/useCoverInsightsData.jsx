import { getCoverPremiumByPoolURL, getCoverSoldByPoolURL, getExpiringCoversURL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { sort } from '@/utils/bn'
import { useState, useRef } from 'react'

const getAggregatedDataFromResponses = async (responses, networks) => {
  const aggregatedData = []
  let labels = []

  const networkNames = {
    42161: 'Arbitrum One',
    1: 'Main Ethereum Network',
    43113: 'Avalanche Fuji Testnet'
  }

  const promises = responses.map(async (response, i) => {
    const chain = networks[i]
    if (!response.ok) {
      return
    }

    const res = await response.json()

    if (!res.data) return

    if (!labels.length) {
      const labelsSet = res.data.reduce((acc, curr) => {
        const name = curr.productKeyString || curr.coverKeyString
        acc.add(name)
        return acc
      }, new Set())
      labels = Array.from(labelsSet)
    }

    const data = res.data.map(item => ({
      ...item,
      networkName: networkNames[chain],
      chainId: chain
    }))
    aggregatedData[chain] = sort(data, x => x.totalProtection ?? x.totalPremium, true)
  })

  await Promise.all(promises)

  return {
    data: aggregatedData,
    labels
  }
}

const useCoverInsightsData = () => {
  const fetched = useRef({})
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [labels, setLabels] = useState(null)

  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

  const fetchCoverSoldOrPremiumData = async (dataType) => {
    if (fetched.current[dataType]) return

    setLoading(true)

    const url = {
      sold: getCoverSoldByPoolURL,
      premium: getCoverPremiumByPoolURL,
      expiring: getExpiringCoversURL
    }

    try {
      const requests = []
      let networks = []
      if (isMainNet) networks = [1, 42161]
      else networks = [43113]

      networks.forEach(chain => {
        requests.push(fetch(
          url[dataType](chain),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        ))
      })

      const responses = await Promise.all(requests)

      const { data, labels } = await getAggregatedDataFromResponses(responses, networks)
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

export { useCoverInsightsData }
