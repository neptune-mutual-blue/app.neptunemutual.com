import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { useNetwork } from '@/src/context/Network'
import { useEffect, useState } from 'react'

export function useCoverOrProductData ({ coverKey, productKey }) {
  const [coverInfo, setCoverInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()
  const { getCoverOrProductData } = useCoversAndProducts()

  useEffect(() => {
    setLoading(true)
    let ignore = false
    if (!coverKey || !productKey || !networkId) {
      return
    }
    getCoverOrProductData({ coverKey, productKey, networkId })
      .then((data) => {
        if (ignore) return
        setCoverInfo(data)
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [coverKey, getCoverOrProductData, networkId, productKey])

  return { coverInfo, loading }
}
