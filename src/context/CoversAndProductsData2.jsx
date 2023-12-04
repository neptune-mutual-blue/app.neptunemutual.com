import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import { ChainConfig } from '@/src/config/hardcoded'
import { useNetwork } from '@/src/context/Network'
import { isValidProduct } from '@/src/helpers/cover'
import { getProductSummary } from '@/src/services/api/home/product-summary'
import {
  getProductSummaryWithAccount
} from '@/src/services/api/home/product-summary-with-account'
import {
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { useWeb3React } from '@web3-react/core'

const CoversAndProductsDataContext = createContext({
  loading: false,
  data: [],

  getCoverOrProduct: (_coverKey, _productKey) => { return null },

  getCoverByCoverKey: (_coverKey) => { return null },

  getProductsByCoverKey: (_coverKey) => { return null },

  getProduct: (_coverKey, _productKey) => { return null },

  getAllProducts: () => { return null },
  getDedicatedCovers: () => { return null },
  getDiversifiedCovers: () => { return null },
  getAllCovers: () => { return null },
  updateData: async () => {}
})

export function useCoversAndProducts2 () {
  const context = useContext(CoversAndProductsDataContext)
  if (context === undefined) {
    throw new Error(
      'useCoversAndProducts must be used within a CoversAndProductsProvider'
    )
  }

  return context
}

export const CoversAndProductsProvider2 = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const { networkId } = useNetwork()
  const { account } = useWeb3React()

  const stablecoinDecimals = ChainConfig[networkId]?.stablecoin.tokenDecimals ?? 6
  const npmDecimals = ChainConfig[networkId]?.npm.tokenDecimals ?? 18

  const updateData = useCallback(async function () {
    try {
      const _data = account ? await getProductSummaryWithAccount(networkId, account) : await getProductSummary(networkId)

      setData(_data
        .filter(x => {
          return x.chainId.toString() === networkId.toString()
        })
        .map(x => {
          return {
            ...x,
            availableForUnderwriting: convertToUnits(x.availableForUnderwriting, stablecoinDecimals).toString(),
            capacity: convertToUnits(x.capacity, stablecoinDecimals).toString(),
            commitment: convertToUnits(x.commitment, stablecoinDecimals).toString(),
            minReportingStake: convertToUnits(x.minReportingStake, npmDecimals).toString(),
            reassurance: convertToUnits(x.reassurance, stablecoinDecimals).toString(),
            tvl: convertToUnits(x.tvl, stablecoinDecimals).toString(),
            leverage: toBNSafe(x.leverage).isZero() ? '1' : x.leverage
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
  }, [account, networkId, npmDecimals, stablecoinDecimals])

  useEffect(() => {
    setLoading(true)
    updateData()
      .finally(() => { return setLoading(false) })
  }, [updateData])

  // Returned value can be
  // dedicated cover
  // diversified cover
  // product of diversified cover
  const getCoverOrProduct = (coverKey, productKey) => {
    return data.find(x => {
      const isSameProductKey = isValidProduct(productKey) ? x.productKey === productKey : x.productKey === null

      return x.coverKey === coverKey && isSameProductKey
    })
  }

  // Get dedicated covers
  const getDedicatedCovers = () => {
    return data.filter(x => { return !x.productKey && !x.supportsProducts })
  }

  // Get diversified covers
  const getDiversifiedCovers = () => {
    return data.filter(x => { return !x.productKey && x.supportsProducts })
  }

  // Get all covers
  const getAllCovers = () => {
    return data.filter(x => { return !x.productKey })
  }

  // Get dedicated covers and products of diverisified covers
  const getAllProducts = () => {
    return data.filter(x => { return x.productKey || !x.supportsProducts })
  }

  const getCoverByCoverKey = (coverKey) => {
    return data.find(x => { return x.coverKey === coverKey && !x.productKey })
  }

  const getProductsByCoverKey = (coverKey) => {
    return data.filter(x => { return x.coverKey === coverKey && x.productKey })
  }

  const getProduct = (coverKey, productKey) => {
    return data.find(x => { return x.coverKey === coverKey && x.productKey === productKey })
  }

  return (
    <CoversAndProductsDataContext.Provider value={{
      loading,
      data,
      getCoverByCoverKey,
      getProductsByCoverKey,
      getCoverOrProduct,
      getProduct,
      getAllProducts,
      getDedicatedCovers,
      getDiversifiedCovers,
      getAllCovers,
      updateData
    }}
    >
      {children}
    </CoversAndProductsDataContext.Provider>
  )
}
