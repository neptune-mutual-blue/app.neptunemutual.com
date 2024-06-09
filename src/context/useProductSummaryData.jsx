import { useCallback, useEffect, useState } from 'react'
import { ChainConfig } from '@/src/config/hardcoded'
import { getProductSummary } from '@/src/services/api/home/product-summary'
import { getProductSummaryWithAccount } from '@/src/services/api/home/product-summary-with-account'
import {
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { useWeb3React } from '@web3-react/core'

// @note: Use only once and store the data in context
export const useProductSummaryData = (networkId) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const { account } = useWeb3React()

  const updateData = useCallback(async function () {
    try {
      const _data = account ? await getProductSummaryWithAccount(networkId, account) : await getProductSummary(networkId)

      if (!_data) { return }

      setData(_data
        .map(item => {
          const itemNetworkId = parseInt(item.chainId.toString())

          const stablecoinDecimals = ChainConfig[itemNetworkId]?.stablecoin.tokenDecimals ?? 6
          const npmDecimals = ChainConfig[itemNetworkId]?.npm.tokenDecimals ?? 18

          return {
            ...item,
            availableForUnderwriting: convertToUnits(item.availableForUnderwriting || 0, stablecoinDecimals).toString(),
            capacity: convertToUnits(item.capacity || 0, stablecoinDecimals).toString(),
            commitment: convertToUnits(item.commitment || 0, stablecoinDecimals).toString(),
            minReportingStake: convertToUnits(item.minReportingStake || 0, npmDecimals).toString(),
            reassurance: convertToUnits(item.reassurance || 0, stablecoinDecimals).toString(),
            tvl: convertToUnits(item.tvl || 0, stablecoinDecimals).toString(),
            leverage: toBNSafe(item.leverage).isZero() ? '1' : item.leverage
          }
        })
        .sort((a, b) => {
          const text1 = a?.productInfoDetails?.productName || (a?.coverInfoDetails?.coverName || a?.coverInfoDetails?.projectName) || ''
          const text2 = b?.productInfoDetails?.productName || (b?.coverInfoDetails?.coverName || b?.coverInfoDetails?.projectName) || ''

          return text1.localeCompare(text2, 'en')
        })
      )
    } catch (error) {
      console.error(error)
    }
  }, [account, networkId])

  useEffect(() => {
    setLoading(true)
    updateData()
      .finally(() => { return setLoading(false) })
  }, [updateData])

  return {
    data,
    loading,
    updateData
  }
}
