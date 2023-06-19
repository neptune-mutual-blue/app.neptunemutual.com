import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { useEffect, useMemo, useState } from 'react'

export function useCoverDropdown () {
  const [selected, setSelected] = useState(null)
  const { loading, getAllProducts } = useCoversAndProducts2()

  const covers = useMemo(() => {
    return getAllProducts().map(x => { return { ...x, id: x.coverKey + (x.productKey || '') } })
  }, [getAllProducts])

  useEffect(() => {
    setSelected(covers.length > 0 ? covers[0] : null)
  }, [covers])

  return {
    loading,
    covers,
    selected,
    setSelected
  }
}
