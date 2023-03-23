import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  PRODUCT_SUMMARY_URL,
  PRODUCT_SUMMARY_WITH_ACCOUNT_URL
} from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { isValidProduct } from '@/src/helpers/cover'
import { getReplacedString } from '@/utils/string'
import { useWeb3React } from '@web3-react/core'

const CoversAndProductsDataContext = createContext({
  loading: false,
  data: [],

  // eslint-disable-next-line unused-imports/no-unused-vars
  getCoverOrProduct: (coverKey, productKey) => null,

  // eslint-disable-next-line unused-imports/no-unused-vars
  getCoverByCoverKey: (coverKey) => null,

  // eslint-disable-next-line unused-imports/no-unused-vars
  getProductsByCoverKey: (coverKey) => null,

  // eslint-disable-next-line unused-imports/no-unused-vars
  getProduct: (coverKey, productKey) => null,

  getAllProducts: () => null,
  getDedicatedCovers: () => null,
  getDiversifiedCovers: () => null,
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

  const url = useMemo(() => {
    if (account) {
      const replacements = { networkId, account }
      return getReplacedString(PRODUCT_SUMMARY_WITH_ACCOUNT_URL, replacements)
    }

    const replacements = { networkId }
    return getReplacedString(PRODUCT_SUMMARY_URL, replacements)
  }, [account, networkId])

  const updateData = useCallback(async function () {
    setLoading(true)
    try {
      const response = await fetch(
        url,
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

      const res = await response.json()

      setData(res.data
        .filter(x => x.chainId.toString() === networkId.toString())
        .sort((a, b) => {
          const text1 = a?.productInfoDetails?.productName || (a?.coverInfoDetails?.coverName || a?.coverInfoDetails?.projectName) || ''
          const text2 = b?.productInfoDetails?.productName || (b?.coverInfoDetails?.coverName || b?.coverInfoDetails?.projectName) || ''
          return text1.localeCompare(text2, 'en')
        })
      )
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }, [networkId, url])

  useEffect(() => {
    updateData()
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
    return data.filter(x => !x.productKey && !x.supportsProducts)
  }

  // Get diversified covers
  const getDiversifiedCovers = () => {
    return data.filter(x => !x.productKey && x.supportsProducts)
  }

  // Get dedicated covers and products of diverisified covers
  const getAllProducts = () => {
    return data.filter(x => x.productKey || !x.supportsProducts)
  }

  const getCoverByCoverKey = (coverKey) => {
    return data.find(x => x.coverKey === coverKey && !x.productKey)
  }

  const getProductsByCoverKey = (coverKey) => {
    return data.filter(x => x.coverKey === coverKey && x.productKey)
  }

  const getProduct = (coverKey, productKey) => {
    return data.find(x => x.coverKey === coverKey && x.productKey === productKey)
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
      updateData
    }}
    >
      {children}
    </CoversAndProductsDataContext.Provider>
  )
}
