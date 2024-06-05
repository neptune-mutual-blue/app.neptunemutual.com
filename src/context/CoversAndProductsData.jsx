import {
  createContext,
  useContext,
  useMemo
} from 'react'

import { useNetwork } from '@/src/context/Network'

import { summaryHelpers } from '@/src/helpers/product-summary'
import { useProductSummaryData } from './useProductSummaryData'

const defaultContext = {
  loading: false,
  getCoverOrProduct: (_coverKey, _productKey) => { return null },
  getCoverByCoverKey: (_coverKey) => { return null },
  getProductsByCoverKey: (_coverKey) => { return null },
  getProduct: (_coverKey, _productKey) => { return null },
  getAllProducts: () => { return null },
  getDedicatedCovers: () => { return null },
  getDiversifiedCovers: () => { return null },
  getAllCovers: () => { return null },
  updateData: async () => {}
}

const FullProductSummary = createContext(defaultContext)

const CurrentNetworkProductSummary = createContext(defaultContext)

export function useCoversAndProducts () {
  const context = useContext(CurrentNetworkProductSummary)
  if (context === undefined) {
    throw new Error(
      'useCoversAndProducts must be used within a CurrentNetworkProductSummary'
    )
  }

  return context
}

export function useAllCoversAndProducts () {
  const context = useContext(FullProductSummary)
  if (context === undefined) {
    throw new Error(
      'useAllCoversAndProducts must be used within a FullProductSummary'
    )
  }

  return context
}

export const CoversAndProductsProvider = ({ children }) => {
  const { networkId } = useNetwork()
  const { data, loading, updateData } = useProductSummaryData(networkId)

  const allNetworkContext = useMemo(() => {
    return {
      loading,
      getCoverByCoverKey: (...args) => { return summaryHelpers.getCoverByCoverKey(data, ...args) },
      getProductsByCoverKey: (...args) => { return summaryHelpers.getProductsByCoverKey(data, ...args) },
      getCoverOrProduct: (...args) => { return summaryHelpers.getCoverOrProduct(data, ...args) },
      getProduct: (...args) => { return summaryHelpers.getProduct(data, ...args) },
      getAllProducts: () => { return summaryHelpers.getAllProducts(data) },
      getDedicatedCovers: () => { return summaryHelpers.getDedicatedCovers(data) },
      getDiversifiedCovers: () => { return summaryHelpers.getDiversifiedCovers(data) },
      getAllCovers: () => { return summaryHelpers.getAllCovers(data) },
      updateData
    }
  }, [data, loading, updateData])

  const currentNetworkContext = useMemo(() => {
    const currentNetworkData = data.filter(x => {
      return x.chainId.toString() === networkId.toString()
    })

    return {
      loading,
      getCoverByCoverKey: (...args) => { return summaryHelpers.getCoverByCoverKey(currentNetworkData, ...args) },
      getProductsByCoverKey: (...args) => { return summaryHelpers.getProductsByCoverKey(currentNetworkData, ...args) },
      getCoverOrProduct: (...args) => { return summaryHelpers.getCoverOrProduct(currentNetworkData, ...args) },
      getProduct: (...args) => { return summaryHelpers.getProduct(currentNetworkData, ...args) },
      getAllProducts: () => { return summaryHelpers.getAllProducts(currentNetworkData) },
      getDedicatedCovers: () => { return summaryHelpers.getDedicatedCovers(currentNetworkData) },
      getDiversifiedCovers: () => { return summaryHelpers.getDiversifiedCovers(currentNetworkData) },
      getAllCovers: () => { return summaryHelpers.getAllCovers(currentNetworkData) },
      updateData
    }
  }, [data, loading, networkId, updateData])

  return (
    <FullProductSummary.Provider value={allNetworkContext}>
      <CurrentNetworkProductSummary.Provider value={currentNetworkContext}>
        {children}
      </CurrentNetworkProductSummary.Provider>
    </FullProductSummary.Provider>
  )
}
