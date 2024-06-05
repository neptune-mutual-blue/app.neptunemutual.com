import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { getPolicyStatus } from '@/utils/policy-status'

export function useCoverDropdown () {
  const [selected, setSelected] = useState(null)
  const { loading, getAllProducts } = useCoversAndProducts()

  const coversOrProducts = useMemo(() => {
    return getAllProducts().map(x => { return { ...x, id: x.coverKey + (x.productKey || '') } })
  }, [getAllProducts])

  const enabledItems = useMemo(() => {
    return coversOrProducts.filter((cover) => {
      const { disabled } = getPolicyStatus(cover)

      return !disabled
    })
  }, [coversOrProducts])

  useEffect(() => {
    setSelected(enabledItems.length > 0 ? enabledItems[0] : null)
  }, [enabledItems])

  return {
    loading,
    covers: enabledItems,
    selected,
    setSelected
  }
}
